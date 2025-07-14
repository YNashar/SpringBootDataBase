import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { EnrollmentsComponent } from './enrollments/enrollments.component';
import { CoursesComponent } from './courses/courses.component';
import { FacultiesComponent } from './faculties/faculties.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    EnrollmentsComponent,
    CoursesComponent,
    FacultiesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
