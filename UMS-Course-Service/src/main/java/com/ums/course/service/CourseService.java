package com.ums.course.service;

import com.ums.course.model.Course;
import com.ums.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    CourseRepository repository;

    public Course save(Course course) {
        return repository.save(course);
    }

    public List<Course> getAll() {
        return repository.findAll();
    }

    public Optional<Course> getById(Integer id) {
        return repository.findById(id);
    }

    public Optional<Course> update(Integer id, Course updated) {
        return repository.findById(id).map(c -> {
            c.setName(updated.getName());
            c.setCode(updated.getCode());
            c.setDepartment(updated.getDepartment());
            c.setSemester(updated.getSemester());
            c.setCredits(updated.getCredits());

            return repository.save(c);
        });
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
