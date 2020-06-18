package com.javatechie.spring.ws.api.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.javatechie.spring.ws.api.model.ChatMessage;

@Controller
public class ChatController {

	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;

	@MessageMapping("/chat.register")
	@SendTo("/topic/public")
	public ChatMessage register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
		headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
		return chatMessage;
	}


	@MessageMapping("/saludar")
	public void sendSpecific(Principal principal , @Payload ChatMessage msg, @Header("simpSessionId") String sessionId)
			throws Exception {
		//Utilizar esta linea para enviar desde un RESTCONTROLLER.
		simpMessagingTemplate.convertAndSendToUser(msg.getReceiver(), "/queue/reply",
				msg);
	}

}
