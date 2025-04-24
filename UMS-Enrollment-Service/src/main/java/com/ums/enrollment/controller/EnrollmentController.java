package com.ums.enrollment.controller;

import com.ums.enrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollment")
public class EnrollmentController {

    @Autowired
    EnrollmentService enrollmentService;

    @PostMapping("/{studentId}/course/{courseId}")
    public ResponseEntity<String> enroll(
            @PathVariable Integer studentId,
            @PathVariable Integer courseId) {

        if (!enrollmentService.studentExists(studentId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }

        if (!enrollmentService.courseExists(courseId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }

        String result = enrollmentService.enroll(studentId, courseId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Integer>> getCourses(@PathVariable Integer studentId) {
        return ResponseEntity.ok(enrollmentService.getCoursesForStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Integer>> getStudents(@PathVariable Integer courseId) {
        return ResponseEntity.ok(enrollmentService.getStudentsForCourse(courseId));
    }
}
