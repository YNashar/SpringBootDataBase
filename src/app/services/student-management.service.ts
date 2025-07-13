import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { Faculty } from '../models/faculty.model';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { Grade } from '../models/grade.model';

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) { }

  // Student operations
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/students/${id}`);
  }

  addStudent(student: Omit<Student, 'studentId'>): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/students`, student);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/students/${student.studentId}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/students/${id}`);
  }

  // Faculty operations (read-only for reference)
  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.apiUrl}/faculties`);
  }

  // Course operations (read-only for reference)
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getCoursesByFaculty(facultyId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/faculties/${facultyId}/courses`);
  }

  // Enrollment operations
  getStudentEnrollments(studentId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/students/${studentId}/enrollments`);
  }

  enrollStudent(enrollment: Omit<Enrollment, 'enrollmentId'>): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/enrollments`, enrollment);
  }

  unenrollStudent(enrollmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/enrollments/${enrollmentId}`);
  }

  // Grade operations
  getStudentGrades(studentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/students/${studentId}/grades`);
  }

  addGrade(grade: Omit<Grade, 'gradeId'>): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, grade);
  }

  updateGrade(grade: Grade): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/grades/${grade.gradeId}`, grade);
  }

  deleteGrade(gradeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/grades/${gradeId}`);
  }
} 