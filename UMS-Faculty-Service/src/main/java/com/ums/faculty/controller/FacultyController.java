package com.ums.faculty.controller;

import com.ums.faculty.model.Faculty;
import com.ums.faculty.service.FacultyCourseService;
import com.ums.faculty.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    FacultyService facultyService;

    @Autowired
    FacultyCourseService facultyCourseService;

    @PostMapping
    public ResponseEntity<Faculty> addFaculty(@RequestBody Faculty faculty) {
        return new ResponseEntity<>(facultyService.save(faculty), HttpStatus.CREATED);
    }

    @GetMapping
    public List<Faculty> getAllFaculty() {
        return facultyService.getAll();
    }

    @GetMapping("/{id}")
    public Faculty getFacultyById(@PathVariable Integer id) {
        return facultyService.getById(id);
    }

    @PutMapping("/{id}")
    public Faculty updateFaculty(@PathVariable Integer id, @RequestBody Faculty updated) {
        return facultyService.update(id, updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFaculty(@PathVariable Integer id) {
        facultyService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{facultyId}/assign-course/{courseId}")
    public ResponseEntity<String> assignCourse(
            @PathVariable Integer facultyId,
            @PathVariable Integer courseId) {

        if (!facultyCourseService.exists(facultyId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faculty not found");
        }

        if (!facultyCourseService.validateCourseExists(courseId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }

        facultyCourseService.assignCourseToFaculty(facultyId, courseId);
        return ResponseEntity.ok("Course assigned to faculty");
    }

    @GetMapping("/{facultyId}/courses")
    public ResponseEntity<List<Integer>> getCourses(@PathVariable Integer facultyId) {
        return ResponseEntity.ok(facultyCourseService.getCourseIdsForFaculty(facultyId));
    }
}
