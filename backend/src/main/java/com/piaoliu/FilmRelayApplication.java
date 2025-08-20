package com.piaoliu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FilmRelayApplication {

    public static void main(String[] args) {
        SpringApplication.run(FilmRelayApplication.class, args);
    }
}