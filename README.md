# Teacher-Student API

## Introduction
This API allows teachers to perform administrative functions for their classes, such as registering students, retrieving common students, suspending students, and retrieving notification recipients.

## Prerequisites
- Node.js
- PostgreSQL
- npm (Node Package Manager)

## Setup

### Step 1: Clone the repository
Clone this repository to your local machine using:
```sh
git clone https://github.com/akritipr/teacher-student.git
cd teacher-student/
```

### Step 2: Download dependencies
```sh
npm install
```


### Step 3: DB setup to create tables
Run the following command to create tables
```sh
node src/db/migrations/init.js
```

### Step 4: Run the program
```sh
npm run start

```
The program will run at port 3000

### Step 5: Test the program
```sh
npm run test
```


## Optional
Import postman collection 
```sh
https://github.com/akritipr/teacher-student/blob/main/postman-collection/AWS%20EC2.postman_collection.json
https://github.com/akritipr/teacher-student/blob/main/postman-collection/Teacher%20Student.postman_collection.json
```