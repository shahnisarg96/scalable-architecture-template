package com.ums.course;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public class DBConnectionChecker {

    @Autowired
    DataSource dataSource;

    @PostConstruct
    public void checkDBConnection() {
        try (Connection conn = dataSource.getConnection()) {
            System.out.println("DB connected successfully: " + conn.getMetaData().getURL());
        } catch (SQLException e) {
            System.err.println("Failed to connect to DB: " + e.getMessage());
        }
    }
}
