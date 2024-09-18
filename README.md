# 🚀 Quiz Evaluation Platform

## Introduction

Welcome to the **Quiz Evaluation Platform**! This project provides an innovative and user-friendly solution for creating, administering, and evaluating quizzes. It offers features such as real-time student participation, performance analytics, and secure data handling.

- **Final Project Blog Article:** [Read More](https://www.linkedin.com/feed/update/urn:li:activity:7242197599754088450/)
- **Authors LinkedIn:** 
  - [Wessal Ayman: Project Manager/Backend Developer](linkedin.com/in/wessal-ayman-43ab19254)
  - [Abdelfattah Mohamed: Frontend Developer](https://www.linkedin.com/in/abd-el-fattah-mohammed-7215a7212?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
  - [Rahma Rubi: Frontend Developer](https://www.linkedin.com/in/rahma-rubi-45663b259?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BivS5wh3XQTGxY9lhLVdGIA%3D%3D)

![Quiz Evaluation Platform Screenshot](./Pages/Assets/TeacherDashboard.jpg)

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
- **MySQL:** Install and run MySQL on your system


### Steps


1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Wessal-Ayman1511/Quiz_Evaluation_Platform.git
2. **Set Up the Database:**
    - Create a New Database: Log into MySQL and create a new database:
    - CREATE DATABASE quiz_evaluation;
    - Update Configuration: Edit the config.py file to include your MySQL database credentials:
    - SQLALCHEMY_DATABASE_URI = 'mysql://username:password@localhost/quiz_evaluation'.

3. **Navigate to the Project Directory:**
```bash
   cd Quiz_Evaluation_Platform
   pip install -r requirements.txt
   export FLASK_APP=run.py
   flask run
