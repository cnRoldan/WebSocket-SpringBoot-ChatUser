package com.javatechie.spring.ws.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.javatechie.spring.ws.api.model.ChatMessage;

@RestController
@RequestMapping("/http")
public class HttpController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	
	@PostMapping("/send")
	public ResponseEntity<?>  enviar(@RequestBody ChatMessage chatMessage){
		simpMessagingTemplate.convertAndSendToUser(chatMessage.getReceiver(), "/queue/reply",
				chatMessage);
		return new ResponseEntity<String> (HttpStatus.OK);
	}

	@GetMapping("/test")
	public ResponseEntity<?>  test(){
		return new ResponseEntity<String> (HttpStatus.OK);
	}
}
