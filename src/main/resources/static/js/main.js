'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var subscription = null;
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

	subscription = stompClient.subscribe('/user/queue/reply', onMessageReceived, {ack:'client'});
	
//	var subscription = client.subscribe("/queue/test",
//    function(message) {
//      // do something with the message
//      ...
//      // and acknowledge it
//      message.ack();
//    },
//    {ack: 'client'}
//  ); 

	// Tell your username to the server
	stompClient.send("/app/chat.register", {}, JSON.stringify({
		sender : username,
		type : 'JOIN'
	}));

	connectingElement.classList.add('hidden');

}

function onError(error) {
	connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
	connectingElement.style.color = 'red';
}

function send(event) {
	var messageContent = messageInput.value.trim();

	if (messageContent && stompClient) {
		//Esto lo enviaría AMMA.
		var chatMessage = {
			sender : username,
			content : messageInput.value,
			type : 'CHAT',
			receiver : receiver
		};

		//Replicar esta misma línea dentro de un endpoint HTTP.
		stompClient.send("/app/saludar", {}, JSON.stringify(chatMessage));
		messageInput.value = '';
	}
	event.preventDefault();
}

function onMessageReceived(payload) {
	console.log('Mensaje recibido!: ' + payload.body);
	var message = JSON.parse(payload.body);
	
	
	stompClient.ack("WFWFWG", subscription, {"user":username});
	
	
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
