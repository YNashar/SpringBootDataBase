import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Grade {
  grade_id: number;
  student_id: number;
  course_id: number;
  grade: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = '/api/grades';

  constructor(private http: HttpClient) { }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }

  addGrade(grade: Omit<Grade, 'grade_id'>): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, grade);
  }

  updateGrade(grade: Grade): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${grade.grade_id}`, grade);
  }

  deleteGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
