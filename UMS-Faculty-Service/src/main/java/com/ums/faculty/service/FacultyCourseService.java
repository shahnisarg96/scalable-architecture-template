package com.ums.faculty.service;

import com.ums.faculty.constants.EndpointConstants;
import com.ums.faculty.model.Faculty;
import com.ums.faculty.model.FacultyCourse;
import com.ums.faculty.repository.FacultyCourseRepository;
import com.ums.faculty.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class FacultyCourseService {

    @Autowired
    FacultyCourseRepository facultyCourseRepository;

    @Autowired
    FacultyRepository facultyRepository;

    @Autowired
    RestTemplate restTemplate;

    public boolean validateCourseExists(Integer courseId) {
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                    EndpointConstants.GET_COURSE_ENDPOINT + courseId, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    public void assignCourseToFaculty(Integer facultyId, Integer courseId) {
        FacultyCourse mapping = new FacultyCourse();

        mapping.setFacultyId(facultyId);
        mapping.setCourseId(courseId);

        facultyCourseRepository.save(mapping);
    }

    public List<Integer> getCourseIdsForFaculty(Integer facultyId) {
        return facultyCourseRepository.findByFacultyId(facultyId)
                .stream()
                .map(FacultyCourse::getCourseId)
                .toList();
    }

    public boolean exists(Integer facultyId) {
        return facultyRepository.existsById(facultyId);
    }
}
