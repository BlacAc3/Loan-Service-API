from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt import exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Loan, RepaymentSchedule
from .serializers import LoanSerializer, RegisterSerializer, RepaymentSerializer
from dateutil.relativedelta import relativedelta


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


# Confirm the authenticated user only get access to his loans
def CheckLoanOwnershipAndExistence(request, loan_id):
    user = get_token_user(request)
    if not Loan.objects.filter(id=loan_id, user=user).exists():
        return Response(
            {"loan_id": f"{loan_id}", "error": "Loan not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    loan = Loan.objects.get(id=loan_id, user=user)
    if not RepaymentSchedule.objects.filter(loan=loan).exists():
        return Response({"error": "A server error occured"})

    return None
# -------------


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
# -----------------------------------------------------------------------------------


# Logout function Handling
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the access token from the request
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
# -------------------------------------------------------------------------------------


# Provide list of User Loans and Request for a loan
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
# ------------------------------------------------------------------------------
# Get individual loan details
class LoanDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, loan_id):
        check_result = CheckLoanOwnershipAndExistence(request, loan_id)
        if check_result is not None:
            return check_result

        loan = Loan.objects.get(id=loan_id)

        serializer = LoanSerializer(loan)


        return Response(serializer.data, status=status.HTTP_200_OK)


class ApproveLoan(APIView):
    # permission_classes = [IsAdminUser]
    permission_classes=[IsAuthenticated]
    def get(self, request, loan_id):
        loan_status = "approved"

        if not Loan.objects.filter(id=loan_id).exists():
            return Response(
                {"loan_id": f"{loan_id}", "error": "Loan not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        if not Loan.objects.filter(id=loan_id, locked=False).exists():
            return Response(
                {
                    "loan_id": f"{loan_id}",
                    "detail": "This loan has been resolved by Admin",
                },
                status=status.HTTP_409_CONFLICT,
            )
        if Loan.objects.filter(id=loan_id, status=loan_status).exists():
            return Response(
                {
                    "loan_id": f"{loan_id}",
                    "detail": "This loan has been approved already",
                }
            )
        loan_to_approve = Loan.objects.get(id=loan_id)
        if loan_status == "approved":
            loan_to_approve.approve_loan()
        loan_to_approve.locked = True
        try    :
            loan_to_approve.status = loan_status
        except:
            Response({"error": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
        loan_to_approve.save()
        return Response({"loan_id": f"{loan_id}", "current_status": f"{loan_status}"}, status=status.HTTP_200_OK)

class RejectLoan(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, loan_id):
            loan_status = "rejected"

            if not Loan.objects.filter(id=loan_id).exists():
                return Response(
                    {"loan_id": f"{loan_id}", "error": "Loan not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            elif Loan.objects.filter(id=loan_id, status=loan_status).exists():
                return Response(
                    {
                        "loan_id": f"{loan_id}",
                        "detail": "This loan has been approved already",
                    }
                )
            elif Loan.objects.filter(id=loan_id, status="approved").exists():
                return Response(
                   {
                       "loan_id":f"{loan_id}",
                       "detail":"Approved Loans can not be rejected",
                   }
                )

            # if not Loan.objects.filter(id=loan_id, locked=False).exists():
            #     return Response(
            #         {
            #             "loan_id": f"{loan_id}",
            #             "detail": "This loan has been resolved by Admin",
            #         },
            #         status=status.HTTP_409_CONFLICT,
            #     )
            loan_to_approve = Loan.objects.get(id=loan_id)
            if loan_status == "approved":
                loan_to_approve.approve_loan()
            loan_to_approve.locked = True
            try:
                loan_to_approve.status = loan_status
            except:
                Response({"error": "Bad Request"}, status=status.HTTP_400_BAD_REQUEST)
            loan_to_approve.save()
            return Response({"loan_id": f"{loan_id}", "current_status": f"{loan_status}"}, status=status.HTTP_200_OK)


class RepayLoan(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, loan_id):
        amount = request.data["amount"]
        check_result = CheckLoanOwnershipAndExistence(request, loan_id)
        if check_result is not None:
            return check_result
        loan_to_repay = Loan.objects.get(id=loan_id)
        loan_schedule = RepaymentSchedule.objects.filter(loan=loan_to_repay).first()

        if loan_to_repay.status != "approved":
            return Response(
                {"loan_id": f"{loan_id}", "detail": "Cannot repay an unapproved loan"},
                status=status.HTTP_404_NOT_FOUND,
            )
        elif loan_schedule.total_due_amount == 0:
            loan_to_repay.status = "paid"
            loan_to_repay.save()
            return Response(
                {"loan_id":f"{loan_id}", "details":"Loan has been Paid off completely"}, status=status.HTTP_400_BAD_REQUEST)

        old_due_amount = loan_schedule.total_due_amount

        loan_schedule.update_repayment(amount)
        schedule_data = {
            "loan_id": f"{loan_id}",
            "amount_paid": f"{amount}",
            "amount_outstanding":f"{loan_schedule.total_due_amount}",
            "final_repayment_date": f"{loan_schedule.due_date}",
        }
        if loan_schedule.total_due_amount == old_due_amount:
            return Response(
                {"loan_id":f"{loan_id}", "detail":"Pay the exact amount and not more."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(schedule_data, status=status.HTTP_200_OK)

# Sends Loan repayment information
class LoanSchedule(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, loan_id):
        """
        {
            "month": 1,
            "due_date": "2024-10-01",
            "amount_due": 850
        }
        """
        amount_due=None
        check_result = CheckLoanOwnershipAndExistence(request, loan_id)
        if check_result is not None:
            return check_result
        loan = Loan.objects.get(id=loan_id)
        loan_schedule = RepaymentSchedule.objects.get(loan=loan)
        result = []
        for i in range(int(loan_schedule.total_months_for_payment)):
            i+=1
            amount_paid = loan_schedule.repay_amount_with_interest - loan_schedule.total_due_amount
            claimed_amount_due = loan_schedule.expected_monthly_payment*i - amount_paid
            #if the total amount paid surpasses the total sum expected to be paid in {i} months then no amount is due for that month
            if amount_paid > loan_schedule.expected_monthly_payment*i:
                amount_due = 0
            #if the amount paid becomes less than the sum of all cash expected to be paid in total of {i} months then an amount is due for that month
            elif amount_paid < loan_schedule.expected_monthly_payment*i and claimed_amount_due<loan_schedule.expected_monthly_payment:
                amount_due = loan_schedule.expected_monthly_payment*i - amount_paid
            elif amount_paid == loan_schedule.expected_monthly_payment*i:
                amount_due=0
            #when the total amount subtracted from the expected accumulated monthly payment becomes bigger than the payment expected every month
            #then it means the iteration has passed the point/month in which the user is in owing a certain amount
            if claimed_amount_due > loan_schedule.expected_monthly_payment:
                amount_due=loan_schedule.expected_monthly_payment

            #for each month the due date is the first of the next month
            next_month = loan.approved_at + relativedelta(months=1)
            due_date = next_month.replace(day=1)

            data = {
                    "month":f"{i}",
                    "due_date":f"{due_date}",
                    "amount_due":f"{amount_due}"
                    }
            result.append(data)

        return Response(result, status=status.HTTP_200_OK)
# ----------------------------------------------------------
#
class RepaymentDetails(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request, loan_id):
        check_result = CheckLoanOwnershipAndExistence(request, loan_id)
        if check_result is not None:
            return check_result
        loan = Loan.objects.get(id=loan_id).repayments.first()
        serializer = RepaymentSerializer(loan)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetUserProfile(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        auth_user=get_token_user(request)
        loans = auth_user.loans
        total_loans_applied: int=loans.all().count()
        total_loan_amount = sum(loans.filter(status="approved").values_list('loan_amount', flat=True))
        # total_due_amount1 = sum(
        #     repayment.total_due_amount
        #     for loan in loans.filter(status="approved")
        #     for repayment in loan.repayments.all()
        # )
        total_due_amount = 0
        mean_interest_rate = None
        interest_rates = loans.filter(status="approved").values_list('total_interest', flat=True)
        try:
            mean_interest_rate = round(sum(interest_rates) / len(interest_rates), 2)
        except:
            mean_interest_rate = 0
        approved_loans = loans.filter(status="approved").order_by('repayments__due_date')
        next_payment = approved_loans.first().repayments.first().due_date if approved_loans.exists() else None
        # print(f"Total Approved Loans: {len(approved_loans)}")

        # Clean up code to make sure the loan only has one repayment object
        for loan in approved_loans:
            if len(loan.repayments.all()) >1:
                first_repayment = loan.repayments.first()
                for repayment in loan.repayments.all():
                    if repayment.id == first_repayment.id:
                        continue
                    else:
                        repayment.delete()

        for loan in approved_loans:
            # print(loan.repayments.all())
            for repayment in loan.repayments.all():
                if total_due_amount is None:
                    total_due_amount = float(repayment.total_due_amount)
                else:
                    total_due_amount =float(total_due_amount)+ float(repayment.total_due_amount)


        data = {
            "id":f"{auth_user.id}",
            "username":f"{auth_user.username}",
            "firstname":f"{auth_user.first_name}",
            "lastname":f"{auth_user.last_name}",
            "totalLoanAmount":f"{total_loan_amount}",
            "meanInterestRate":f"{mean_interest_rate}",
            "totalAppliedLoans":f"{total_loans_applied}",
            "totalRemainingBalance":f"{total_due_amount}",
            "nextPayment": f"{next_payment.strftime('%B %d, %Y') if next_payment else None}",
        }
        return Response(data, status=status.HTTP_200_OK)

class GetAllUsers(APIView):
    permission_classes=[IsAdminUser]
    def get(self, request):
        all_users = User.objects.all()
        data=[]
        for user in all_users:
            user_info= {
                "id":f"{user.id}",
                "username":f"{user.username}",
                "email":f"{user.email}",
                "first_name":f"{user.first_name}",
                "last_name":f"{user.last_name}"
            }
            data.append(user_info)

        return Response(data, status=status.HTTP_200_OK)
