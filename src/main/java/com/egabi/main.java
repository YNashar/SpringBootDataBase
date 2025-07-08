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
        studentService.addStudent(request);
    }

    @DeleteMapping("{studentId}")
    public void deleteStudent(@PathVariable("studentId") Integer id) {
        studentService.deleteStudent(id);
    }

    @PutMapping("{studentId}")
    public void updateStudent(
            @PathVariable("studentId") Integer id,
            @RequestBody NewStudentRequest request
    ) {
        studentService.updateStudent(id, request);
    }
}
