import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Student } from '../models/student.model';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { StudentService } from '../services/student.service';
import { CourseService } from '../services/course.service';
import { EnrollmentService } from '../services/enrollment.service';

@Component({
  selector: 'app-enrollments',
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.css']
})
export class EnrollmentsComponent implements OnInit {
  enrollments: any[] = [];
  students: Student[] = [];
  courses: any[] = [];
  enrollmentForm: FormGroup;
  editingEnrollment: any = null;
  errorMessage = '';
  loading = false;
  submitting = false;

  constructor(
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private courseService: CourseService,
    private fb: FormBuilder
  ) {
    this.enrollmentForm = this.fb.group({
      studentId: [null, Validators.required],
      courseId: [null, Validators.required],
      enrollmentDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEnrollments();
    this.loadStudents();
    this.loadCourses();
  }

  loadEnrollments() {
    this.loading = true;
    this.errorMessage = '';
    this.enrollmentService.getEnrollments().subscribe({
      next: enrollments => {
        this.enrollments = enrollments;
        this.loading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to load enrollments.';
        this.loading = false;
      }
    });
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: students => this.students = students,
      error: err => this.errorMessage = 'Failed to load students.'
    });
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: courses => this.courses = courses,
      error: err => this.errorMessage = 'Failed to load courses.'
    });
  }

  startEdit(enrollment: any) {
    this.editingEnrollment = enrollment;
    this.enrollmentForm.setValue({
      studentId: enrollment.student_id || enrollment.studentId,
      courseId: enrollment.course_id || enrollment.courseId,
      enrollmentDate: enrollment.enrollment_date || enrollment.enrollmentDate ? 
        new Date(enrollment.enrollment_date || enrollment.enrollmentDate).toISOString().split('T')[0] : ''
    });
  }

  cancelEdit() {
    this.editingEnrollment = null;
    this.enrollmentForm.reset();
    this.errorMessage = '';
  }

  submit() {
    if (this.enrollmentForm.invalid) return;
    
    this.submitting = true;
    this.errorMessage = '';
    
    const enrollmentData = this.enrollmentForm.value;
    
    if (this.editingEnrollment) {
      const updated = { 
        ...this.editingEnrollment, 
        student_id: enrollmentData.studentId,
        course_id: enrollmentData.courseId,
        enrollment_date: enrollmentData.enrollmentDate
      };
      this.enrollmentService.updateEnrollment(updated).subscribe({
        next: () => {
          this.loadEnrollments();
          this.cancelEdit();
          this.submitting = false;
        },
        error: err => {
          this.errorMessage = 'Failed to update enrollment.';
          this.submitting = false;
        }
      });
    } else {
      const newEnrollment = {
        student_id: enrollmentData.studentId,
        course_id: enrollmentData.courseId,
        enrollment_date: enrollmentData.enrollmentDate
      };
      this.enrollmentService.addEnrollment(newEnrollment).subscribe({
        next: () => {
          this.loadEnrollments();
          this.enrollmentForm.reset();
          this.submitting = false;
        },
        error: err => {
          this.errorMessage = 'Failed to add enrollment.';
          this.submitting = false;
        }
      });
    }
  }

  deleteEnrollment(enrollment: any) {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    
    const enrollmentId = enrollment.enrollment_id || enrollment.enrollmentId;
    this.enrollmentService.deleteEnrollment(enrollmentId).subscribe({
      next: () => {
        this.loadEnrollments();
        this.errorMessage = '';
      },
      error: err => this.errorMessage = 'Failed to delete enrollment.'
    });
  }

  getStudentName(studentId: number): string {
    const student = this.students.find(s => s.studentId === studentId);
    return student ? student.studentName : `Student ID: ${studentId}`;
  }

  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.courseId === courseId);
    return course ? course.courseName : `Course ID: ${courseId}`;
  }
}
