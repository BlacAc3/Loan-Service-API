
### **1. Authentication Endpoints**

#### **1.1 `POST /api/auth/login/`**
- **Method**: `POST`
- **Description**: This endpoint allows users to log in by providing their username and password. Upon successful login, the API returns a JSON Web Token (JWT) that can be used to authenticate subsequent requests.
- **Request Body**:
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }
  ```
- **Response**:
  - **200 OK**: Returns the JWT token for the authenticated user.
    ```json
    {
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR..."
      "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
    }
    ```
  - **401 Unauthorized**: If the username or password is incorrect.
    ```json
    {
      "detail": "Invalid credentials"
    }
    ```

- **What It Leads To**: After login, users will receive a JWT token, which they must include in the `Authorization` header (as `Bearer <token>`) when accessing other secured endpoints.

---

#### **1.2 `POST /api/auth/register/`**
- **Method**: `POST`
- **Description**: This endpoint allows new users to register by providing a username, email, and password. Upon successful registration, the user account is created, and they can log in to access the API. Passwords are stored securely using hashing.
- **Request Body**:
  ```json
  {
    "first_name":"user_firstname",
    "last_name":"user_lastname",
    "username": "new_user",
    "email": "user@example.com",
    "password": "strong_password",
  }
  ```
- **Response**:
  - **201 Created**: Returns the details of the newly created user.
    ```json
    {
      "id": 1,
      "username": "new_user",
      "email": "user@example.com"
    }
    ```
  - **400 Bad Request**: If the username or email is already taken, or the password doesn’t meet security requirements.
    ```json
    {
      "username": ["This username is already taken."]
    }
    ```

- **What It Leads To**: Once the user registers, they can use the login endpoint to authenticate and gain access to the system.
---
#### **1.1 `POST /api/token/refresh`**
- **Method**: `POST`
- **Description**: This endpoint allows client to refresh access token.
- **Request Body**:
  ```json
  {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR",
  }
  ```
- **Response**:
  - **200 OK**: Returns the new JWT access token.
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
    }
    ```
  - **404 Invalid Request**: If the an invalid token is provided
    ```json
    {
      "detail": "Invalid credentials"
    }
    ```

- **What It Leads To**: After login, users will receive a JWT token, which they must include in the `Authorization` header (as `Bearer <token>`) when accessing other secured endpoints.

---

#### **1.3 `POST /api/auth/logout/`**
- **Method**: `POST`
- **Description**: This endpoint logs out users.
- **Authorization**: Requires a valid JWT token in the request header.
- **Request Body**:
  ```json
  {
    "refresh":"eyJhbGciOiJIUzI1NiIsInR..."
  }
  ```
- **Response**:
  - **205 RESET CONTENT**: Returns the succesful logout message.
    ```json
      {'detail': 'Successfully logged out.'}
    ```
    - **404 BAD REQUEST**: Returns error for an invalid token.
      ```json
        {'detail': 'Invalid token.'}
      ```
---

### **2. Loan Endpoints**

#### **2.1 `GET /api/loans/`**
- **Method**: `GET`
- **Description**: Lists all loans for the authenticated user (based on the JWT token provided). This endpoint allows users to view the loans they have applied for, including details like loan amount, interest rate, and status.
- **Authorization**: Requires a valid JWT token in the request header.
- **Response**:
  - **200 OK**: Returns a list of loans for the authenticated user.
    ```json
    [
      {
        "id": 1,
        "loan_amount": 10000,
        "total_interest": 5.0,
        "term_months": 12,
        "status": "pending",
        "created_at":"2024-09-17T12:00:00Z",
        "approved_at": null
      },
      {
        "id": 2,
        "loan_amount": 15000,
        "total_interest": 4.5,
        "term_months": 24,
        "status": "approved",
        "created_at":"2024-09-17T12:00:00Z",
        "approved_at": "2024-09-17T12:00:00Z"
      }
    ]
    ```
  - **401 Unauthorized**: If no valid token is provided.
    ```json
    {
      "detail": "Authentication credentials were not provided."
    }
    ```

- **What It Leads To**: This allows users to keep track of their loan applications and see the current status (e.g., pending, approved, rejected).

#### **2.2 `POST /api/loans/`**
- **Method**: `POST`
- **Description**: This endpoint allows authenticated users to apply for a loan. The user must provide loan details such as the loan amount, interest rate, and term (in months). After submission, the loan will be in a pending state, awaiting approval from an admin.
- **Authorization**: Requires a valid JWT token in the request header.
- **Request Body**:
  ```json
  {
    "loan_amount": 10000,
    "total_interest": 5.0,
    "term_months": 12
  }
  ```
- **Response**:
  - **201 Created**: Returns the loan application details.
    ```json
    {
      "id": 3,
      "loan_amount": 10000,
      "total_interest": 5.0,
      "term_months": 12,
      "status": "pending",
      "approved_at": null
    }
    ```
  - **400 Bad Request**: If there is a validation error (e.g., invalid data format).
    ```json
    {
      "loan_amount": ["Ensure this value is greater than or equal to 1000."]
    }
    ```

- **What It Leads To**: The loan is submitted for admin approval. The user can check the status of the loan using the `GET /api/loans/` endpoint.

#### **2.3 `POST /api/loans/{loan_id}/approve/`**
- **Method**: `POST`
- **Description**: This endpoint allows admins to approve or reject loan applications. Admins can update the status of a loan, and once approved, the loan will generate a repayment schedule. This is an admin-only endpoint, and users with the "admin" role have access.
- **Authorization**: Requires a valid JWT token in the request header and the user to have an "admin" role.
- **Path Parameter**:
  - `loan_id`: The ID of the loan to approve or reject.
- **Request Body**:
  ```json
  {
    "status": "approved"
  }
  ```
    **or**
  ```
  {
    "status":"rejected"
  }
  ```
  - **Response**:
  - **200 OK**: Returns the updated loan details.
    ```json
    {
      "id": 3,
      "loan_amount": 10000,
      "interest_rate": 5.0,
      "term_months": 12,
      "status": "approved",
      "approved_at": "2024-09-17T12:00:00Z"
    }
    ```
  - **403 Forbidden**: If the user is not an admin.
    ```json
    {
      "detail": "You do not have permission to perform this action."
    }
    ```

- **What It Leads To**: Once a loan is approved, the system generates a repayment schedule for the loan. This endpoint demonstrates role-based access control, as only admins can approve or reject loans.

---

### **3. Repayment Endpoints**

#### **3.1 `POST /api/repayments/{loan_id}/`**
- **Method**: `POST`
- **Description**: This endpoint allows users to make repayments towards an approved loan. The user provides the amount being repaid, and the system updates the loan’s balance.
- **Authorization**: Requires a valid JWT token in the request header.
- **Path Parameter**:
  - `loan_id`: The ID of the loan being repaid.
- **Request Body**:
  ```json
  {
    "amount": 500
  }
  ```
- **Response**:
  - **200 OK**: Returns the updated repayment and loan balance details.
    ```json
    {
      "id": 4,
      "loan_id": 1,
      "amount_paid": 500,
      "amount_outstanding":"1000",
      "final_repayment_date": "2024-09-17T15:00:00Z"
    }
    ```
  - **400 Bad Request**: If the repayment amount exceeds the remaining balance or there’s a validation error.
    ```json
    {
      "detail": "Repayment amount exceeds outstanding balance."
    }
    ```

- **What It Leads To**: This allows users to keep track of their repayments and see the updated balance on the loan.

---

### **4. Loan Schedule Endpoint**

#### **4.1 `GET /api/loans/{loan_id}/schedule/`**
    - **Method**: `GET`
    - **Description**: This endpoint provides users with the repayment schedule for a specific loan. The schedule is automatically generated when the loan is approved and shows details such as the amount to be repaid each month and due dates.
    - **Authorization**: Requires a valid JWT token in the request header.
    - **Path Parameter**:
    - `loan_id`: The ID of the loan for which the schedule is being retrieved.
    - **Response**:
        - **200 OK**: Returns the repayment schedule details.
        ```json
        [
          {
            "month": 1,
            "due_date": "2024-10-01",
            "amount_due": 850
          },
          {
            "month": 2,
            "due_date": "2024-11-01",
            "amount_due": 850
          },
          ...
        ]
        ```

    ---

#### **5 `GET /api/auth/user/`**
    - **Method**: `GET`
    - **Description**: Retrieves the authenticated user’s profile information.
    - **Authorization**: Requires a valid JWT token in the request header.
    - **Response**:
      - **200 OK**: Returns the details of the currently authenticated user.
        ```json
        {
          "id": 1,
          "username": "new_user",
          "email": "user@example.com"
        }
        ```

    ---

### **6. Admin Management Endpoints**

#### **6.1 `GET /api/users/`**
    - **Method**: `GET`
    - **Description**: Allows admin users to list all registered users. Only accessible by admins.
    - **Authorization**: Requires admin privileges.
    - **Response**:
      - **200 OK**: Returns a list of all users in the system.
        ```json
        [
          {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com"
          },
          {
            "id": 2,
            "username": "new_user",
            "email": "new_user@example.com"
          }
        ]
        ```
        - **403 Forbidden**: If the user is not an admin.

    ---

#### **6.2 `DELETE /api/users/{user_id}/`**
    - **Method**: `DELETE`
    - **Description**: Allows admin users to delete a specific user from the system.
    - **Authorization**: Requires admin privileges.
    - **Path Parameter**:
      - `user_id`: The ID of the user to delete.
    - **Response**:
      - **204 No Content**: Indicates the user was successfully deleted.
      - **404 Not Found**: If the user does not exist.
      - **403 Forbidden**: If the user is not an admin.

    ---

