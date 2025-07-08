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

    public void addStudent(student student) {
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

    public void updateStudent(Integer id, student updated) {
        student existing = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        existing.setStudentName(updated.getStudentName());
        existing.setFacultyId(updated.getFacultyId());
        existing.setLevel(updated.getLevel());
        existing.setNationalId(updated.getNationalId());

        studentRepository.save(existing);
    }
}
