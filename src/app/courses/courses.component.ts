import { Component, OnInit } from '@angular/core';
import { CourseService, Course } from '../services/course.service';
import { FacultyService } from '../services/faculty.service';
import { Faculty } from '../models/faculty.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  faculties: Faculty[] = [];
  courseForm: FormGroup;
  editingCourse: Course | null = null;
  errorMessage = '';

  constructor(
    private courseService: CourseService,
    private facultyService: FacultyService,
    private fb: FormBuilder
  ) {
    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      faculty_id: [null, Validators.required],
      level: [1, [Validators.required, Validators.min(1), Validators.max(6)]]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadFaculties();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: courses => this.courses = courses,
      error: err => this.errorMessage = 'Failed to load courses.'
    });
  }

  loadFaculties() {
    this.facultyService.getFaculties().subscribe({
      next: faculties => this.faculties = faculties,
      error: err => this.errorMessage = 'Failed to load faculties.'
    });
  }

  startEdit(course: Course) {
    this.editingCourse = course;
    this.courseForm.setValue({
      course_name: course.course_name,
      faculty_id: course.faculty_id,
      level: course.level
    });
  }

  cancelEdit() {
    this.editingCourse = null;
    this.courseForm.reset({ level: 1 });
  }

  submit() {
    if (this.courseForm.invalid) return;
    const courseData = this.courseForm.value;
    if (this.editingCourse) {
      const updated: Course = { ...this.editingCourse, ...courseData };
      this.courseService.updateCourse(updated).subscribe({
        next: () => {
          this.loadCourses();
          this.cancelEdit();
        },
        error: err => this.errorMessage = 'Failed to update course.'
      });
    } else {
      this.courseService.addCourse(courseData).subscribe({
        next: () => {
          this.loadCourses();
          this.courseForm.reset({ level: 1 });
        },
        error: err => this.errorMessage = 'Failed to add course.'
      });
    }
  }

  deleteCourse(course: Course) {
    if (!confirm(`Delete course "${course.course_name}"?`)) return;
    this.courseService.deleteCourse(course.course_id).subscribe({
      next: () => this.loadCourses(),
      error: err => this.errorMessage = 'Failed to delete course.'
    });
  }

  getFacultyName(faculty_id: number): string {
    const faculty = this.faculties.find(f => f.facultyId === faculty_id);
    return faculty ? faculty.facultyName : String(faculty_id);
  }
}
