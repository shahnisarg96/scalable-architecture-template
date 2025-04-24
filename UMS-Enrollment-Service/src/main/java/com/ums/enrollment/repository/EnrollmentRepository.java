package com.ums.enrollment.repository;

import com.ums.enrollment.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentIdAndCourseId(Integer studentId, Integer courseId);
    List<Enrollment> findByStudentId(Integer studentId);
    List<Enrollment> findByCourseId(Integer courseId);
}
