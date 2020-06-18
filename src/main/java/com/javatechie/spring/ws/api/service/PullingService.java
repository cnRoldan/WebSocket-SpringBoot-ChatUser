package com.javatechie.spring.ws.api.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.javatechie.spring.ws.api.model.ChatMessage;
import com.javatechie.spring.ws.api.model.ChatMessage.MessageType;

import lombok.Data;

@Data
@Service
public class PullingService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private static final String WS_MESSAGE_TRANSFER_DESTINATION = "/topic/public";
    private List<String> userNames = new ArrayList<>();
    
    PullingService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void sendMessages() {
    	ChatMessage gr = new ChatMessage();
    	gr.setSender("Claudio");
    	gr.setContent("Obteniendo notificaciones de db");
    	gr.setType(MessageType.CHAT);
    	Gson g = new Gson();
    	String r = g.toJson(gr);
        simpMessagingTemplate.convertAndSend(WS_MESSAGE_TRANSFER_DESTINATION,
            r);
    }
    
    public void addUserName(String username) {
        userNames.add(username);
    }
}
