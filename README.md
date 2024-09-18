# 🚀 Quiz Evaluation Platform

## Introduction

Welcome to the **Quiz Evaluation Platform**! This project provides an innovative and user-friendly solution for creating, administering, and evaluating quizzes. It offers features such as real-time student participation, performance analytics, and secure data handling.

- **Final Project Blog Article:** [Read More](#)
- **Author LinkedIn:** [Wessal Ayman](https://www.linkedin.com/in/wessal-ayman/)

![Quiz Evaluation Platform Screenshot](./Pages/Assets/BookOpenQuizWhiz.png)

## Key Features

1. **Quiz Creation and Management:**
   - Create and manage quizzes with various question types and settings.

2. **Real-Time Student Participation:**
   - Engage students with live quizzes and receive instant feedback.

3. **Performance Analytics:**
   - Track student progress and performance with detailed analytics.

4. **Secure Data Handling:**
   - Utilize RESTful APIs for secure data operations.

## Installation

Follow these steps to set up the Quiz Evaluation Platform on your local machine:

### Prerequisites

- **Python:** Ensure Python 3.6 or higher is installed.
- **MySQL:** Install and run MySQL on your system.

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Wessal-Ayman1511/Quiz_Evaluation_Platform.git

2. **Navigate to the Project Directory:**
```bash
   cd Quiz_Evaluation_Platform

3. **Install Dependencies:**
```bash
   pip install -r requirements.txt

4. **Set Up the Database:**
    Create a New Database: Log into MySQL and create a new database:
    CREATE DATABASE quiz_evaluation;
    Update Configuration: Edit the config.py file to include your MySQL database credentials:
    SQLALCHEMY_DATABASE_URI = 'mysql://username:password@localhost/quiz_evaluation'
    Run Database Migrations: Initialize database schema:

5. **Run the server**
```bash
    export FLASK_APP=run.py
    flask run
    The application will be accessible at http://localhost:5000.
