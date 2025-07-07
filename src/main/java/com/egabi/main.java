package com.egabi;

import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/v1/students")
class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<student> getStudents() {
        return studentRepository.findAll();
    }

    record NewStudentRequest(String studentName, Integer facultyId, Integer level, String nationalId) {}

    @PostMapping
    public void addStudent(@RequestBody NewStudentRequest request) {
        student student = new student();
        student.setStudentName(request.studentName());
        student.setFacultyId(request.facultyId());
        student.setLevel(request.level());
        student.setNationalId(request.nationalId());

        studentRepository.save(student);
    }

    @DeleteMapping("{studentId}")
    public void deleteStudent(@PathVariable("studentId") Integer id) {
        studentRepository.deleteById(id);
    }

    @PutMapping("{studentId}")
    public void updateStudent(
            @PathVariable("studentId") Integer id,
            @RequestBody NewStudentRequest request
    ) {
        student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        student.setStudentName(request.studentName());
        student.setFacultyId(request.facultyId());
        student.setLevel(request.level());
        student.setNationalId(request.nationalId());

        studentRepository.save(student);
    }
}
