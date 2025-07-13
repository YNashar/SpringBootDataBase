# Student Management System Setup

## Overview

This is a comprehensive student management system where **students are the main entity**. The system allows you to:

- **Manage students** (add, edit, delete)
- **Select faculties** from a predefined list (no direct editing)
- **Enroll students in courses** from their faculty
- **Manage grades** for enrolled courses

## Backend (Spring Boot)

1. Make sure your Spring Boot application is running on `http://localhost:8080`
2. Ensure your entities and controllers are properly configured
3. The backend should expose the following endpoints:

### Students
- GET `/api/v1/students` - Get all students
- GET `/api/v1/students/{id}` - Get student by ID
- POST `/api/v1/students` - Create a new student
- PUT `/api/v1/students/{id}` - Update student
- DELETE `/api/v1/students/{id}` - Delete student

### Faculties (Reference Data)
- GET `/api/v1/faculties` - Get all faculties
- GET `/api/v1/faculties/{id}/courses` - Get courses by faculty

### Courses (Reference Data)
- GET `/api/v1/courses` - Get all courses

### Enrollments
- GET `/api/v1/students/{id}/enrollments` - Get student enrollments
- POST `/api/v1/enrollments` - Enroll student in course
- DELETE `/api/v1/enrollments/{id}` - Unenroll student

### Grades
- GET `/api/v1/students/{id}/grades` - Get student grades
- POST `/api/v1/grades` - Add grade
- PUT `/api/v1/grades/{id}` - Update grade
- DELETE `/api/v1/grades/{id}` - Delete grade

## Frontend (Angular)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   ng serve
   ```

3. The application will be available at `http://localhost:4200`

## Features

### Student Management
- Add new students with comprehensive information
- Edit existing student details
- Delete students
- View all students in a table format

### Faculty & Course Selection
- Choose faculty from dropdown (read-only reference data)
- Courses are automatically filtered by selected faculty
- No direct editing of faculties or courses

### Enrollment Management
- Enroll students in courses from their faculty
- View all enrollments for a selected student
- Unenroll students from courses

### Grade Management
- Add grades for enrolled courses
- Specify semester and academic year
- View all grades for a selected student
- Delete grades

### User Interface
- Modern, responsive design
- Form validation with helpful error messages
- Interactive tables with hover effects
- Collapsible sections for better organization
- Student selection with detailed view

## Data Flow

1. **Student Creation**: Add student → Select faculty → Choose level
2. **Course Enrollment**: Select student → Choose course from faculty → Enroll
3. **Grade Entry**: Select student → Choose course → Enter grade with semester/year

## Proxy Configuration

The application uses a proxy configuration (`proxy.conf.json`) to forward API requests from the Angular dev server (port 4200) to the Spring Boot backend (port 8080).

## Troubleshooting

1. **CORS Issues**: The proxy configuration should handle this automatically
2. **API Connection**: Make sure your backend is running on port 8080
3. **Faculty/Course Loading**: Ensure your backend has faculty and course data
4. **CSS Budget Warning**: This is just a warning and doesn't affect functionality

## Architecture

- **Single Page Application**: Everything is managed from the student component
- **Reference Data**: Faculties and courses are read-only reference data
- **Student-Centric**: All operations revolve around student management
- **Modular Design**: Separate models and services for clean architecture 