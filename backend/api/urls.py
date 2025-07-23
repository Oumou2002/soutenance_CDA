from api import views as api_views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication Endpoints
    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    path("user/register/", api_views.RegisterView.as_view()),
    path(
        "user/password-reset/<email>/",
        api_views.PasswordResetEmailVerifyAPIView.as_view(),
    ),
    # Core Endpooints
    path("course/category/", api_views.CategoryListAPIView.as_view()),
    path("course/course-list/", api_views.CourseListAPIView.as_view()),
    path("course/search/", api_views.SearchCourseAPIView.as_view()),
    path("course/course-detail/<slug>/", api_views.CourseDetailAPIView.as_view()),
    # Student API Endpoints
    path("student/summary/<user_id>/", api_views.StudentSummaryAPIView.as_view()),
    path(
        "student/course-list/<user_id>/", api_views.StudentCourseListAPIView.as_view()
    ),
    path(
        "student/course-detail/<user_id>/<enrollment_id>/",
        api_views.StudentCourseDetailAPIView.as_view(),
    ),
    path(
        "student/course-completed/",
        api_views.StudentCourseCompletedCreateAPIView.as_view(),
    ),
    path(
        "student/course-note/<user_id>/<enrollment_id>/",
        api_views.StudentNoteCreateAPIView.as_view(),
    ),
    path(
        "student/course-note-detail/<user_id>/<enrollment_id>/<note_id>/",
        api_views.StudentNoteDetailAPIView.as_view(),
    ),
    path("student/rate-course/", api_views.StudentRateCourseCreateAPIView.as_view()),
    path(
        "student/review-detail/<user_id>/<review_id>/",
        api_views.StudentRateCourseUpdateAPIView.as_view(),
    ),
    path(
        "student/wishlist/<user_id>/",
        api_views.StudentWishListListCreateAPIView.as_view(),
    ),
    path(
        "student/question-answer-list-create/<course_id>/",
        api_views.QuestionAnswerListCreateAPIView.as_view(),
    ),
    path(
        "student/question-answer-message-create/",
        api_views.QuestionAnswerMessageSendAPIView.as_view(),
    ),
    # Teacher Routes
    path("teacher/summary/<teacher_id>/", api_views.TeacherSummaryAPIView.as_view()),
    path(
        "teacher/course-lists/<teacher_id>/",
        api_views.TeacherCourseListAPIView.as_view(),
    ),
    path(
        "teacher/review-lists/<teacher_id>/",
        api_views.TeacherReviewListAPIView.as_view(),
    ),
    path(
        "teacher/review-detail/<teacher_id>/<review_id>/",
        api_views.TeacherReviewDetailAPIView.as_view(),
    ),
    path(
        "teacher/student-lists/<teacher_id>/",
        api_views.TeacherStudentsListAPIVIew.as_view({"get": "list"}),
    ),
    path(
        "teacher/question-answer-list/<teacher_id>/",
        api_views.TeacherQuestionAnswerListAPIView.as_view(),
    ),
    path(
        "teacher/noti-list/<teacher_id>/",
        api_views.TeacherNotificationListAPIView.as_view(),
    ),
    path(
        "teacher/noti-detail/<teacher_id>/<noti_id>",
        api_views.TeacherNotificationDetailAPIView.as_view(),
    ),
    path("teacher/course-create/", api_views.CourseCreateAPIView.as_view()),
    path(
        "teacher/course-update/<teacher_id>/<course_id>/",
        api_views.CourseUpdateAPIView.as_view(),
    ),
    path(
        "teacher/course-detail/<course_id>/",
        api_views.TeacherCourseDetailAPIView.as_view(),
    ),
    path(
        "teacher/course/variant-delete/<variant_id>/<teacher_id>/<course_id>/",
        api_views.CourseVariantDeleteAPIView.as_view(),
    ),
    path(
        "teacher/course/variant-item-delete/<variant_id>/<variant_item_id>/<teacher_id>/<course_id>/",
        api_views.CourseVariantItemDeleteAPIVIew.as_view(),
    ),
    path("file-upload/", api_views.FileUploadAPIView.as_view()),
]
