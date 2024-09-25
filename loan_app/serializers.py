from rest_framework import serializers
from django.contrib.auth.models import User

from loan_app import views
from .models import Loan, RepaymentSchedule


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "username", "password"]

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError() #Returns an automatic response for invalid user name
        elif User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email":"A user with that email already exists"})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields =["user", "id", "loan_amount", "interest_rate", "term_months", "status", "created_at", "approved_at"]

        # Define fields as optional in extra_kwargs
        extra_kwargs = {
            'id': {'required': False},
            'status': {'required': False},
            'created_at': {'required': False},
            'approved_at': {'required': False},
            # Add more fields here as needed
        }

    def create(self, validated_data):
        request = self.context['request']
        user = views.get_token_user(request)
        validated_data['user'] = user
        print(user.username)
        return super().create(validated_data)
