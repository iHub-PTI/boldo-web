# BOLDO Telemedicine REST API

The BOLDO Telemedicine API allows you to access all queries related to manipulating the patients and doctors collections like patients,doctors,appointments and to broadcast information about call-readiness.

## Working with the BOLDO Telemedicine API

All of there endpoints are available at `{server}/api`

### Request Bodies

Requests containing JSON in the request body are required to have a `'Content-Type: application/json'` header.

### Errors

For simplicity, expect the following error codes:

- 200 (OK)
- 400 (Client Error). There should be a `{messsage: string}` that includes a description of what went wrong.
- 500 (Server Error). Something happened, that we did not think about it would be possibly. You broke the server 🤨 Let us know!

### Authentication

HTTP requrest to the REST API are protected with jwt based authentication.

Expect the following error codes when facing authentication troubles:

- 401 (Not Authenticated). The accessToken is not present or expired.

To invoke a session, Login and Registration is generally handled by Keycloak server.

## Available Endpoints

### [POST] /auth

Accepts a Keycloak authorization code.

**Parameters:**

- code: string
- type: Role

**Return Value:** 200 (OK)

> This endpoint sets access_token and refresh_token cookies

> First time the user is logging in, we will create a user profile with firstName, lastName, nationalID and email

---

### [GET] /doctors

**🔒 Requires auth**
Returns a list of doctors

**Parameters:**
none

## **Return Value:** List of doctors

### [GET] /patients

**🔒 Requires auth**
Returns a list of patients

**Parameters:**
none

## **Return Value:** List of patients

# BOLDO Telemedicine Entities

## Entities

```
class Doctor {
    id : number // primary key; autoincrement
    nId: string // unique index; the national ID (cedula)
    firstName: string
    lastName: string
    gender: string
    dob: string // OR Date
    email: string
    phone: string
    imageUrl: string
    state: number // 0: has to create account, 1: has created account
   ...
}
```

```
class Patient {
    id : number // primary key; autoincrement
    nId: string // unique index; the national ID (cedula)
    firstName: string
    lastName: string
    gender: string
    job: string
    dob: string // OR Date
    email: string
    phone: string
    imageUrl: string
    streetAddress: string
    locality: string // neighbourhood
    city: string
    state: number // 0: has to create account, 1: has created account
   ...
}
```

```
class Devices {
    id: number
    userId: number // foreign key
    type: 'Patient' | 'Doctor'
    expires: Date
    accessToken: string
    refreshToken: string
}
```

```
class Permissions {
    doctorId: number // foreign key
    patientId: number // foreign key
}
```

## Types

```
AccessToken {
    userId: number
    type: 'Patient' | 'Doctor'
    deviceId: number
}
```

```
Role = 'Patient' | 'Doctor'
```
