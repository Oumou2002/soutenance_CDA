from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.db import models
from django.db.models.functions import ExtractMonth
from django.core.files.uploadedfile import InMemoryUploadedFile


from api import serializer as api_serializer
from api import models as api_models
from userauths.models import User, Profile

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, APIView, permission_classes
from rest_framework.exceptions import PermissionDenied


import random
from decimal import Decimal
import stripe
import requests
from datetime import datetime, timedelta
from distutils.util import strtobool


# Updates
from django.core.files.storage import default_storage
import os

from django.core.files.base import ContentFile
import math
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from moviepy import VideoFileClip


def ensure_user_scope(request, user_id):
    try:
        scoped_user_id = int(user_id)
    except (TypeError, ValueError):
        raise PermissionDenied("Invalid user scope.")
    if request.user.id != scoped_user_id:
        raise PermissionDenied("You can only access your own resources.")


def ensure_teacher_scope(request, teacher_id):
    teacher = get_object_or_404(api_models.Teacher, id=teacher_id)
    if teacher.user_id != request.user.id:
        raise PermissionDenied("You can only access your own teacher resources.")
    return teacher


# Create your views here.
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer


class ChangePasswordAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.UserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        old_password = request.data["old_password"]
        new_password = request.data["new_password"]

        user = User.objects.get(id=user_id)
        if request.user.id != user.id:
            return Response(
                {"message": "Requete de changement de mot de passe non autorisee.", "icon": "error"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if check_password(old_password, user.password):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Mot de passe modifie avec succes.", "icon": "success"})
        return Response({"message": "Ancien mot de passe incorrect.", "icon": "warning"})


class PasswordChangeAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        password = request.data.get("password")
        otp = request.data.get("otp")
        uuidb64 = request.data.get("uuidb64")
        refresh_token = request.data.get("refresh_token")

        if not all([password, otp, uuidb64, refresh_token]):
            return Response(
                {"message": "Champs requis manquants.", "icon": "error"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(id=uuidb64, otp=otp, refresh_token=refresh_token).first()
        if not user:
            return Response(
                {"message": "Informations de reinitialisation invalides.", "icon": "error"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password)
        user.otp = None
        user.refresh_token = None
        user.save()

        return Response(
            {"message": "Mot de passe reinitialise avec succes. Connectez-vous.", "icon": "success"},
            status=status.HTTP_200_OK,
        )


class ProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = api_serializer.ProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        user_id = self.kwargs["user_id"]
        if self.request.user.id != int(user_id):
            raise PermissionDenied("You can only access your own profile.")
        return get_object_or_404(Profile, user_id=user_id)


class PasswordResetEmailVerifyAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer

    def get_object(self):
        email = self.kwargs["email"]  # api/v1/password-email-verify/desphixs@gmail.com/

        user = User.objects.filter(email=email).first()

        if user:
            uuidb64 = user.pk
            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh)

            user.refresh_token = refresh_token
            user.otp = generate_random_otp()
            user.save()

            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5190")
            link = f"{frontend_url}/create-new-password/?otp={user.otp}&uuidb64={uuidb64}&refresh_token={refresh_token}"

            # context = {"link": link, "username": user.username}

            # subject = "Password Rest Email"
            # text_body = render_to_string("email/password_reset.txt", context)
            # html_body = render_to_string("email/password_reset.html", context)

            # msg = EmailMultiAlternatives(
            #     subject=subject,
            #     from_email=settings.FROM_EMAIL,
            #     to=[user.email],
            #     body=text_body,
            # )

            # msg.attach_alternative(html_body, "text/html")
            # msg.send()

            print("link ======", link)
        return user


def generate_random_otp(length=7):
    otp = "".join([str(random.randint(0, 9)) for _ in range(length)])
    return otp


#


class CategoryListAPIView(generics.ListAPIView):
    queryset = api_models.Category.objects.filter(active=True)
    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]


class CourseListAPIView(generics.ListAPIView):
    queryset = api_models.Course.objects.filter(
        platform_status="Published", teacher_course_status="Published"
    )
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]


class TeacherCourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [IsAuthenticated]
    queryset = api_models.Course.objects.all()

    def get_object(self):
        course_id = self.kwargs["course_id"]
        course = api_models.Course.objects.get(course_id=course_id)
        if not course.teacher or course.teacher.user_id != self.request.user.id:
            raise PermissionDenied("You can only access your own course.")
        return course


def get_access_token(client_id, secret_key):
    token_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = {"grant_type": "client_credentials"}
    auth = (client_id, secret_key)
    response = requests.post(token_url, data=data, auth=auth)

    if response.status_code == 200:
        print("Access TOken ====", response.json()["access_token"])
        return response.json()["access_token"]
    else:
        raise Exception(
            f"Failed to get access token from paypal {response.status_code}"
        )


class SearchCourseAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get("query")
        # learn lms
        return api_models.Course.objects.filter(
            title__icontains=query,
            platform_status="Published",
            teacher_course_status="Published",
        )


class CartCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CartOrderItemSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        course_id = request.data.get("course_id")
        cart_id = request.data.get("cart_id")
        user_id = request.data.get("user_id")
        country_name = request.data.get("country_name")
        price_input = request.data.get("price")

        if not course_id or not cart_id:
            return Response(
                {"message": "course_id and cart_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        course = get_object_or_404(api_models.Course, id=course_id)

        existing_item = api_models.CartOrderItem.objects.filter(
            cart_id=cart_id, course=course, order__isnull=True
        ).first()
        if existing_item:
            serializer = self.get_serializer(existing_item)
            return Response(
                {"message": "Course already in cart", "item": serializer.data},
                status=status.HTTP_200_OK,
            )

        user = None
        if str(user_id).isdigit() and int(user_id) > 0:
            user = User.objects.filter(id=int(user_id)).first()

        try:
            price = Decimal(str(price_input if price_input is not None else course.price or 0))
        except Exception:
            price = Decimal("0.00")

        tax_rate = 0
        if country_name:
            country = api_models.Country.objects.filter(
                name__iexact=country_name, active=True
            ).first()
            if country:
                tax_rate = country.tax_rate

        tax_fee = (price * Decimal(tax_rate)) / Decimal("100")
        total = price + tax_fee

        cart_item = api_models.CartOrderItem.objects.create(
            user=user,
            teacher=course.teacher,
            course=course,
            price=price,
            tax_fee=tax_fee,
            total=total,
            country=country_name or "",
            cart_id=cart_id,
        )
        serializer = self.get_serializer(cart_item)
        return Response(
            {"message": "Course added to cart", "item": serializer.data},
            status=status.HTTP_201_CREATED,
        )


class CartListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CartOrderItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        return api_models.CartOrderItem.objects.filter(
            cart_id=cart_id, order__isnull=True
        ).order_by("-date")


class StudentSummaryAPIView(generics.ListAPIView):
    serializer_class = api_serializer.StudentSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        ensure_user_scope(self.request, user_id)
        user = User.objects.get(id=user_id)

        total_courses = api_models.EnrolledCourse.objects.filter(user=user).count()
        completed_lessons = api_models.CompletedLesson.objects.filter(user=user).count()
        achieved_certificates = api_models.Certificate.objects.filter(user=user).count()

        return [
            {
                "total_courses": total_courses,
                "completed_lessons": completed_lessons,
                "achieved_certificates": achieved_certificates,
            }
        ]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class StudentCourseListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.EnrolledCourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        ensure_user_scope(self.request, user_id)
        user = User.objects.get(id=user_id)
        return api_models.EnrolledCourse.objects.filter(user=user)


class StudentCourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.EnrolledCourseSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "enrollment_id"

    def get_object(self):
        user_id = self.kwargs["user_id"]
        enrollment_id = self.kwargs["enrollment_id"]
        ensure_user_scope(self.request, user_id)

        user = User.objects.get(id=user_id)
        return api_models.EnrolledCourse.objects.get(
            user=user, enrollment_id=enrollment_id
        )


class StudentCourseCompletedCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.CompletedLessonSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        course_id = request.data["course_id"]
        variant_item_id = request.data["variant_item_id"]
        ensure_user_scope(request, user_id)

        user = User.objects.get(id=user_id)
        course = api_models.Course.objects.get(id=course_id)
        variant_item = api_models.VariantItem.objects.get(
            variant_item_id=variant_item_id
        )
        is_enrolled = api_models.EnrolledCourse.objects.filter(
            user=user, course=course
        ).exists()
        if not is_enrolled:
            return Response(
                {"message": "You are not enrolled in this course"},
                status=status.HTTP_403_FORBIDDEN,
            )

        completed_lessons = api_models.CompletedLesson.objects.filter(
            user=user, course=course, variant_item=variant_item
        ).first()

        if completed_lessons:
            completed_lessons.delete()
            return Response({"message": "Course marked as not completed"})

        else:
            api_models.CompletedLesson.objects.create(
                user=user, course=course, variant_item=variant_item
            )
            return Response({"message": "Course marked as completed"})


class StudentNoteCreateAPIView(generics.ListCreateAPIView):
    serializer_class = api_serializer.NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        enrollment_id = self.kwargs["enrollment_id"]
        ensure_user_scope(self.request, user_id)

        user = User.objects.get(id=user_id)
        enrolled = api_models.EnrolledCourse.objects.get(enrollment_id=enrollment_id)
        if enrolled.user_id != user.id:
            raise PermissionDenied("You can only access your own notes.")

        return api_models.Note.objects.filter(user=user, course=enrolled.course)

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        enrollment_id = request.data["enrollment_id"]
        title = request.data["title"]
        note = request.data["note"]
        ensure_user_scope(request, user_id)

        user = User.objects.get(id=user_id)
        enrolled = api_models.EnrolledCourse.objects.get(enrollment_id=enrollment_id)
        if enrolled.user_id != user.id:
            raise PermissionDenied("You can only access your own notes.")

        api_models.Note.objects.create(
            user=user, course=enrolled.course, note=note, title=title
        )

        return Response(
            {"message": "Note created successfullly"}, status=status.HTTP_201_CREATED
        )


class StudentNoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializer.NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        enrollment_id = self.kwargs["enrollment_id"]
        note_id = self.kwargs["note_id"]
        ensure_user_scope(self.request, user_id)

        user = User.objects.get(id=user_id)
        enrolled = api_models.EnrolledCourse.objects.get(enrollment_id=enrollment_id)
        if enrolled.user_id != user.id:
            raise PermissionDenied("You can only access your own notes.")
        note = api_models.Note.objects.get(
            user=user, course=enrolled.course, id=note_id
        )
        return note


class StudentRateCourseCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        course_id = request.data["course_id"]
        rating = request.data["rating"]
        review = request.data["review"]
        ensure_user_scope(request, user_id)

        user = User.objects.get(id=user_id)
        course = api_models.Course.objects.get(id=course_id)

        api_models.Review.objects.create(
            user=user,
            course=course,
            review=review,
            rating=rating,
            active=True,
        )

        return Response(
            {"message": "Review created successfullly"}, status=status.HTTP_201_CREATED
        )


class StudentRateCourseUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        review_id = self.kwargs["review_id"]
        ensure_user_scope(self.request, user_id)

        user = User.objects.get(id=user_id)
        return api_models.Review.objects.get(id=review_id, user=user)


class StudentWishListListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = api_serializer.WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        ensure_user_scope(self.request, user_id)
        user = User.objects.get(id=user_id)
        return api_models.Wishlist.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        user_id = request.data["user_id"]
        course_id = request.data["course_id"]
        ensure_user_scope(request, user_id)

        user = User.objects.get(id=user_id)
        course = api_models.Course.objects.get(id=course_id)

        wishlist = api_models.Wishlist.objects.filter(user=user, course=course).first()
        if wishlist:
            wishlist.delete()
            return Response({"message": "Wishlist Deleted"}, status=status.HTTP_200_OK)
        else:
            api_models.Wishlist.objects.create(user=user, course=course)
            return Response(
                {"message": "Wishlist Created"}, status=status.HTTP_201_CREATED
            )


class QuestionAnswerListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = api_serializer.Question_AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.kwargs["course_id"]
        course = api_models.Course.objects.get(id=course_id)
        return api_models.Question_Answer.objects.filter(course=course)

    def create(self, request, *args, **kwargs):
        course_id = request.data["course_id"]
        user_id = request.data["user_id"]
        title = request.data["title"]
        message = request.data["message"]
        ensure_user_scope(request, user_id)

        user = User.objects.get(id=user_id)
        course = api_models.Course.objects.get(id=course_id)

        question = api_models.Question_Answer.objects.create(
            course=course, user=user, title=title
        )

        api_models.Question_Answer_Message.objects.create(
            course=course, user=user, message=message, question=question
        )

        return Response(
            {"message": "Group conversation Started"}, status=status.HTTP_201_CREATED
        )


class QuestionAnswerMessageSendAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.Question_Answer_MessageSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        course_id = request.data["course_id"]
        qa_id = request.data["qa_id"]
        user_id = request.data["user_id"]
        message = request.data["message"]
        ensure_user_scope(request, user_id)

        user = User.objects.get(id=user_id)
        course = api_models.Course.objects.get(id=course_id)
        question = api_models.Question_Answer.objects.get(qa_id=qa_id)
        if question.course_id != course.id:
            return Response(
                {"message": "Question does not belong to the provided course"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        api_models.Question_Answer_Message.objects.create(
            course=course, user=user, message=message, question=question
        )

        question_serializer = api_serializer.Question_AnswerSerializer(question)
        return Response(
            {"messgae": "Message Sent", "question": question_serializer.data}
        )


class TeacherSummaryAPIView(generics.ListAPIView):
    serializer_class = api_serializer.TeacherSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = ensure_teacher_scope(self.request, teacher_id)

        one_month_ago = datetime.today() - timedelta(days=28)

        total_courses = api_models.Course.objects.filter(teacher=teacher).count()
        total_revenue = (
            api_models.CartOrderItem.objects.filter(
                teacher=teacher, order__payment_status="Paid"
            ).aggregate(total_revenue=models.Sum("price"))["total_revenue"]
            or 0
        )
        monthly_revenue = (
            api_models.CartOrderItem.objects.filter(
                teacher=teacher, order__payment_status="Paid", date__gte=one_month_ago
            ).aggregate(total_revenue=models.Sum("price"))["total_revenue"]
            or 0
        )

        enrolled_courses = api_models.EnrolledCourse.objects.filter(teacher=teacher)
        unique_student_ids = set()
        students = []

        for course in enrolled_courses:
            if course.user_id not in unique_student_ids:
                user = User.objects.get(id=course.user_id)
                student = {
                    "full_name": user.profile.full_name,
                    "image": user.profile.image.url,
                    "country": user.profile.country,
                    "date": course.date,
                }

                students.append(student)
                unique_student_ids.add(course.user_id)

        return [
            {
                "total_courses": total_courses,
                "total_revenue": total_revenue,
                "monthly_revenue": monthly_revenue,
                "total_students": len(students),
            }
        ]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TeacherCourseListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = ensure_teacher_scope(self.request, teacher_id)
        return api_models.Course.objects.filter(teacher=teacher)


class TeacherReviewListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = ensure_teacher_scope(self.request, teacher_id)
        return api_models.Review.objects.filter(course__teacher=teacher)


class TeacherReviewDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = api_serializer.ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        teacher_id = self.kwargs["teacher_id"]
        review_id = self.kwargs["review_id"]
        teacher = ensure_teacher_scope(self.request, teacher_id)
        return api_models.Review.objects.get(course__teacher=teacher, id=review_id)


class TeacherStudentsListAPIVIew(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, teacher_id=None):
        teacher = ensure_teacher_scope(request, teacher_id)

        enrolled_courses = api_models.EnrolledCourse.objects.filter(teacher=teacher)
        unique_student_ids = set()
        students = []

        for course in enrolled_courses:
            if course.user_id not in unique_student_ids:
                user = User.objects.get(id=course.user_id)
                student = {
                    "full_name": user.profile.full_name,
                    "image": user.profile.image.url,
                    "country": user.profile.country,
                    "date": course.date,
                }

                students.append(student)
                unique_student_ids.add(course.user_id)

        return Response(students)


@api_view(("GET",))
@permission_classes([IsAuthenticated])
def TeacherAllMonthEarningAPIView(request, teacher_id):
    teacher = ensure_teacher_scope(request, teacher_id)
    monthly_earning_tracker = (
        api_models.CartOrderItem.objects.filter(
            teacher=teacher, order__payment_status="Paid"
        )
        .annotate(month=ExtractMonth("date"))
        .values("month")
        .annotate(total_earning=models.Sum("price"))
        .order_by("month")
    )

    return Response(monthly_earning_tracker)


class TeacherBestSellingCourseAPIView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, teacher_id=None):
        teacher = ensure_teacher_scope(request, teacher_id)
        courses_with_total_price = []
        courses = api_models.Course.objects.filter(teacher=teacher)

        for course in courses:
            revenue = (
                course.enrolledcourse_set.aggregate(
                    total_price=models.Sum("order_item__price")
                )["total_price"]
                or 0
            )
            sales = course.enrolledcourse_set.count()

            courses_with_total_price.append(
                {
                    "course_image": course.image.url,
                    "course_title": course.title,
                    "revenue": revenue,
                    "sales": sales,
                }
            )

        return Response(courses_with_total_price)


class TeacherQuestionAnswerListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.Question_AnswerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = ensure_teacher_scope(self.request, teacher_id)
        return api_models.Question_Answer.objects.filter(course__teacher=teacher)


class TeacherNotificationListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        teacher_id = self.kwargs["teacher_id"]
        teacher = ensure_teacher_scope(self.request, teacher_id)
        return api_models.Notification.objects.filter(teacher=teacher, seen=False)


class TeacherNotificationDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        teacher_id = self.kwargs["teacher_id"]
        noti_id = self.kwargs["noti_id"]
        teacher = ensure_teacher_scope(self.request, teacher_id)
        return api_models.Notification.objects.get(teacher=teacher, id=noti_id)


class CourseCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get("title")
        description = request.data.get("description")
        image = request.data.get("image")
        file = request.data.get("file")
        level = request.data.get("level")
        language = request.data.get("language")
        price = request.data.get("price")
        category = request.data.get("category")

        category_obj = api_models.Category.objects.filter(id=category).first()
        teacher = api_models.Teacher.objects.get(user=request.user)

        course = api_models.Course.objects.create(
            teacher=teacher,
            category=category_obj,
            file=file,
            image=image,
            title=title,
            description=description,
            price=price,
            language=language,
            level=level,
        )

        return Response(
            {"message": "Course Created", "course_id": course.course_id},
            status=status.HTTP_201_CREATED,
        )


# class CourseCreateAPIView(generics.CreateAPIView):
#     querysect = api_models.Course.objects.all()
#     serializer_class = api_serializer.CourseSerializer
#     permisscion_classes = [AllowAny]

#     def perform_create(self, serializer):
#         serializer.is_valid(raise_exception=True)
#         course_instance = serializer.save()

#         variant_data = []
#         for key, value in self.request.data.items():
#             if key.startswith('variant') and '[variant_title]' in key:
#                 index = key.split('[')[1].split(']')[0]
#                 title = value

#                 variant_dict = {'title': title}
#                 item_data_list = []
#                 current_item = {}
#                 variant_data = []

#                 for item_key, item_value in self.request.data.items():
#                     if f'variants[{index}][items]' in item_key:
#                         field_name = item_key.split('[')[-1].split(']')[0]
#                         if field_name == "title":
#                             if current_item:
#                                 item_data_list.append(current_item)
#                             current_item = {}
#                         current_item.update({field_name: item_value})

#                 if current_item:
#                     item_data_list.append(current_item)

#                 variant_data.append({'variant_data': variant_dict, 'variant_item_data': item_data_list})

#         for data_entry in variant_data:
#             variant = api_models.Variant.objects.create(title=data_entry['variant_data']['title'], course=course_instance)

#             for item_data in data_entry['variant_item_data']:
#                 preview_value = item_data.get("preview")
#                 preview = bool(strtobool(str(preview_value))) if preview_value is not None else False

#                 api_models.VariantItem.objects.create(
#                     variant=variant,
#                     title=item_data.get("title"),
#                     description=item_data.get("description"),
#                     file=item_data.get("file"),
#                     preview=preview,
#                 )

#     def save_nested_data(self, course_instance, serializer_class, data):
#         serializer = serializer_class(data=data, many=True, context={"course_instance": course_instance})
#         serializer.is_valid(raise_exception=True)
#         serializer.save(course=course_instance)


class CourseUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = api_models.Course.objects.all()
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        teacher_id = self.kwargs["teacher_id"]
        course_id = self.kwargs["course_id"]

        teacher = ensure_teacher_scope(self.request, teacher_id)
        course = api_models.Course.objects.get(course_id=course_id)
        if course.teacher_id != teacher.id:
            raise PermissionDenied("You can only update your own course.")

        return course

    def update(self, request, *args, **kwargs):
        course = self.get_object()
        serializer = self.get_serializer(course, data=request.data)
        serializer.is_valid(raise_exception=True)

        if "image" in request.data and isinstance(
            request.data["image"], InMemoryUploadedFile
        ):
            course.image = request.data["image"]
        elif "image" in request.data and str(request.data["image"]) == "No File":
            course.image = None

        if "file" in request.data and not str(request.data["file"]).startswith(
            "http://"
        ):
            course.file = request.data["file"]

        if (
            "category" in request.data
            and request.data["category"] != "NaN"
            and request.data["category"] != "undefined"
        ):
            category = api_models.Category.objects.get(id=request.data["category"])
            course.category = category

        self.perform_update(serializer)
        self.update_variant(course, request.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update_variant(self, course, request_data):
        for key, value in request_data.items():
            if key.startswith("variants") and "[variant_title]" in key:
                index = key.split("[")[1].split("]")[0]
                title = value

                id_key = f"variants[{index}][variant_id]"
                variant_id = request_data.get(id_key)

                variant_data = {"title": title}
                item_data_list = []
                current_item = {}

                for item_key, item_value in request_data.items():
                    if f"variants[{index}][items]" in item_key:
                        field_name = item_key.split("[")[-1].split("]")[0]
                        if field_name == "title":
                            if current_item:
                                item_data_list.append(current_item)
                            current_item = {}
                        current_item.update({field_name: item_value})

                if current_item:
                    item_data_list.append(current_item)

                existing_variant = course.variant_set.filter(id=variant_id).first()

                if existing_variant:
                    existing_variant.title = title
                    existing_variant.save()

                    for item_data in item_data_list[1:]:
                        preview_value = item_data.get("preview")
                        preview = (
                            bool(strtobool(str(preview_value)))
                            if preview_value is not None
                            else False
                        )

                        variant_item = api_models.VariantItem.objects.filter(
                            variant_item_id=item_data.get("variant_item_id")
                        ).first()

                        if not str(item_data.get("file")).startswith("http://"):
                            if item_data.get("file") != "null":
                                file = item_data.get("file")
                            else:
                                file = None

                            title = item_data.get("title")
                            description = item_data.get("description")

                            if variant_item:
                                variant_item.title = title
                                variant_item.description = description
                                variant_item.file = file
                                variant_item.preview = preview
                            else:
                                variant_item = api_models.VariantItem.objects.create(
                                    variant=existing_variant,
                                    title=title,
                                    description=description,
                                    file=file,
                                    preview=preview,
                                )

                        else:
                            title = item_data.get("title")
                            description = item_data.get("description")

                            if variant_item:
                                variant_item.title = title
                                variant_item.description = description
                                variant_item.preview = preview
                            else:
                                variant_item = api_models.VariantItem.objects.create(
                                    variant=existing_variant,
                                    title=title,
                                    description=description,
                                    preview=preview,
                                )

                        variant_item.save()

                else:
                    new_variant = api_models.Variant.objects.create(
                        course=course, title=title
                    )

                    for item_data in item_data_list:
                        preview_value = item_data.get("preview")
                        preview = (
                            bool(strtobool(str(preview_value)))
                            if preview_value is not None
                            else False
                        )

                        api_models.VariantItem.objects.create(
                            variant=new_variant,
                            title=item_data.get("title"),
                            description=item_data.get("description"),
                            file=item_data.get("file"),
                            preview=preview,
                        )

    def save_nested_data(self, course_instance, serializer_class, data):
        serializer = serializer_class(
            data=data, many=True, context={"course_instance": course_instance}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course_instance)


class CourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.CourseSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs["slug"]
        return api_models.Course.objects.get(slug=slug)


class CourseVariantDeleteAPIView(generics.DestroyAPIView):
    serializer_class = api_serializer.VariantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        variant_id = self.kwargs["variant_id"]
        teacher_id = self.kwargs["teacher_id"]
        course_id = self.kwargs["course_id"]

        print("variant_id ========", variant_id)

        teacher = ensure_teacher_scope(self.request, teacher_id)
        course = api_models.Course.objects.get(teacher=teacher, course_id=course_id)
        return api_models.Variant.objects.get(id=variant_id)


class CourseVariantItemDeleteAPIVIew(generics.DestroyAPIView):
    serializer_class = api_serializer.VariantItemSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        variant_id = self.kwargs["variant_id"]
        variant_item_id = self.kwargs["variant_item_id"]
        teacher_id = self.kwargs["teacher_id"]
        course_id = self.kwargs["course_id"]

        teacher = ensure_teacher_scope(self.request, teacher_id)
        course = api_models.Course.objects.get(teacher=teacher, course_id=course_id)
        variant = api_models.Variant.objects.get(variant_id=variant_id, course=course)
        return api_models.VariantItem.objects.get(
            variant=variant, variant_item_id=variant_item_id
        )


class FileUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (
        MultiPartParser,
        FormParser,
    )  # Allow file uploads

    @swagger_auto_schema(
        operation_description="Upload a file",
        request_body=api_serializer.FileUploadSerializer,  # Use the serializer here
        responses={
            200: openapi.Response(
                "File uploaded successfully", openapi.Schema(type=openapi.TYPE_OBJECT)
            ),
            400: openapi.Response(
                "No file provided", openapi.Schema(type=openapi.TYPE_OBJECT)
            ),
        },
    )
    def post(self, request):
        serializer = api_serializer.FileUploadSerializer(data=request.data)

        if serializer.is_valid():
            file = serializer.validated_data.get("file")

            # Save the file to the media directory
            file_path = default_storage.save(file.name, ContentFile(file.read()))
            file_url = request.build_absolute_uri(default_storage.url(file_path))

            # Check if the file is a video by inspecting its extension
            if file.name.endswith((".mp4", ".avi", ".mov", ".mkv")):
                # Calculate the video duration
                file_full_path = os.path.join(default_storage.location, file_path)
                clip = VideoFileClip(file_full_path)
                duration_seconds = clip.duration

                # Calculate minutes and seconds
                minutes, remainder = divmod(duration_seconds, 60)
                minutes = math.floor(minutes)
                seconds = math.floor(remainder)

                duration_text = f"{minutes}m {seconds}s"

                print("url ==========", file_url)
                print("duration_seconds ==========", duration_seconds)

                # Return both the file URL and the video duration
                return Response({"url": file_url, "video_duration": duration_text})

            # If not a video, just return the file URL
            return Response(
                {
                    "url": file_url,
                }
            )

        return Response({"error": "No file provided"}, status=400)
