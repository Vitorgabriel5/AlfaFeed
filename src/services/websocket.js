import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export const connectWebSocket = (onConnected) => {

  const socket = new SockJS('http://localhost:8080/ws');

  stompClient = Stomp.over(socket);

  const token = localStorage.getItem('token');

  stompClient.connect(
    {
      Authorization: `Bearer ${token}`
    },
    () => {
      console.log('WebSocket conectado');
      onConnected(stompClient);
    },
    (error) => {
      console.error(error);
    }
  );
};

export const getStompClient = () => stompClient;