from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.text import wrap
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import Loan
from .serializers import LoanSerializer, RegisterSerializer


# Create your views here.
def index(request):
    return HttpResponse("<h1>Your App is working Sir!!</h1>")


# Get user from access token
def get_token_user(request):
    jwt_auth = JWTAuthentication()

    # Extract the token from the request
    # Authorization header should be in the format: "Bearer <token>"
    header = request.headers.get("Authorization")

    if header is None:
        raise ValueError("Authorization header is missing")
    token = extract_access_token(request)
    try:
        # Validate and decode the token
        validated_token = jwt_auth.get_validated_token(token)
        user = jwt_auth.get_user(validated_token)
        return user
    except exceptions.InvalidToken:
        raise ValueError("Invalid token")


# ------------------------------------------------------------


# Extract access token from request
def extract_access_token(request):
    """
    Extracts the access token from the Authorization header of the request.
    Assumes the format is 'Bearer <token>'.
    """
    auth_header = request.headers.get("Authorization", "")

    # Check if header is in the expected format
    if auth_header.startswith("Bearer "):
        # Extract the token part
        token = auth_header[len("Bearer ") :]
        return token
    else:
        raise ValueError('Authorization header must start with "Bearer ".')


# ---------------------------------------------------------------------------


# Registration handling
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------------------------------------------------------


# Login handling!
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            token = RefreshToken.for_user(user)
            access_token = token.access_token
            refresh_token = token
            return Response(
                {"refresh_token": str(refresh_token), "access_token": str(access_token)}
            )
        else:
            # If authentication fails, return an error
            return Response(
                {"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )


# --------------------------------------------------------------------------------------------------


# Logout function Handling
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the access token from the request
        access_token = extract_access_token(request)
        refresh_token = request.data.get("refresh")
        print(refresh_token)

        if not refresh_token:
            return Response(
                {"detail": "Access token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token
            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except exceptions.InvalidToken:
            return Response(
                {"detail": "Invalid access token."}, status=status.HTTP_400_BAD_REQUEST
            )


# ---------------------------------------------------------------------------------------------------------


class LoanList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = get_token_user(request)
        loans = Loan.objects.filter(user=current_user)
        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LoanSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApproveLoan(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, loan_id):
        status = request.data["status"].lower()
        if not Loan.objects.filter(id=loan_id).exists():
            return Response({"Error": f"Loan of id:{loan_id} not found!"})
        loan_to_approve = Loan.objects.get(id=loan_id)
        loan_to_approve.status = status
        loan_to_approve.save()
        return Response({"Loan_id": f"{loan_id}", "current_status": f"{status}"})

