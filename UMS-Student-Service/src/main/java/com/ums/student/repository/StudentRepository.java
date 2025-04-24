package com.ums.student.repository;

import com.ums.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> { }
