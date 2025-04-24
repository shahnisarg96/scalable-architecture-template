package com.ums.enrollment.service;

import com.ums.enrollment.constants.EndpointConstants;
import com.ums.enrollment.model.Enrollment;
import com.ums.enrollment.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Service
public class EnrollmentService {

    @Autowired
    EnrollmentRepository enrollmentRepository;

    @Autowired
    RestTemplate restTemplate;

    public boolean studentExists(Integer studentId) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(EndpointConstants.GET_STUDENT_ENDPOINT + studentId, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean courseExists(Integer courseId) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(EndpointConstants.GET_COURSE_ENDPOINT + courseId, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    public String enroll(Integer studentId, Integer courseId) {
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return "Student already enrolled in this course";
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setCourseId(courseId);
        enrollment.setEnrollmentDate(LocalDate.now());

        enrollmentRepository.save(enrollment);

        return "Enrollment successful";
    }

    public List<Integer> getCoursesForStudent(Integer studentId) {
        return enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(Enrollment::getCourseId)
                .toList();
    }

    public List<Integer> getStudentsForCourse(Integer courseId) {
        return enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(Enrollment::getStudentId)
                .toList();
    }
}
