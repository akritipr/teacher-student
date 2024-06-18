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

### Step 2: Download dependencies
npm install

### Step 3: Run the program
npm run start
The program will run at port 3000

### Step 4: Test the program
npm run test


## DB Setup

### Step 1:
Run the following command to create tables
node src/db/migrations/init.js
