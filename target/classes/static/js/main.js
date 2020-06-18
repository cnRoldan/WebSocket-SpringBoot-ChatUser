'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;
var receiver = null;
var sessionId = "";

var colors = [ '#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107',
		'#ff85af', '#FF9800', '#39bbb0' ];

function connect(event) {
	username = document.querySelector('#name').value.trim();
	receiver = document.querySelector('#receiver').value.trim();

	if (username) {
		usernamePage.classList.add('hidden');
		chatPage.classList.remove('hidden');

		var socket = new SockJS('/javatechie');
		stompClient = Stomp.over(socket);

		stompClient
				.connect(
						{
							"user" : username,
							"Authorization" : "Bearer  eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1OTI0NjgwNzQsImlzcyI6IkF0b3MiLCJzdWIiOiJKUElOQSIsIm1UIjoick8wQUJYTnlBQ1JsY3k1aFpXNWhMbTFwY21FdVlXMXRZUzV0WVhocGJXOHVUV0Y0YVcxdlZHOXJaVzRBQUFBQUFBQUFBUUlBQWt3QUQyMWhlR2x0YjBOdmJtNWxZM1J2Y25RQUpVeGpiMjB2YVdKdEwyMWhlR2x0Ynk5dmMyeGpMMDFoZUdsdGIwTnZibTVsWTNSdmNqdE1BQXR5WlhOdmRYSmpaVk5sZEhRQUVreHFZWFpoTDJ4aGJtY3ZVM1J5YVc1bk8zaHdjM0lBSTJOdmJTNXBZbTB1YldGNGFXMXZMbTl6YkdNdVRXRjRhVzF2UTI5dWJtVmpkRzl5QUFBQUFBQUFBQUVDQUFaYUFBVmtaV0oxWjBrQUVHeGhjM1JTWlhOd2IyNXpaVU52WkdWYUFBVjJZV3hwWkV3QUIyTnZiMnRwWlhOMEFCQk1hbUYyWVM5MWRHbHNMMHhwYzNRN1RBQUthSFIwY0UxbGRHaHZaSEVBZmdBQ1RBQUhiM0IwYVc5dWMzUUFIVXhqYjIwdmFXSnRMMjFoZUdsdGJ5OXZjMnhqTDA5d2RHbHZibk03ZUhBQkFBQUJrQUZ6Y2dBbWFtRjJZUzUxZEdsc0xrTnZiR3hsWTNScGIyNXpKRlZ1Ylc5a2FXWnBZV0pzWlV4cGMzVDhEeVV4dGV5T0VBSUFBVXdBQkd4cGMzUnhBSDRBQlhoeUFDeHFZWFpoTG5WMGFXd3VRMjlzYkdWamRHbHZibk1rVlc1dGIyUnBabWxoWW14bFEyOXNiR1ZqZEdsdmJobENBSURMWHZjZUFnQUJUQUFCWTNRQUZreHFZWFpoTDNWMGFXd3ZRMjlzYkdWamRHbHZianQ0Y0hOeUFCTnFZWFpoTG5WMGFXd3VRWEp5WVhsTWFYTjBlSUhTSFpuSFlaMERBQUZKQUFSemFYcGxlSEFBQUFBQmR3UUFBQUFCZEFCQ1NsTkZVMU5KVDA1SlJEMHdNREF3Y0dKUFF6bEphVTQ1UVhkblRYUktSMTlYT1hsVldISTZNV1J3ZGpaaVlUQjFPeUJRWVhSb1BTODdJRWgwZEhCUGJteDVlSEVBZmdBTmRBQURSMFZVYzNJQUcyTnZiUzVwWW0wdWJXRjRhVzF2TG05emJHTXVUM0IwYVc5dWN3QUFBQUFBQUFBQkFnQU5XZ0FFYkdWaGJsb0FBbTEwV2dBRGMzTnNUQUFLWVhCcFEyOXVkR1Y0ZEhFQWZnQUNUQUFLWVhCd1EyOXVkR1Y0ZEhFQWZnQUNUQUFHWVhCd1ZWSkpjUUIrQUFKTUFBaGhkWFJvVFc5a1pYRUFmZ0FDVEFBRWFHOXpkSEVBZmdBQ1RBQUljR0Z6YzNkdmNtUnhBSDRBQWt3QUJIQnZjblIwQUJOTWFtRjJZUzlzWVc1bkwwbHVkR1ZuWlhJN1RBQUpjSFZpYkdsalZWSkpjUUIrQUFKTUFBcDBaVzVoYm5SamIyUmxjUUIrQUFKTUFBUjFjMlZ5Y1FCK0FBSjRjQUVBQUhRQUJHOXpiR04wQUFadFlYaHBiVzkwQUR0b2RIUndPaTh2YzJOa2JIZGhjekF3TURFdWMzTmpZeTVoWlM1aFpXNWhMbVZ6T2prd09EQXZiV0Y0YVcxdkwyOXpiR00vSm14bFlXNDlNWFFBQjIxaGVHRjFkR2gwQUJ0elkyUnNkMkZ6TURBd01TNXpjMk5qTG1GbExtRmxibUV1WlhOMEFBbEJaVzVoTVRJek5EVnpjZ0FSYW1GMllTNXNZVzVuTGtsdWRHVm5aWElTNHFDazk0R0hPQUlBQVVrQUJYWmhiSFZsZUhJQUVHcGhkbUV1YkdGdVp5NU9kVzFpWlhLR3JKVWRDNVRnaXdJQUFIaHdBQUFqZUhRQU0yaDBkSEE2THk5elkyUnNkMkZ6TURBd01TNXpjMk5qTG1GbExtRmxibUV1WlhNNk9UQTRNQzl0WVhocGJXOHZiM05zWTNRQUFqQXdkQUFGU2xCSlRrRnciLCJleHAiOjE1OTMzMzIwNzR9.JoTzonM3H-y1OHvHrZI_P7bkdkEdaT9XVUH8u1gr1-rQCo0xbH557qQDytTWrkl0bN9cElYdIafhmhsZjwRx0Q"
						}, onConnected, onError);
	}
	event.preventDefault();
}

function onConnected() {
	// Get sessionId
	// var url = stompClient.ws._transport.url;
	// url = url.replace(
	// "ws://localhost:8080/spring-security-mvc-socket/secured/room/", "");
	// url = url.replace("/websocket", "");
	// url = url.replace(/^[0-9]+\//, "");
	// console.log("Your current session is: " + url);
	// sessionId = url;

	stompClient.subscribe('/user/queue/reply', onMessageReceived)

	// Tell your username to the server
	stompClient.send("/app/chat.register", {}, JSON.stringify({
		sender : username,
		type : 'JOIN'
	}))

	connectingElement.classList.add('hidden');

}

function onError(error) {
	connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
	connectingElement.style.color = 'red';
}

function send(event) {
	var messageContent = messageInput.value.trim();

	if (messageContent && stompClient) {
		var chatMessage = {
			sender : username,
			content : messageInput.value,
			type : 'CHAT',
			receiver : receiver
		};

		stompClient.send("/app/saludar", {}, JSON.stringify(chatMessage));
		messageInput.value = '';
	}
	event.preventDefault();
}

function onMessageReceived(payload) {
	console.log('Mensaje recibido!: ' + payload.body);
	var message = JSON.parse(payload.body);

	var messageElement = document.createElement('li');

	if (message.type === 'JOIN') {
		messageElement.classList.add('event-message');
		message.content = message.sender + ' joined!';
	} else if (message.type === 'LEAVE') {
		messageElement.classList.add('event-message');
		message.content = message.sender + ' left!';
	} else {
		messageElement.classList.add('chat-message');

		var avatarElement = document.createElement('i');
		var avatarText = document.createTextNode(message.sender[0]);
		avatarElement.appendChild(avatarText);
		avatarElement.style['background-color'] = getAvatarColor(message.sender);

		messageElement.appendChild(avatarElement);

		var usernameElement = document.createElement('span');
		var usernameText = document.createTextNode(message.sender);
		usernameElement.appendChild(usernameText);
		messageElement.appendChild(usernameElement);
	}

	var textElement = document.createElement('p');
	var messageText = document.createTextNode(message.content);
	textElement.appendChild(messageText);

	messageElement.appendChild(textElement);

	messageArea.appendChild(messageElement);
	messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
	var hash = 0;
	for (var i = 0; i < messageSender.length; i++) {
		hash = 31 * hash + messageSender.charCodeAt(i);
	}

	var index = Math.abs(hash % colors.length);
	return colors[index];
}

usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', send, true)
