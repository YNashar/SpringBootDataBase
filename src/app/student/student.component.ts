import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { StudentManagementService } from '../services/student-management.service';
import { Student } from '../models/student.model';
import { Faculty } from '../models/faculty.model';
import { Course } from '../models/course.model';
import { Enrollment } from '../models/enrollment.model';
import { Grade } from '../models/grade.model';
import { CourseFacultyLevelService } from '../services/course-faculty-level.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  faculties: Faculty[] = [];
  courses: Course[] = [];
  selectedStudent: Student | null = null;
  studentEnrollments: Enrollment[] = [];
  studentGrades: Grade[] = [];
  studentForm: FormGroup;
  enrollmentForm: FormGroup;
  gradeForm: FormGroup;
  errorMessage: string = '';
  validationMessage: string = '';
  selectedFacultyId: number = 0;
  showEnrollmentSection = false;
  showGradeSection = false;
  editingStudent: Student | null = null;
  selectedCoursesWithGrades: { [courseId: number]: number } = {};
  filteredCourses: Course[] = [];
  levels: number[] = [1, 2, 3, 4];
  constructor(
    private studentManagementService: StudentManagementService,
    private fb: FormBuilder,
    private courseFacultyLevelService: CourseFacultyLevelService
  ) {
    this.studentForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2)]],
      facultyId: [0, [Validators.required, Validators.min(1)]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(4)]], // max(4) for level 4
      nationalId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/), this.nationalIdValidator]]
    });
    this.enrollmentForm = this.fb.group({
      courseId: [0, [Validators.required, Validators.min(1)]]
    });
    this.gradeForm = this.fb.group({
      courseId: [0, [Validators.required, Validators.min(1)]],
      grade: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      academicYear: ['', [Validators.required]]
    });
  }
  nationalIdValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const digitsOnly = value.toString().replace(/\D/g, '');
    if (digitsOnly.length < 16) {
      return { nationalIdTooShort: { requiredLength: 16, actualLength: digitsOnly.length } };
    }
    return null;
  }
  ngOnInit(): void {
    this.loadStudents();
    this.loadFaculties();
    this.filteredCourses = [];
  }
  loadStudents(): void {
    this.studentManagementService.getStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to fetch students.';
      }
    });
  }
  loadFaculties(): void {
    this.studentManagementService.getFaculties().subscribe({
      next: (data: Faculty[]) => {
        this.faculties = data;
      },
      error: (err: any) => {
      }
    });
  }
  onFacultyChange(): void {
    const facultyId = this.studentForm.get('facultyId')?.value;
    const level = this.studentForm.get('level')?.value;
    if (facultyId && facultyId > 0 && level && level > 0) {
      this.studentManagementService.getCoursesByFaculty(facultyId).subscribe({
        next: (data: Course[]) => {
          this.courses = data;
          this.courseFacultyLevelService.getByFacultyAndLevel(facultyId, level).subscribe({
            next: (links) => {
              const allowedCourseIds = links.map((link: any) => link.courseId);
              this.filteredCourses = this.courses.filter(course => allowedCourseIds.includes(course.courseId));
              console.log('All courses:', this.courses);
              console.log('Allowed course IDs:', allowedCourseIds);
              console.log('Filtered courses:', this.filteredCourses);
            },
            error: () => {
              this.filteredCourses = [];
            }
          });
        },
        error: () => {
          this.filteredCourses = [];
        }
      });
    } else {
      this.filteredCourses = [];
    }
  }

  onLevelChange(): void {
    this.onFacultyChange();
  }
  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.showEnrollmentSection = false;
    this.showGradeSection = false;
    this.loadStudentEnrollments(student.studentId!);
    this.loadStudentGrades(student.studentId!);
  }
  loadStudentEnrollments(studentId: number): void {
    this.studentManagementService.getStudentEnrollments(studentId).subscribe({
      next: (data: Enrollment[]) => {
      },
      error: (err: any) => {
      }
    });
  }
  loadStudentGrades(studentId: number): void {
  }
  onCourseCheckboxChange(course: Course, event: any): void {
    if (event.target.checked) {
      this.selectedCoursesWithGrades[course.courseId!] = 0;
    } else {
      delete this.selectedCoursesWithGrades[course.courseId!];
    }
  }
  onGradeInput(courseId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedCoursesWithGrades[courseId] = Number(input.value);
  }
  isCourseSelected(courseId: number): boolean {
    return this.selectedCoursesWithGrades.hasOwnProperty(courseId);
  }
  toggleCourseSelection(course: Course): void {
    if (this.isCourseSelected(course.courseId!)) {
      delete this.selectedCoursesWithGrades[course.courseId!];
    } else {
      this.selectedCoursesWithGrades[course.courseId!] = 0;
    }
  }
  addStudent(): void {
    this.validationMessage = '';
    if (this.studentForm.invalid) {
      this.handleValidationErrors();
      return;
    }
    const newStudent: Student = this.studentForm.value;
    
    const coursesWithGrades = Object.entries(this.selectedCoursesWithGrades).map(([courseId, grade]) => ({
      courseId: Number(courseId),
      grade: Number(grade)
    }));
    
    this.studentManagementService.addStudent(newStudent).subscribe({
      next: (student) => {
        this.studentForm.reset({
          studentName: '',
          facultyId: 0,
          level: 1,
          nationalId: ''
        });
        this.selectedCoursesWithGrades = {};
        this.errorMessage = '';
        this.validationMessage = '';
        this.loadStudents();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to add student.';
      }
    });
  }
  startEditStudent(student: Student): void {
    this.editingStudent = student;
    this.studentForm.patchValue(student);
   
    this.selectedCoursesWithGrades = {};
  }
  updateStudent(): void {
    if (!this.editingStudent || this.studentForm.invalid) return;
    const updatedStudent: Student = { ...this.editingStudent, ...this.studentForm.value };
    
    const coursesWithGrades = Object.entries(this.selectedCoursesWithGrades).map(([courseId, grade]) => ({
      courseId: Number(courseId),
      grade: Number(grade)
    }));
    
    this.studentManagementService.updateStudent(updatedStudent).subscribe({
      next: () => {
        this.editingStudent = null;
        this.studentForm.reset({
          studentName: '',
          facultyId: 0,
          level: 1,
          nationalId: ''
        });
        this.selectedCoursesWithGrades = {};
        this.loadStudents();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to update student.';
      }
    });
  }
  cancelEdit(): void {
    this.editingStudent = null;
    this.studentForm.reset({
      studentName: '',
      facultyId: 0,
      level: 1,
      nationalId: '',
    });
  }
  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentManagementService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
          if (this.selectedStudent?.studentId === id) {
            this.selectedStudent = null;
          }
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete student.';
        }
      });
    }
  }
  enrollStudent(): void {
    if (!this.selectedStudent || this.enrollmentForm.invalid) return;
    const enrollment: Omit<Enrollment, 'enrollmentId'> = {
      studentId: this.selectedStudent.studentId!,
      courseId: this.enrollmentForm.get('courseId')?.value
    };
    this.studentManagementService.enrollStudent(enrollment).subscribe({
      next: () => {
        this.enrollmentForm.reset({ courseId: 0 });
        this.loadStudentEnrollments(this.selectedStudent!.studentId!);
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to enroll student.';
      }
    });
  }
  unenrollStudent(enrollmentId: number): void {
    if (confirm('Are you sure you want to unenroll from this course?')) {
      this.studentManagementService.unenrollStudent(enrollmentId).subscribe({
        next: () => {
          this.loadStudentEnrollments(this.selectedStudent!.studentId!);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to unenroll student.';
        }
      });
    }
  }
  addGrade(): void {
    if (!this.selectedStudent || this.gradeForm.invalid) return;
    const grade: Omit<Grade, 'gradeId'> = {
      studentId: this.selectedStudent.studentId!,
      courseId: this.gradeForm.get('courseId')?.value,
      grade: this.gradeForm.get('grade')?.value,
      semester: '',
      academicYear: this.gradeForm.get('academicYear')?.value
    };
    this.studentManagementService.addGrade(grade).subscribe({
      next: () => {
        this.gradeForm.reset({
          courseId: 0,
          grade: 0,
          semester: '',
          academicYear: ''
        });
        this.loadStudentGrades(this.selectedStudent!.studentId!);
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to add grade.';
      }
    });
  }
  deleteGrade(gradeId: number): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.studentManagementService.deleteGrade(gradeId).subscribe({
        next: () => {
          this.loadStudentGrades(this.selectedStudent!.studentId!);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete grade.';
        }
      });
    }
  }
  getFacultyName(facultyId: number): string {
    const faculty = this.faculties.find(f => f.facultyId === facultyId);
    return faculty ? faculty.facultyName : 'Unknown Faculty';
  }
  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.courseId === courseId);
    return course ? course.courseName : 'Unknown Course';
  }
  getCourseLevel(courseId: number): string {
    const course = this.courses.find(c => c.courseId === courseId);
    return course ? course.level.toString() : '-';
  }
  getLetterGrade(grade: number): string {
    if (grade >= 95) return 'A+';
    if (grade >= 90) return 'A';
    if (grade >= 85) return 'A-';
    if (grade >= 80) return 'B+';
    if (grade >= 75) return 'B';
    if (grade >= 70) return 'B-';
    if (grade >= 65) return 'C+';
    if (grade >= 60) return 'C';
    if (grade >= 55) return 'C-';
    if (grade >= 50) return 'D';
    return 'F';
  }
  private handleValidationErrors(): void {
    const nationalIdControl = this.studentForm.get('nationalId');
    const studentNameControl = this.studentForm.get('studentName');
    const levelControl = this.studentForm.get('level');
    if (nationalIdControl?.errors?.['pattern']) {
      this.validationMessage = 'National ID must contain only digits';
      return;
    }
    if (nationalIdControl?.errors?.['nationalIdTooShort']) {
      const error = nationalIdControl.errors['nationalIdTooShort'];
      this.validationMessage = `National ID must be at least 16 digits long. Current length: ${error.actualLength}`;
      return;
    }
    if (studentNameControl?.errors?.['minlength']) {
      this.validationMessage = 'Student name must be at least 2 characters long';
      return;
    }
    if (levelControl?.errors?.['max']) {
      this.validationMessage = 'Level must be between 1 and 3';
      return;
    }
    if (levelControl?.errors?.['min']) {
      this.validationMessage = 'Level must be at least 1';
      return;
    }
    this.validationMessage = 'Please fill in all required fields correctly';
  }
}
