# users-friends api

## Description

- CRUD operations
- Finds relationship distance from one user to another user.

## Getting Started

### Dependencies

- NodeJS 20
- MongoDB

### Executing program

- Copy **.env.local**, rename it to **.env** and fill in env vars

```
MONGODB_URI=
```

- Run the command

```bash
docker run -p 3000:3000 app
```

### Calling the enpoints

```bash
GET http://127.0.0.1:3000/api/v1/users
```

### Postman collection

users.postman_collection.json

## Authors

Héctor Alarcón

## Version History

- 0.2
  - Relationship endpoint
  - Docker
- 0.1
  - CRUD operations
