from django.contrib import admin
from .models import Loan, RepaymentSchedule
# Register your models here.
admin.site.register(Loan)
admin.site.register(RepaymentSchedule)
