import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enrollment {
  enrollment_id: number;
  student_id: number;
  course_id: number;
  enrollment_date: string; // ISO string
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = '/api/enrollments';

  constructor(private http: HttpClient) { }

  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl);
  }

  addEnrollment(enrollment: Omit<Enrollment, 'enrollment_id'>): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.apiUrl, enrollment);
  }

  updateEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/${enrollment.enrollment_id}`, enrollment);
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
