package com.egabi;

import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/v1/students")
class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public List<student> getStudents() {
        return studentService.getStudents();
    }

    record NewStudentRequest(String studentName, Integer facultyId, Integer level, String nationalId) {}

    @PostMapping
    public void addStudent(@RequestBody NewStudentRequest request) {
        student s = new student();
        s.setStudentName(request.studentName());
        s.setFacultyId(request.facultyId());
        s.setLevel(request.level());
        s.setNationalId(request.nationalId());
        studentService.addStudent(s);
    }

    @DeleteMapping("{studentId}")
    public void deleteStudent(@PathVariable("studentId") Integer id) {
        studentService.deleteStudent(id);
    }

    @PutMapping("{studentId}")
    public void updateStudent(@PathVariable("studentId") Integer id,
                              @RequestBody NewStudentRequest request) {
        student updated = new student();
        updated.setStudentName(request.studentName());
        updated.setFacultyId(request.facultyId());
        updated.setLevel(request.level());
        updated.setNationalId(request.nationalId());
        studentService.updateStudent(id, updated);
    }
}
