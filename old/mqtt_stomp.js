function mqtt_stomp(mq_addr, mq_id, mq_passcode, topic, onSubscribe, flow_ctrl_btn) {
	//var sock = new SockJS(mq_addr);
	var stompClient = Stomp.client(mq_addr);//Stomp.over(sock);
	var subscription = null;
	
	var on_connect = function() {
		subscription = stompClient.subscribe(topic, onSubscribe);
	};
	var on_error =  function() {
	};
	
	stompClient.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
	stompClient.heartbeat.incoming = 0;
	
	stompClient.connect(mq_id, mq_passcode, on_connect, on_error, '/');
	
	this.send = function(msg) {
		stompClient.send(topic, {}, msg);
	};
	
	this.subscribe = function() {
		subscription = stompClient.subscribe(topic, onSubscribe);
	};
	
	this.isSubscribe = function() {
		if(subscription == null) {
			return false;
		}
		else {
			return true;
		}
	};

	this.unsubscribe = function() {
		subscription.unsubscribe();
		subscription = null;
	};
	
	this.disconnect = function() {
	    if (stompClient != null) {
	        stompClient.disconnect(null, null);
	    }
	};
}

module.exports.MqttStomp = mqtt_stomp;