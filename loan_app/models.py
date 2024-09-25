from dateutil.relativedelta import relativedelta
from datetime import datetime

from django.contrib.auth.models import User
from django.db import models

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
        due_amount_with_interest= self.loan_amount *(1 + (self.term_months/100))
        new_repayment = RepaymentSchedule.objects.create(
                loan=self,
                end_of_month_due_amount=self.loan_amount/months_remaining(expiry_date),
                total_due_amount=due_amount_with_interest,
                due_date = expiry_date,
                remaining_months = months_remaining(expiry_date), 
                )
        new_repayment.save()
        self.locked = True
        self.save()

class RepaymentSchedule(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name="repayments")
    total_due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    end_of_month_due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateTimeField(auto_now_add=True)
    remaining_months = models.PositiveIntegerField()

    def __str__(self):
        return f"Repayment {self.id} for Loan {self.loan.id}"



def months_remaining(from_date):
    # Get the current date and time
    now = datetime.now()
    
    # Calculate the difference between the two dates
    delta = relativedelta(now, from_date)
    
    # Calculate the total remaining months
    total_months = delta.years * 12 + delta.months
    
    return total_months
