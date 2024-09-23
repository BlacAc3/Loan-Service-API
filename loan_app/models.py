from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Loan(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loans')
    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Loan {self.id} for {self.user.username}'

class Repayment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayments')
    due_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateTimeField(auto_now_add=True)
    remaining_months = models.PositiveIntegerField()

    def __str__(self):
        return f'Repayment {self.id} for Loan {self.loan.id}'
