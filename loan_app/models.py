from datetime import datetime

from dateutil.relativedelta import relativedelta
from django.contrib.auth.models import User
from django.db import models
from django.utils.autoreload import raise_last_exception

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
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    locked = models.BooleanField(default=False)

    def __str__(self):
        return f"Loan {self.id} for {self.user.username}"
    def approve_loan(self):
        expiry_date = datetime.now() + relativedelta(months=self.term_months)
        remainder_months = months_remaining(expiry_date, format="months")
        due_amount_with_interest= float(self.loan_amount) *(1 + (float(self.total_interest)/100))
        monthly_payment=float(due_amount_with_interest)/float(remainder_months)
        print(f"The months Remaining:->>{remainder_months}")
        new_repayment = RepaymentSchedule.objects.create(
                loan=self,
                repay_amount_with_interest=due_amount_with_interest,
                total_due_amount=due_amount_with_interest,
                end_of_month_due_amount=monthly_payment,
                expected_monthly_payment=monthly_payment,
                due_date = expiry_date,
                remaining_months = remainder_months, 
                total_months_for_payment=remainder_months
                )
        new_repayment.save()
        self.locked = True
        self.approved_at=datetime.now()
        self.save()

class RepaymentSchedule(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name="repayments")
    total_due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    repay_amount_with_interest=models.DecimalField(max_digits=10, decimal_places=2)
    end_of_month_due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    expected_monthly_payment = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateTimeField(auto_now_add=True)
    remaining_months = models.PositiveIntegerField()
    total_months_for_payment = models.PositiveIntegerField()

    def __str__(self):
        return f"Repayment {self.id} for Loan {self.loan.id}"
    
    def update_repayment(self, amount:float):
        try:
            #Make decrements
            total_due_amount =self.total_due_amount
            self.total_due_amount = float(total_due_amount)-float(amount)
            end_of_month_due_amount=self.end_of_month_due_amount
            self.end_of_month_due_amount = float(end_of_month_due_amount)-float(amount)

        except Exception as e:
            raise e
        #Calculate the remaining months
        self.remaining_months = months_remaining(self.due_date, format="months")
        self.save()        


def months_remaining(from_date: datetime, format:str) -> int:
    results = None
    if format == "months":
        # Get the current date and time
        now = datetime.now()
        from_date = from_date.replace(tzinfo=None)
        
        # Calculate the difference between the two dates
        delta = relativedelta(now, from_date)
        
        # Calculate the total remaining months
        total_months = delta.years * 12 + delta.months
        result = abs(total_months)+1
    elif format == "days":
        # Get the current date and time
        current_date = datetime.now()
        
        # Calculate the difference between the expiry date and current date
        date_difference = expiry_date - current_date
        
        # Get the total number of days (ensure it's positive by taking the absolute value)
        days_difference = abs(date_difference.days)
        result=int(days_difference)
    return result
