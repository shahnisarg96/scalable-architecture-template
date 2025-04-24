package com.ums.student.service;

import com.ums.student.model.Student;
import com.ums.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    StudentRepository repository;

    public Student create(Student student) {
        return repository.save(student);
    }

    public List<Student> getAll() {
        return repository.findAll();
    }

    public Optional<Student> getById(int id) {
        return repository.findById(id);
    }

    public Optional<Student> update(int id, Student updated) {
        return repository.findById(id).map(s -> {
            s.setName(updated.getName());
            s.setEmail(updated.getEmail());
            s.setDepartment(updated.getDepartment());
            s.setYear(updated.getYear());
            return repository.save(s);
        });
    }

    public void delete(int id) {
        repository.deleteById(id);
    }
}
