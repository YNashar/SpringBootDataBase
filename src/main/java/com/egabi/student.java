package com.egabi;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId;

    private String studentName;
    private Integer facultyId;
    private Integer level;
    private String nationalId;

    public student() {
    }

    public student(Integer studentId, String studentName, Integer facultyId, Integer level, String nationalId) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.facultyId = facultyId;
        this.level = level;
        this.nationalId = nationalId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Integer getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(Integer facultyId) {
        this.facultyId = facultyId;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    @Override
    public String toString() {
        return "Student{" +
                "studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", facultyId=" + facultyId +
                ", level=" + level +
                ", nationalId='" + nationalId + '\'' +
                '}';
    }
}
