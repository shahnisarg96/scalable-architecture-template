package com.ums.faculty.repository;

import com.ums.faculty.model.FacultyCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacultyCourseRepository extends JpaRepository<FacultyCourse, Integer> {
    List<FacultyCourse> findByFacultyId(Integer facultyId);
}
