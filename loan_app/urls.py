from django.urls import URLPattern, path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

base_url = "v1/"


urlpatterns=[
    path("api/loans/", views.LoanList.as_view(), name="index"),
    path("api/auth/register/", views.RegisterView.as_view(), name="register"),
    path('api/auth/login/', views.LoginView.as_view(), name="login"),
    path('api/auth/logout/', views.LogoutView.as_view(), name="logout"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
    path("api/loans/<int:loan_id>/approve/", views.ApproveLoan.as_view(), name="approve"),
]

