Loan Management API
---

#### ***Description:***
This Loan Management API is designed to handle loan applications, repayment schedules, and tracking for users. This API provides secure authentication via JWT, allows users to manage their loans, and enables administrators to oversee all transactions. The project showcases my expertise in API development, authentication, database design, and testing, along with best practices for scalability, security, and maintainability.

#### ***Technologies Used:***
- **Django REST Framework (DRF)**: For building the API.
- **PostgreSQL**: As the primary relational database.
- **Redis & Celery**: For caching and background tasks (e.g., processing loan approvals). <-------- Functionality Implementation Pending
- **JWT Authentication**: To secure API endpoints.
- **Swagger & OpenAPI**: For API documentation and visualization. 
- **Docker**: For containerization and easy deployment. <-------- Functionality Implementation Pending

#### ***Key Features:***
1. **JWT Authentication & User Roles**: Secure access to endpoints based on user roles (e.g., Admin, Borrower).
2. **Loan Application & Approval**: Users can apply for loans, and the system automatically generates a loan schedule. Admins approve or reject loan applications.
3. **Loan Repayment Tracking**: Tracks repayments and updates loan balances.
4. **Loan Schedules**: Automatically generate schedules using background tasks (Celery).
5. **Error Handling**: Ensures smooth and secure API access.
6. **Testing**: Comprehensive unit and integration testing using Django's test framework. <-------- Functionality Implementation Pending
7. **Deployment**: Hosted using Docker and deployed on AWS with a CI/CD pipeline. <-------- Functionality Implementation Pending
8. **API Versioning**: Ensures backward compatibility as new features are added.

<br>
<br>


## Setup and Installation

### Running with Docker
Ensure you have Docker installed, if not follow their installation guide [Docker Installation](https://docs.docker.com/engine/install/)
To run a Docker image and assign a custom name to the container, you can use the `--name` option in the `docker run` command.

#### 1. Build Docker Image:

```bash
docker build -t loan-service . 
```

#### 2. Run Docker Image:
The project will run in the background at `localhost:8000`, add the `-d` tag to run in background. Replace ` --name loan-service ` to your preferred container name if the former is already in use, E.g - ` --name loan-service2 `. 
```bash
docker run --name loan-service -p 8000:8000 loan-service
```

#### 3. View all running images
```bash
docker ps
```

#### 4. Add an admin password
```bash
docker exec -it <container-id/name> python manage.py changepassword admin
```
The Admin Page will now be accessible at `http://127.0.0.1:8000/admin` or `localhost:8000/admin`
- username: `admin`
- password: `(Your set password from the above command)`

#### 4. Stop Docker Image:
```bash
docker stop loan-service 
```


<br>
<br>

### Manual Setup

Ensure you have the following installed on your system:

- Python (>= 3.8)
- [PostgreSQL](https://www.postgresql.org/download/) (or any other supported database)
- [Virtualenv](https://virtualenv.pypa.io/en/latest/installation.html) for managing virtual environments
- [Git](https://git-scm.com/) for version control

#### 1. Clone the Repository

```bash
git clone https://github.com/BlacAc3/loan-api.git
cd loan-api
```

#### 2. Set Up Virtual Environment

Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

#### 3. Install Dependencies

Install the required Python packages using `pip`:

```bash
pip install -r requirements.txt
```


#### 4. Configure Database

Make sure PostgreSQL (or your chosen database) is installed and running. Create the database with the name specified in the `.env` file:

```bash
# Log into PostgreSQL
psql -U your_db_user
# Create a new database
CREATE DATABASE your_db_name;
```

#### 5. Run Migrations

Apply the database migrations to set up the database schema:

```bash
python manage.py migrate
```

#### 6. Create a Superuser (Admin)

Create an admin user to access the Django admin panel `http://127.0.0.1:8000/admin` or `localhost:8000/admin` after running the server:

```bash
python manage.py createsuperuser
```

#### 7. Run the Development Server

Now that everything is set up, you can run the development server:

```bash
python manage.py runserver
```

To see the project, open your browser and visit `http://127.0.0.1:8000/` or `localhost:8000`.

<br>
<br>


## Running Tests

To run the automated tests for the application, execute the following command:

```bash
python manage.py test
```
<br>
<br>

## API Documentation

### **Endpoints documentation**
The full documentation of all working API endpoints provided: 
[API Endpoints Documentation](endpoints.md)


### **OpenAPI Specification (for SwaggerHub)**

Here’s a starting point for the OpenAPI specification. This is what you will upload to SwaggerHub for API visualization: 
- [OpenAPI YAML file](openapi.yaml) (Database schema included)
- [SwaggerHub API Visualization](https://app.swaggerhub.com/apis/ACEEZEALA/Ace_Loan/1.0.0)

<br>
<br>


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

