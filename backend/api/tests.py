from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import (
    Teacher,
    Category,
    Course,
    Variant,
    VariantItem,
    Question_Answer,
    Question_Answer_Message,
    CompletedLesson,
    EnrolledCourse,
    Note,
    Review,
    Notification,
    Wishlist,
    Country,
)
from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile
import tempfile

User = get_user_model()


class TeacherModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(
            user=self.user,
            full_name="Test Teacher",
            bio="Test Bio",
            about="Test About",
            country="Test Country",
        )

    def test_teacher_creation(self):
        self.assertEqual(self.teacher.full_name, "Test Teacher")
        self.assertEqual(self.teacher.bio, "Test Bio")
        self.assertEqual(self.teacher.user.username, "testuser")

    def test_teacher_str_representation(self):
        self.assertEqual(str(self.teacher), "Test Teacher")

    def test_teacher_courses_method(self):
        course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.assertEqual(self.teacher.courses().count(), 1)
        self.assertEqual(self.teacher.courses().first(), course)

    def test_teacher_review_method(self):
        Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.assertEqual(self.teacher.review(), 1)


class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(title="Test Category", active=True)

    def test_category_creation(self):
        self.assertEqual(self.category.title, "Test Category")
        self.assertTrue(self.category.active)

    def test_category_str_representation(self):
        self.assertEqual(str(self.category), "Test Category")

    def test_slug_auto_generation(self):
        self.assertEqual(self.category.slug, "test-category")

    def test_course_count_method(self):
        teacher_user = User.objects.create_user(
            username="teacher", email="teacher@example.com", password="testpass123"
        )
        teacher = Teacher.objects.create(user=teacher_user, full_name="Teacher")
        Course.objects.create(
            category=self.category,
            teacher=teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.assertEqual(self.category.course_count(), 1)


class CourseModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.category = Category.objects.create(title="Test Category")
        self.course = Course.objects.create(
            category=self.category,
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            price=99.99,
            language="English",
            level="Beginner",
            platform_status="Published",
            teacher_course_status="Published",
        )

    def test_course_creation(self):
        self.assertEqual(self.course.title, "Test Course")
        self.assertEqual(self.course.description, "Test Description")
        self.assertEqual(float(self.course.price), 99.99)
        self.assertEqual(self.course.language, "English")
        self.assertEqual(self.course.level, "Beginner")

    def test_course_str_representation(self):
        self.assertEqual(str(self.course), "Test Course")

    def test_slug_auto_generation(self):
        self.assertTrue(self.course.slug.startswith("test-course"))

    def test_students_method(self):
        student_user = User.objects.create_user(
            username="student", email="student@example.com", password="testpass123"
        )
        EnrolledCourse.objects.create(
            course=self.course, user=student_user, teacher=self.teacher
        )
        self.assertEqual(self.course.students().count(), 1)

    def test_curriculum_method(self):
        variant = Variant.objects.create(course=self.course, title="Test Variant")
        self.assertEqual(self.course.curriculum().count(), 1)
        self.assertEqual(self.course.curriculum().first(), variant)

    def test_lectures_method(self):
        variant = Variant.objects.create(course=self.course, title="Test Variant")
        lecture = VariantItem.objects.create(
            variant=variant, title="Test Lecture", file="test.mp4"
        )
        self.assertEqual(self.course.lectures().count(), 1)
        self.assertEqual(self.course.lectures().first(), lecture)

    def test_average_rating_method(self):
        student_user = User.objects.create_user(
            username="student", email="student@example.com", password="testpass123"
        )
        Review.objects.create(
            course=self.course,
            user=student_user,
            review="Great course!",
            rating=5,
            active=True,
        )
        Review.objects.create(
            course=self.course,
            user=self.user,
            review="Good course!",
            rating=4,
            active=True,
        )
        self.assertEqual(self.course.average_rating(), 4.5)

    def test_rating_count_method(self):
        student_user = User.objects.create_user(
            username="student", email="student@example.com", password="testpass123"
        )
        Review.objects.create(
            course=self.course,
            user=student_user,
            review="Great course!",
            rating=5,
            active=True,
        )
        self.assertEqual(self.course.rating_count(), 1)

    def test_reviews_method(self):
        student_user = User.objects.create_user(
            username="student", email="student@example.com", password="testpass123"
        )
        review = Review.objects.create(
            course=self.course,
            user=student_user,
            review="Great course!",
            rating=5,
            active=True,
        )
        self.assertEqual(self.course.reviews().count(), 1)
        self.assertEqual(self.course.reviews().first(), review)


class VariantModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.variant = Variant.objects.create(course=self.course, title="Test Variant")

    def test_variant_creation(self):
        self.assertEqual(self.variant.title, "Test Variant")
        self.assertEqual(self.variant.course, self.course)

    def test_variant_str_representation(self):
        self.assertEqual(str(self.variant), "Test Variant")

    def test_variant_items_method(self):
        item = VariantItem.objects.create(
            variant=self.variant, title="Test Item", file="test.mp4"
        )
        self.assertEqual(self.variant.variant_items().count(), 1)
        self.assertEqual(self.variant.variant_items().first(), item)

    def test_items_method(self):
        item = VariantItem.objects.create(
            variant=self.variant, title="Test Item", file="test.mp4"
        )
        self.assertEqual(self.variant.items().count(), 1)
        self.assertEqual(self.variant.items().first(), item)


class VariantItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.variant = Variant.objects.create(course=self.course, title="Test Variant")
        self.variant_item = VariantItem.objects.create(
            variant=self.variant, title="Test Item", file="test.mp4", preview=True
        )

    def test_variant_item_creation(self):
        self.assertEqual(self.variant_item.title, "Test Item")
        self.assertEqual(self.variant_item.variant, self.variant)
        self.assertTrue(self.variant_item.preview)

    def test_variant_item_str_representation(self):
        self.assertEqual(str(self.variant_item), "Test Variant - Test Item")


class QuestionAnswerModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.question = Question_Answer.objects.create(
            course=self.course, user=self.user, title="Test Question"
        )

    def test_question_creation(self):
        self.assertEqual(self.question.title, "Test Question")
        self.assertEqual(self.question.course, self.course)
        self.assertEqual(self.question.user, self.user)

    def test_question_str_representation(self):
        self.assertEqual(str(self.question), "testuser - Test Course")

    def test_messages_method(self):
        message = Question_Answer_Message.objects.create(
            course=self.course,
            question=self.question,
            user=self.user,
            message="Test Message",
        )
        self.assertEqual(self.question.messages().count(), 1)
        self.assertEqual(self.question.messages().first(), message)

    def test_profile_method(self):
        profile = self.question.profile()
        self.assertEqual(profile.user, self.user)


class QuestionAnswerMessageModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.question = Question_Answer.objects.create(
            course=self.course, user=self.user, title="Test Question"
        )
        self.message = Question_Answer_Message.objects.create(
            course=self.course,
            question=self.question,
            user=self.user,
            message="Test Message",
        )

    def test_message_creation(self):
        self.assertEqual(self.message.message, "Test Message")
        self.assertEqual(self.message.course, self.course)
        self.assertEqual(self.message.question, self.question)
        self.assertEqual(self.message.user, self.user)

    def test_message_str_representation(self):
        self.assertEqual(str(self.message), "testuser - Test Course")

    def test_profile_method(self):
        profile = self.message.profile()
        self.assertEqual(profile.user, self.user)


class CompletedLessonModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.variant = Variant.objects.create(course=self.course, title="Test Variant")
        self.variant_item = VariantItem.objects.create(
            variant=self.variant, title="Test Item", file="test.mp4"
        )
        self.completed_lesson = CompletedLesson.objects.create(
            course=self.course, user=self.user, variant_item=self.variant_item
        )

    def test_completed_lesson_creation(self):
        self.assertEqual(self.completed_lesson.course, self.course)
        self.assertEqual(self.completed_lesson.user, self.user)
        self.assertEqual(self.completed_lesson.variant_item, self.variant_item)

    def test_completed_lesson_str_representation(self):
        self.assertEqual(str(self.completed_lesson), "Test Course")


class EnrolledCourseModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.enrolled_course = EnrolledCourse.objects.create(
            course=self.course, user=self.user, teacher=self.teacher
        )

    def test_enrolled_course_creation(self):
        self.assertEqual(self.enrolled_course.course, self.course)
        self.assertEqual(self.enrolled_course.user, self.user)
        self.assertEqual(self.enrolled_course.teacher, self.teacher)

    def test_enrolled_course_str_representation(self):
        self.assertEqual(str(self.enrolled_course), "Test Course")

    def test_lectures_method(self):
        variant = Variant.objects.create(course=self.course, title="Test Variant")
        lecture = VariantItem.objects.create(
            variant=variant, title="Test Lecture", file="test.mp4"
        )
        self.assertEqual(self.enrolled_course.lectures().count(), 1)
        self.assertEqual(self.enrolled_course.lectures().first(), lecture)

    def test_completed_lesson_method(self):
        variant = Variant.objects.create(course=self.course, title="Test Variant")
        lecture = VariantItem.objects.create(
            variant=variant, title="Test Lecture", file="test.mp4"
        )
        completed = CompletedLesson.objects.create(
            course=self.course, user=self.user, variant_item=lecture
        )
        self.assertEqual(self.enrolled_course.completed_lesson().count(), 1)
        self.assertEqual(self.enrolled_course.completed_lesson().first(), completed)

    def test_curriculum_method(self):
        variant = Variant.objects.create(course=self.course, title="Test Variant")
        self.assertEqual(self.enrolled_course.curriculum().count(), 1)
        self.assertEqual(self.enrolled_course.curriculum().first(), variant)

    def test_note_method(self):
        note = Note.objects.create(
            course=self.course,
            user=self.user,
            title="Test Note",
            note="Test Note Content",
        )
        self.assertEqual(self.enrolled_course.note().count(), 1)
        self.assertEqual(self.enrolled_course.note().first(), note)

    def test_question_answer_method(self):
        question = Question_Answer.objects.create(
            course=self.course, user=self.user, title="Test Question"
        )
        self.assertEqual(self.enrolled_course.question_answer().count(), 1)
        self.assertEqual(self.enrolled_course.question_answer().first(), question)

    def test_review_method(self):
        review = Review.objects.create(
            course=self.course,
            user=self.user,
            review="Great course!",
            rating=5,
            active=True,
        )
        self.assertEqual(self.enrolled_course.review(), review)


class NoteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.note = Note.objects.create(
            user=self.user,
            course=self.course,
            title="Test Note",
            note="Test Note Content",
        )

    def test_note_creation(self):
        self.assertEqual(self.note.title, "Test Note")
        self.assertEqual(self.note.note, "Test Note Content")
        self.assertEqual(self.note.user, self.user)
        self.assertEqual(self.note.course, self.course)

    def test_note_str_representation(self):
        self.assertEqual(str(self.note), "Test Note")


class ReviewModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.review = Review.objects.create(
            user=self.user,
            course=self.course,
            review="Great course!",
            rating=5,
            active=True,
        )

    def test_review_creation(self):
        self.assertEqual(self.review.review, "Great course!")
        self.assertEqual(self.review.rating, 5)
        self.assertTrue(self.review.active)
        self.assertEqual(self.review.user, self.user)
        self.assertEqual(self.review.course, self.course)

    def test_review_str_representation(self):
        self.assertEqual(str(self.review), "Test Course")

    def test_profile_method(self):
        profile = self.review.profile()
        self.assertEqual(profile.user, self.user)


class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.review = Review.objects.create(
            user=self.user,
            course=self.course,
            review="Great course!",
            rating=5,
            active=True,
        )
        self.notification = Notification.objects.create(
            user=self.user,
            teacher=self.teacher,
            review=self.review,
            type="New Review",
            seen=False,
        )

    def test_notification_creation(self):
        self.assertEqual(self.notification.type, "New Review")
        self.assertFalse(self.notification.seen)
        self.assertEqual(self.notification.user, self.user)
        self.assertEqual(self.notification.teacher, self.teacher)
        self.assertEqual(self.notification.review, self.review)

    def test_notification_str_representation(self):
        self.assertEqual(str(self.notification), "New Review")


class WishlistModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.teacher = Teacher.objects.create(user=self.user, full_name="Test Teacher")
        self.course = Course.objects.create(
            teacher=self.teacher,
            title="Test Course",
            description="Test Description",
            teacher_course_status="Published",
        )
        self.wishlist = Wishlist.objects.create(user=self.user, course=self.course)

    def test_wishlist_creation(self):
        self.assertEqual(self.wishlist.user, self.user)
        self.assertEqual(self.wishlist.course, self.course)

    def test_wishlist_str_representation(self):
        self.assertEqual(str(self.wishlist), "Test Course")


class CountryModelTest(TestCase):
    def setUp(self):
        self.country = Country.objects.create(
            name="Test Country", tax_rate=10, active=True
        )

    def test_country_creation(self):
        self.assertEqual(self.country.name, "Test Country")
        self.assertEqual(self.country.tax_rate, 10)
        self.assertTrue(self.country.active)

    def test_country_str_representation(self):
        self.assertEqual(str(self.country), "Test Country")
