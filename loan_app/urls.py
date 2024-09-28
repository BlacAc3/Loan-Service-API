from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

base_url = "v1/"


urlpatterns = [
    path("", views.index, name="index"),
    path("api/loans/", views.LoanList.as_view(), name="my_loans"),
    path("api/auth/register/", views.RegisterView.as_view(), name="register"),
    path("api/auth/login/", views.LoginView.as_view(), name="login"),
    path("api/auth/logout/", views.LogoutView.as_view(), name="logout"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api/loans/<int:loan_id>/approve/", views.ApproveLoan.as_view(), name="approve"),
    path("api/repayments/<int:loan_id>/", views.RepayLoan.as_view(), name="repay"),
    path("api/loans/<int:loan_id>/schedule/", views.LoanSchedule.as_view(), name="schedule"),
    path("api/auth/user/", views.GetUserProfile.as_view(), name="get_profile"),
]
