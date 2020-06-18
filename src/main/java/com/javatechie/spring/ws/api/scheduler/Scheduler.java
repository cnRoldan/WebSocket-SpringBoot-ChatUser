package com.javatechie.spring.ws.api.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.javatechie.spring.ws.api.service.PullingService;


@Component
public class Scheduler {
    private final PullingService pullingService;

    Scheduler(PullingService greetingService) {
        this.pullingService = greetingService;
    }

    @Scheduled(fixedRateString = "6000", initialDelayString = "0")
    public void schedulingTask() {
//    	System.out.println("Mandando evento...");
        pullingService.sendMessages();
    }
}