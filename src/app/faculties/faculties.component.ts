import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseFacultyLevelService } from '../services/course-faculty-level.service';
import { CourseService, Course } from '../services/course.service';
import { FacultyService } from '../services/faculty.service';
import { CourseFacultyLevel, CourseFacultyLevelWithDetails } from '../models/course-faculty-level.model';
import { Faculty } from '../models/faculty.model';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css']
})
export class FacultiesComponent implements OnInit {
  courseFacultyLevels: CourseFacultyLevelWithDetails[] = [];
  courses: Course[] = [];
  faculties: Faculty[] = [];
  levels: number[] = [1, 2, 3, 4];
  
  courseFacultyLevelForm: FormGroup;
  editingItem: CourseFacultyLevel | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  selectedFacultyId: number = 0;
  selectedLevel: number = 1;
  filteredCourses: Course[] = [];

  constructor(
    private courseFacultyLevelService: CourseFacultyLevelService,
    private courseService: CourseService,
    private facultyService: FacultyService,
    private fb: FormBuilder
  ) {
    this.courseFacultyLevelForm = this.fb.group({
      courseId: [0, [Validators.required, Validators.min(1)]],
      facultyId: [0, [Validators.required, Validators.min(1)]],
      level: [1, [Validators.required, Validators.min(1), Validators.max(4)]]
    });
  }

  ngOnInit(): void {
    this.loadCourseFacultyLevels();
    this.loadCourses();
    this.loadFaculties();
    this.filteredCourses = [];
  }

  loadCourseFacultyLevels(): void {
    this.courseFacultyLevelService.getCourseFacultyLevelsWithDetails().subscribe({
      next: (data) => {
        this.courseFacultyLevels = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load course-faculty-level relationships.';
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filterCourses();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load courses.';
      }
    });
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => {
        this.faculties = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load faculties.';
      }
    });
  }

  getCourseName(courseId: number): string {
    const course = this.courses.find(c => c.course_id === courseId);
    return course ? course.course_name : 'Unknown Course';
  }

  getFacultyName(facultyId: number): string {
    const faculty = this.faculties.find(f => f.facultyId === facultyId);
    return faculty ? faculty.facultyName : 'Unknown Faculty';
  }

  onSubmit(): void {
    if (this.courseFacultyLevelForm.valid) {
      const formData = this.courseFacultyLevelForm.value;
      
      if (this.editingItem) {
        // Update existing item
        this.courseFacultyLevelService.updateCourseFacultyLevel(this.editingItem.id!, formData).subscribe({
          next: () => {
            this.successMessage = 'Course-Faculty-Level relationship updated successfully!';
            this.loadCourseFacultyLevels();
            this.resetForm();
          },
          error: (err) => {
            this.errorMessage = 'Failed to update relationship.';
          }
        });
      } else {
        // Create new item
        this.courseFacultyLevelService.createCourseFacultyLevel(formData).subscribe({
          next: () => {
            this.successMessage = 'Course-Faculty-Level relationship created successfully!';
            this.loadCourseFacultyLevels();
            this.resetForm();
          },
          error: (err) => {
            this.errorMessage = 'Failed to create relationship.';
          }
        });
      }
    }
  }

  editItem(item: CourseFacultyLevelWithDetails): void {
    this.editingItem = {
      id: item.id,
      courseId: item.courseId,
      facultyId: item.facultyId,
      level: item.level
    };
    this.courseFacultyLevelForm.patchValue({
      courseId: item.courseId,
      facultyId: item.facultyId,
      level: item.level
    });
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this relationship?')) {
      this.courseFacultyLevelService.deleteCourseFacultyLevel(id).subscribe({
        next: () => {
          this.successMessage = 'Relationship deleted successfully!';
          this.loadCourseFacultyLevels();
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete relationship.';
        }
      });
    }
  }

  resetForm(): void {
    this.courseFacultyLevelForm.reset({
      courseId: 0,
      facultyId: 0,
      level: 1
    });
    this.editingItem = null;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onFacultyOrLevelChange(): void {
    this.selectedFacultyId = this.courseFacultyLevelForm.get('facultyId')?.value;
    this.selectedLevel = this.courseFacultyLevelForm.get('level')?.value;
    this.filterCourses();
  }

  filterCourses(): void {
    if (this.selectedFacultyId > 0 && this.selectedLevel > 0) {
      this.courseFacultyLevelService.getByFacultyAndLevel(this.selectedFacultyId, this.selectedLevel)
        .subscribe({
          next: (links) => {
            const allowedCourseIds = links.map((link: any) => link.courseId);
            console.log('All courses:', this.courses);
            console.log('Allowed course IDs:', allowedCourseIds);
            console.log('Filtered courses:', this.filteredCourses);
            this.filteredCourses = this.courses.filter(course => allowedCourseIds.includes(course.course_id));
          },
          error: () => {
            this.filteredCourses = [];
          }
        });
    } else {
      this.filteredCourses = [];
    }
  }
} 