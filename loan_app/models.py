from datetime import datetime

from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
import math

# from django.utils.autoreload import raise_last_exception

# Create your models here.


class Loan(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("paid", "Paid"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="loans")
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_interest = models.DecimalField(max_digits=4, decimal_places=2) #Total interest
    term_months = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    locked = models.BooleanField(default=False)

    def __str__(self):
        return f"Loan {self.pk} for {self.user.username}"

    def approve_loan(self):
        if not RepaymentSchedule.objects.filter(loan=self).exists():
            expiry_date = datetime.now() + relativedelta(months=int(self.term_months))
            remainder_months = months_remaining(expiry_date, format="months")

            # Convert loan amount and interest rate to float
            principal = float(self.loan_amount)
            annual_interest_rate = float(self.total_interest) / 100

            # Calculate monthly interest rate
            monthly_interest_rate = annual_interest_rate / 12

            # Calculate monthly payment using the formula:
            # P * r * (1 + r)^n / ((1 + r)^n - 1)
            # where P = principal, r = monthly interest rate, n = number of months
            if monthly_interest_rate > 0:
                monthly_payment = principal * monthly_interest_rate * (1 + monthly_interest_rate) ** int(self.term_months) / ((1 + monthly_interest_rate) ** int(self.term_months) - 1)
            else:
                # If interest rate is 0, simply divide principal by term months
                monthly_payment = principal / int(self.term_months)

            # Calculate total amount with interest
            due_amount_with_interest = monthly_payment * int(self.term_months)
            print(f"The months Remaining:->>{remainder_months}")
            new_repayment = RepaymentSchedule.objects.create(
                    loan=self,
                    repay_amount_with_interest=due_amount_with_interest,
                    total_due_amount=due_amount_with_interest,
                    end_of_month_due_amount=monthly_payment,
                    expected_monthly_payment=monthly_payment,
                    due_date=datetime.now() + relativedelta(months=1),
                    expiry_date = expiry_date,
                    remaining_months = remainder_months,
                    total_months_for_payment=remainder_months
                    )
            new_repayment.save()
            self.locked = True
            self.approved_at=datetime.now()
            self.status = "approved"
            self.save()
        else:
            pass

class RepaymentSchedule(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name="repayments")
    total_due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    repay_amount_with_interest=models.DecimalField(max_digits=10, decimal_places=2)
    end_of_month_due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    expected_monthly_payment = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    remaining_months = models.PositiveIntegerField()
    total_months_for_payment = models.PositiveIntegerField()

    def __str__(self):
        return f"Repayment {self.pk} for Loan {self.loan.pk}"

    def update_repayment(self, amount:float):
        try:
            #Make decrements
            new_total_due_amount = float(self.total_due_amount) - float(amount)
            new_end_of_month_due_amount = float(self.end_of_month_due_amount) - float(amount)

            # Calculate months paid for using the expected monthly payment
            expected_monthly = float(self.expected_monthly_payment)
            months_paid_for = int((float(self.repay_amount_with_interest)-new_total_due_amount) / expected_monthly)

            # Calculate new remaining months
            new_remaining_months = int(float(self.total_months_for_payment)) - months_paid_for

            # Calculate new due date
            due_date_obj = self.loan.approved_at
            # Ensure due_date_obj is aware of the timezone
            if isinstance(due_date_obj, datetime) and due_date_obj.tzinfo is None:
                due_date_obj = timezone.make_aware(due_date_obj)
            new_due_date = due_date_obj + relativedelta(months=math.ceil(months_paid_for))

            if new_total_due_amount > 0:
                self.total_due_amount = new_total_due_amount
                self.end_of_month_due_amount = new_end_of_month_due_amount
                self.remaining_months = new_remaining_months
                self.due_date = new_due_date
                self.loan.status = "approved"
                if self.expiry_date:
                    self.remaining_months = months_remaining(self.expiry_date, format="months")
            elif new_total_due_amount <= 0:
                self.total_due_amount = 0
                self.remaining_months = 0
                self.due_date = None
                self.end_of_month_due_amount = 0
                self.loan.status = "paid"

            # if new_total_due_amount <=0:
            #     self.total_due_amount = 0
            #     self.end_of_month_due_amount = 0
            #     self.loan.status = "paid"

        except Exception as e:
            raise e
        #Calculate the remaining months
        self.loan.save()
        self.save()


def months_remaining(from_date: datetime, format:str) -> int | None:
    if format == "months":
        # Get the current date and time
        now = datetime.now()
        if from_date.tzinfo is not None:
            from_date = from_date.replace(tzinfo=None)

        # Calculate the difference between the two dates
        delta = relativedelta(from_date, now)

        # Calculate the total remaining months
        total_months = delta.years * 12 + delta.months
        return abs(total_months)+1
    elif format == "days":
        # Get the current date and time
        current_date = datetime.now()

        # Calculate the difference between the expiry date and current date
        date_difference = from_date - current_date

        # Get the total number of days (ensure it's positive by taking the absolute value)
        days_difference = abs(date_difference.days)
        return int(days_difference)
    else:
        return None
