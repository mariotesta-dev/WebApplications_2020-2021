# BigLab 2 - Class: 2021 AW1 M-Z

## Student:

- TESTA MARIO

## Users for testing purposes:

- 1. email: "john.doe@polito.it" , password: "password"
- 2. email: "test@test.it" , password: "mafrada2021"

## List of APIs offered by the server for Tasks management

Hereafter, we report the designed HTTP APIs, also implemented in the project.

### **List All Tasks**

URL: `/api/tasks`

Method: GET

Description: Get all the tasks

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[{
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
}, {
    "id": 4,
    "description": "Watch the Express videolecture",
    "important": 1,
    "private": 1,
    "deadline": "2021-05-24 09:00",
    "completed": 1,
    "user": 1
},
...
]
```

### **List Important Tasks**

URL: `/api/tasks/important`

Method: GET

Description: Get all the important tasks

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[{
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
}, {
    "id": 4,
    "description": "Watch the Express videolecture",
    "important": 1,
    "private": 1,
    "deadline": "2021-05-24 09:00",
    "completed": 1,
    "user": 1
},
...
]
```

### **List Private Tasks**

URL: `/api/tasks/private`

Method: GET

Description: Get all the private tasks

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a private task.

```
[{
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
}, {
    "id": 4,
    "description": "Watch the Express videolecture",
    "important": 1,
    "private": 1,
    "deadline": "2021-05-24 09:00",
    "completed": 1,
    "user": 1
},
...
]
```

### **List Task Given Deadline**

URL: `/api/tasks/date/:deadline`

Method: GET

Description: Get by deadline

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task with <deadline> as deadline.

```
[
    {
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
    },
...
]
```

### **List Task Next Seven Days**

URL: `/api/tasks/nextsevendays`

Method: GET

Description: Get by deadline

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[
    {
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
    },
...
]
```

### **List Task Given Id**

URL: `/api/tasks/select/:id`

Method: GET

Description: Get task given the id

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: A single object describing a task with given <id>.

```
[
    {
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
    }
]
```

### **Post new task**

URL: `/api/tasks`

Method: POST

Description: Add a new task to the list of tasks

Request body: An object representing a task, without id because it will be automatically generated

```
[
    {
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
    }
]
```

Response: `201 OK` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### **Update a task**

URL: `/api/tasks/select/:id`

Method: PUT

Description: Update an existing task, identified by its id.

Request body: An object representing a task

```
[
    {
    "id": <id>,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
    }
]
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### **Set a task as completed**

URL: `/api/tasks/completed/:id`

Method: PUT

Description: Mark a task as completed/uncompleted.

Request body: An object representing a task

```
[
    {
    "id": <id>,
    "completed": 1
    }
]
```

Response: `201 OK` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

### **Delete a task**

URL: `/api/tasks/select/:id`

Method: DELETE

Description: Delete a task from database.

Request body: _None_

Response: `204 No content` (success) or `503 Service Unavailable` (generic error).

Response body: _None_

## List of APIs offered by the server for User management

Hereafter, we report the designed HTTP APIs, also implemented in the project.

### **Login**

URL: `/api/sessions`

Method: POST

Description: Send credentials in order to login a user.

Request body: An object containing user credentials

```
{
    "username": "john.doe@polito.it"
    "password": "password"
}

```

Response: `200 OK` (success) or `401 Unauthorized` (Unauthenticated user).

Response body: A string message explaining what is going on.

### **Logout**

URL: `/api/sessions/current`

Method: DELETE

Description: Send credentials in order to login a user.

Request body: _None_

Response: `200 OK` (success) or `500 Generic Error` (generic error).

Response body: _None_

### **Get User Infos**

URL: `/api/sessions/current`

Method: GET

Description: Get current user informations to be used along the routes.

Request body: _None_

Response: `200 OK` (success) or `401 Unauthorized` (Unauthenticated user).

Response body: An object with username informations

```
{
    "id": 1
    "username": "john.doe@polito.it"
    "name": "John"
}

```
