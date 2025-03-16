# Loan Management API

#### ***Description:***
This Loan Management API handles loan applications, repayment schedules, and tracking for users. The API provides secure authentication via JWT, allows users to manage their loans, and enables administrators to oversee transactions. The project demonstrates expertise in API development, authentication, database design, and follows best practices for scalability, security, and maintainability.

#### ***Technologies Used:***
- **Django REST Framework (DRF)**: For building the API endpoints
- **PostgreSQL**: As the primary relational database
- **JWT Authentication**: For securing API endpoints with token-based auth
- **Swagger & OpenAPI**: For API documentation and visualization
- **Python-dateutil**: For advanced date manipulation
- **Django-environ**: For environment variable management
- **Django CORS headers**: For cross-origin resource sharing

#### ***Key Features:***
1. **JWT Authentication**: Secure endpoints with access and refresh tokens
2. **User Management**: Register, login, and profile management
3. **Loan Application & Lifecycle**: Apply, approve/reject, and track loans
4. **Repayment Schedule**: Automatic generation of payment schedules with interest calculation
5. **Loan Repayment Tracking**: Process payments and update loan balances
6. **Role-Based Access Control**: Different permissions for regular users and admins
7. **CORS Support**: Cross-origin resource sharing for frontend integration

## API Endpoints

### Authentication
- **POST /api/auth/register/**: Register a new user
- **POST /api/auth/login/**: User login with JWT token response
- **POST /api/auth/logout/**: Logout and blacklist user token
- **POST /api/token/refresh/**: Refresh an expired access token
- **GET /api/auth/user/**: Get authenticated user's profile

### Loans
- **GET /api/loans/**: List all loans for the authenticated user
- **POST /api/loans/**: Apply for a new loan
- **GET /api/loans/{loan_id}/**: Get details of a specific loan
- **GET /api/loans/{loan_id}/approve/**: Approve a loan (admin function)
- **GET /api/loans/{loan_id}/reject/**: Reject a loan (admin function)
- **GET /api/loans/{loan_id}/schedule/**: Get the repayment schedule for a loan

### Repayments
- **POST /api/repayments/{loan_id}/**: Make a repayment towards a loan

## Setup and Installation

### Prerequisites
- Python 3.8+
- PostgreSQL database
- Git

### Running with Docker
Ensure you have Docker installed, if not follow their installation guide [Docker Installation](https://docs.docker.com/engine/install/)

#### 1. Build Docker Image:
```bash
docker build -t loan-service .
```

#### 2. Run Docker Image:
The project will run at `localhost:8000`, add the `-d` tag to run in the background.
```bash
docker run --name loan-service -p 8000:8000 loan-service
```

#### 3. View all running images
```bash
docker ps
```

#### 4. Add an admin password
```bash
docker exec -it loan-service python manage.py changepassword admin
```
Access the admin page at `http://127.0.0.1:8000/admin` or `localhost:8000/admin`
- username: `admin`
- password: `(Your set password from the above command)`

#### 5. Stop Docker Image:
```bash
docker stop loan-service
```

### Manual Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/BlacAc3/loan-api.git
cd loan-api
```

#### 2. Set Up Virtual Environment
```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Create Environment File
Create a `.env` file with the following variables:
```
SECRET_KEY=your_secret_key
DATABASE_URL=postgres://username:password@localhost:5432/loan_db
```

#### 5. Run Migrations
```bash
python manage.py migrate
```

#### 6. Create a Superuser (Admin)
```bash
python manage.py createsuperuser
```

#### 7. Run the Development Server
```bash
python manage.py runserver
```

Access the API at `http://127.0.0.1:8000/` or `localhost:8000`.

## Running Tests
```bash
python manage.py test
```

## API Documentation
For detailed API documentation, please refer to:
- [OpenAPI YAML file](docs/loan_app.yaml)
- [SwaggerHub API Visualization](https://app.swaggerhub.com/apis/ACEEZEALA/Ace_Loan/1.0.0)

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
