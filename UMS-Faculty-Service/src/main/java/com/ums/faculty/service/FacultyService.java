package com.ums.faculty.service;

import com.ums.faculty.model.Faculty;
import com.ums.faculty.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    @Autowired
    FacultyRepository repository;

    public Faculty save(Faculty faculty) {
        return repository.save(faculty);
    }

    public List<Faculty> getAll() {
        return repository.findAll();
    }

    public Faculty getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
    }

    public Faculty update(Integer id, Faculty updated) {
        Faculty faculty = getById(id);
        faculty.setName(updated.getName());
        faculty.setEmail(updated.getEmail());
        faculty.setDepartment(updated.getDepartment());
        faculty.setDesignation(updated.getDesignation());
        return repository.save(faculty);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
