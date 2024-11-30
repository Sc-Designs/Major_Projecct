# Major Project API Documentaion
### API's

## User Registration Endpoint

#### POST `/user/register`

Register a new user in the system.

#### Request Body

`Required Feild`
   - email is a string, &nbsp; // Required: Valid email address
   - password is a string, &nbsp; // Required: Password (minimum 8 characters)
   - firstName is a Object, &nbsp; // Required: User's first name
   - phone is a number &nbsp; //Required: valid Phone Numbe



#### Response Code

#### Success Response ( 200 OK )

###  **MONGOOSE SAVED DATA**
  - **`Data`**
    - userId : Id,
    - email : string &nbsp; // Required: Valid email address,
    - fullname : Object,
    - password: string (hash),
    - phone : number &nbsp; // Optional,

## **Validation Rules**

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

## User Login Endpoint

#### POST `/user/login`

Login the user in the system.

- **Request body**:
  - email : string
  - password : string
- Response:
  - **token** : string
