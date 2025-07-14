import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseFacultyLevel, CourseFacultyLevelWithDetails } from '../models/course-faculty-level.model';

@Injectable({
  providedIn: 'root'
})
export class CourseFacultyLevelService {
  private apiUrl = 'http://localhost:8080/api/v1/course-faculty-level';

  constructor(private http: HttpClient) {}

  getAllCourseFacultyLevels(): Observable<CourseFacultyLevel[]> {
    return this.http.get<CourseFacultyLevel[]>(this.apiUrl);
  }

  getCourseFacultyLevelById(id: number): Observable<CourseFacultyLevel> {
    return this.http.get<CourseFacultyLevel>(`${this.apiUrl}/${id}`);
  }

  createCourseFacultyLevel(courseFacultyLevel: CourseFacultyLevel): Observable<CourseFacultyLevel> {
    return this.http.post<CourseFacultyLevel>(this.apiUrl, courseFacultyLevel);
  }

  updateCourseFacultyLevel(id: number, courseFacultyLevel: CourseFacultyLevel): Observable<CourseFacultyLevel> {
    return this.http.put<CourseFacultyLevel>(`${this.apiUrl}/${id}`, courseFacultyLevel);
  }

  deleteCourseFacultyLevel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByFacultyAndLevel(facultyId: number, level: number): Observable<CourseFacultyLevel[]> {
    return this.http.get<CourseFacultyLevel[]>(`${this.apiUrl}/faculty/${facultyId}/level/${level}`);
  }

  getByCourseId(courseId: number): Observable<CourseFacultyLevel[]> {
    return this.http.get<CourseFacultyLevel[]>(`${this.apiUrl}/course/${courseId}`);
  }

  getByFacultyId(facultyId: number): Observable<CourseFacultyLevel[]> {
    return this.http.get<CourseFacultyLevel[]>(`${this.apiUrl}/faculty/${facultyId}`);
  }

  getByLevel(level: number): Observable<CourseFacultyLevel[]> {
    return this.http.get<CourseFacultyLevel[]>(`${this.apiUrl}/level/${level}`);
  }

  // Get with details (course name and faculty name)
  getCourseFacultyLevelsWithDetails(): Observable<CourseFacultyLevelWithDetails[]> {
    return this.http.get<CourseFacultyLevelWithDetails[]>(`${this.apiUrl}/with-details`);
  }
} 