from django.test import TestCase
from django.test import RequestFactory
from django.contrib.auth.models import User
from loan_app.views import LoanList
import pytest


@pytest.fixture
def loan_list_view():
    return LoanList.as_view()


@pytest.fixture
def user():
    return User.objects.create_user(
        username='testuser', email='test@example.com', password='testpassword'
    )


@pytest.fixture
def request_factory():
    return RequestFactory()


def test_get(request_factory, loan_list_view, user):
    request = request_factory.get('/')
    request.user = user
    response = loan_list_view(request)
    assert response.status_code == 200
    # Add more assertions as needed


def test_post(request_factory, loan_list_view, user):
    request = request_factory.post('/', {'amount': 1000})
    request.user = user
    response = loan_list_view(request)
    assert response.status_code == 201
    # Add more assertions as needed
