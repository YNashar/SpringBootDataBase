package com.egabi;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<student> getStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(StudentController.NewStudentRequest request) {
        student student = new student();
        student.setStudentName(request.studentName());
        student.setFacultyId(request.facultyId());
        student.setLevel(request.level());
        student.setNationalId(request.nationalId());

        if (student.getNationalId() != null && student.getNationalId().length() > 16) {
            throw new IllegalArgumentException("National ID must not exceed 16 characters");
        }

        studentRepository.save(student);
    }

    public void deleteStudent(Integer id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student with id " + id + " does not exist");
        }
        studentRepository.deleteById(id);
    }

    public void updateStudent(Integer id, StudentController.NewStudentRequest request) {
        student existing = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        existing.setStudentName(request.studentName());
        existing.setFacultyId(request.facultyId());
        existing.setLevel(request.level());
        existing.setNationalId(request.nationalId());

        studentRepository.save(existing);
    }
}
