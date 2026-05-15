import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class WebSocketService {

    client = null;

    connect(onConnected) {

        const socket = new SockJS("http://localhost:8080/ws");

        this.client = new Client({

            webSocketFactory: () => socket,

            reconnectDelay: 5000,

            onConnect: () => {
                console.log("Conectado websocket");
                onConnected();
            },

            onStompError: (frame) => {
                console.error("Erro STOMP:", frame);
            },

            onWebSocketError: (error) => {
                console.error("Erro websocket:", error);
            }
        });

        this.client.activate();
    }

    subscribe(destination, callback) {

        this.client.subscribe(destination, callback);
    }

    send(destination, body) {

        this.client.publish({
            destination,
            body: JSON.stringify(body)
        });
    }
}

export default new WebSocketService();