import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty } from '../models/faculty.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = '/api/v1/faculties';

  constructor(private http: HttpClient) { }

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.apiUrl);
  }

  addFaculty(faculty: Omit<Faculty, 'facultyId'>): Observable<Faculty> {
    return this.http.post<Faculty>(this.apiUrl, faculty);
  }

  updateFaculty(faculty: Faculty): Observable<Faculty> {
    return this.http.put<Faculty>(`${this.apiUrl}/${faculty.facultyId}`, faculty);
  }

  deleteFaculty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
