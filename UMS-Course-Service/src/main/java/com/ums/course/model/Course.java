package com.ums.course.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String code;
    private String department;
    private Integer credits;
    private String semester;

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public String getDepartment() {
        return department;
    }

    public Integer getCredits() {
        return credits;
    }

    public String getSemester() {
        return semester;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}
