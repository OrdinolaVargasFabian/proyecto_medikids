package com.medikids.medikids;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class BackendMedikidsApplication {

    private static final String TIMEZONE_PERU = "America/Lima";

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone(TIMEZONE_PERU));
        SpringApplication.run(BackendMedikidsApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(TIMEZONE_PERU));
    }

}
