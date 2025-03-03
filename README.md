# 📌 Blood_Hub API Documentation

## API Endpoints 🏗️
<br>

## 1. **_REGISTER A NEW USER IN OUR SYSTEM WITH THIS API_** 🪧
#### 📫POST 🙎🏽‍♀️ `/user/register` 🙎🏽‍♂️

**Request Body:**

`Required Feild`

| ***Field*** | 🚦***Rules*** 🚦 |
|-------|--------|
| **Fullname** | - Object containing FirstName and LastName<br>- Required <br>- MiddleName Optional |
| **Email** | - Required<br>- Valid email format<br>- Must be unique |
| **Password** | - Required<br>- Minimum 8 characters<br>- At least one uppercase letter<br>- At least one lowercase letter<br>- At least one number<br>- At least one special character |
| **Donar/Reciver** | - Required<br>- Options



<br><br>


# LIKE This object ✅

```js
  fullname:{
    firstname: 'Jone',
    lastname: 'Doe'
  }
    email: "user@example.com",
    password: "StrongPass123!",
```
<br>

## Response Code
```diff
+ Response Code Success Response (201) ✅
- Response Code Error Response (500) ❌
```
<br><br>

# ***Sending OTP in Mail***

`We Send OTP in Mail`

After Otp Varifiction the data will be save in the Database. 

<br><br>

#  MONGOOSE SAVED DATA 📑

```js
    userId: mongoose.Schema.Types.ObjectId,  // mongoose object id
    email: String,  // string containing
    fullname: Object{},  // object containing
    password: string (hash),  // hashed password
````
<br>

## ***Validation Rules***
- **`Fullname`**: 
  - Required
  - Alphanumeric characters and no underscores
  - Must be unique
  - this is a Object which is the collection of firstname and lastname

    - **`FirstName`**:
      - Required
      - 2-15 characters long

    - **`MiddleName`**:
      - Optional
      - 2-15 characters long

    - **`LastName`**:
      - Required
      - 2-15 characters long
- **`Email`**:
  - Required
  - Must be a valid email format
  - Must be unique
- **`Password`**:
  - Required
  - Minimum 8 characters
  - Maximum 25 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character
---
<br><br>

## 2. **_LOGIN THE USER IN OUR SYSTEM WITH THIS API_** 🪧
<br>

#### 📫POST 🙎🏽‍♀️ `/user/login` 🙎🏽‍♂️

**Request Body:**

| ***Field*** | ***Rules*** |
|------|-------|
|Email| String("example@example.com") |
|Password| String|

## Response Code

```diff
+ if Succesfull then status code (200) ✅
- if Not Succesfull then status code (406) ❌
```

## Sending Things in Frontent 

- User Token: String ( In Cookie section with hashed format ) 

<br>
<br>
<br>

## 3. **_USER PROFILE_** 🪧

#### 📫 GET `/user/profile`

> ## _Token in Cookie Section_


- **Avaliable**
  - User Redirected to his/her profile.
- **Not Avaliable** 
  - User Redirected to the login Page !
- **If Not Match**
  - User Redirected to the login Page !
## Response Code
```diff
+if the User profile found (302) ✅
-if the User profile Not found (404) ❌
```

<br>

## 4. **_REGISTER A NEW ADMIN IN OUR SYSTEM WITH THIS API_** 🪧

<br>

> ##  **This is only used in Development Phase** 

#### 📫POST 👦🏽 `/admin/register` 👦🏽

**Request Body:**

`Required Feild`

|***Feild***|***Rules***|
|-----|-----|
|**Fullname**| - Obejct<br>- FirstName<br>- MiddleName<br>- LastName |
|**Email**|- String<br>- Must be varified email|
|**Password**|-String<br>- Minimum 08 and Maximum 25|

## Response Code
```diff
+if Admin register Succesfuly (201) ✅
-if Admin register Not Succesfuly (500) ❌
```
<br><br>

## 5. **_LOGIN THE ADMIN IN OUR SYSTEM WITH THIS API_** 🪧

#### 📫POST 👦🏽 `/admin/login` 👦🏽

**Request Body:**

`Required Feild`

|***Feild***|***Rules***|
|-----|-----|
|**Email**|- String("example@example.com")|
|**Password**|- String|

## Response Code
```diff
+if Admin Succesfuly Login(200) ✅
-if Admin Not Succesfuly Login (406) ❌
```
<br>

## 6. **_ADMIN PROFILE_** 🪧

#### 📫 GET `/admin/admin-profile`

> ## _adminToken in Cookie Section_


- **Avaliable**
  - User Redirected to his/her profile.
- **Not Avaliable** 
  - User Redirected to the login Page !
- **If Not Match**
  - User Redirected to the login Page !

## Response Code
```diff
+if the Admin profile found (302) ✅
-if the Admin profile Not found (404) ❌
```
<br>
<br>

## 7.*_GOOGLE AUTHENTICATION ROUTE_* 🪧

### Authentication Route

#### 📫 GET `/google-oth/auth/google`

---

### This is CallBack URL for Google

#### 📫 GET `/google-oth/auth/google/callback`

```javascript
  {
    Scope: ["Profile", "Email"]
  }
```
### Success Route And Failure Route

```diff
+/users/profile ✅
-/users/login ❌
```
---
<br>

> # 🛑 Important Notice :

### If User do <i><b><u>"Signin with Google"</u></b></i> they will not requirement the password section, it will be redirect by Google ID.

