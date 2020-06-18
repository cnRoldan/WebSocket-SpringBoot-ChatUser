package com.javatechie.spring.ws.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // this annotation enables scheduling
public class SpringBootWebsocketApplication extends SpringBootServletInitializer   {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootWebsocketApplication.class, args);
	}

}

