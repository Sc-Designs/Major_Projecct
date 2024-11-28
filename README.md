# API Documentation

## User Registration Endpoint

### POST `/user/register`

Register a new user in the system.

#### Request Body

`Required Feild`
    email is a string,       // Required: Valid email address
    password is a string,    // Required: Password (minimum 8 characters)
    firstName is a Object,   // Required: User's first name
    phone is a number        //Required: valid Phone Numbe



#### Response

##### Success Response (200 OK)

`MONGOOSE SAVE DATA`
    "data": {
        "userId": "Id",
        "email": "string",
        "fullname": "Object",
        "createdAt": "timestamp"
    }


##### Error Responses

###### 400 Bad Request
- When required fields are missing
- When email format is invalid
- When password doesn't meet minimum requirements
- When username is already taken

```json
{
    "status": "error",
    "message": "Validation error message",
    "errors": [
        {
            "field": "field_name",
            "message": "Error description"
        }
    ]
}
```

###### 409 Conflict
- When email is already registered

`If Email Already exist`
    "status": "error",
    "message": "Email already exists"


###### 500 Internal Server Error
- When server encounters an unexpected condition

```json
{
    "status": "error",
    "message": "Internal server error"
}
```

#### Validation Rules

- **fullname**: 
  - Required
  - 3-30 characters long
  - Alphanumeric characters and underscores only
  - Must be unique
  - this is a Object which is the collection of firstname and lastname

- **email**:
  - Required
  - Must be a valid email format
  - Must be unique

- **password**:
  - Required
  - Minimum 8 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character

- **firstName**:
  - Required
  - 2-50 characters long
  - Alphabetic characters only

- **lastName**:
  - 2-50 characters long
  - Alphabetic characters only
