package com.murilossx.myworkout;

import com.murilossx.myworkout.model.Exercicio;
import com.murilossx.myworkout.repository.ExercicioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MyworkoutApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyworkoutApplication.class, args);
	}

}