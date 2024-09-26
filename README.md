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

[Full API Endpoints description](endpoints.md)


### ***Database Schema Design:***


### ***OpenAPI Specification (for SwaggerHub)***

Here’s the starting point for your OpenAPI specification. This is what you will upload to SwaggerHub for API visualization:

```yaml

```
