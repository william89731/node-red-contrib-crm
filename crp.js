module.exports = function (RED) {
	try {
		function crp(config) {
			RED.nodes.createNode(this, config);
			let node = this;
			node.on('input', function (msg) {
				let node = this;
				let max_msg = msg.hasOwnProperty("max_msg") ? msg.max_count : config.max_msg;
				let autoreset = msg.hasOwnProperty("autoreset") ? msg.autoreset : config.autoreset;
				let nodeContext = this.context();
				let count = nodeContext.get('count') || 0;
				let timeout = msg.hasOwnProperty("timeout") ? msg.timeout : config.timeout;
				let max_timeout = msg.hasOwnProperty("max_timeout") ? msg.max_timeout : config.max_timeout;

				if (timeout === true) {
					setTimeout(() => {
						nodeContext.set('count', 0);
					}, max_timeout);
				}
				else if (timeout === false) {
					clearTimeout(() => {
						nodeContext.set('count', count);
					}, max_timeout);
				}
				if (msg.payload === "STOP" || msg.payload === "stop") {

					node.status({ fill: "red", shape: "dot", text: count });
					this.send([null, null]);

				}
				else if (msg.payload === "RESET" || msg.payload === "reset") {
					nodeContext.set('count', 0);
					count = 0;
					msg = null;
					node.status({ fill: "yellow", shape: "dot", text: count });
					this.send([null, null]);
				}
				else if (timeout === 0) {


					clearTimeout;
				}
				else {
					count = count + 1;

					let newMsg = { payload: count };
					node.status({ fill: "green", shape: "dot", text: count });
					nodeContext.set('count', count);
					if (count >= max_msg) {
						msg.count = count;
						this.send([msg, newMsg]);
						if (autoreset === true) {
							nodeContext.set('count', 0);
							count = 0;
							msg = null;
							node.status({ fill: "red", shape: "dot", text: count });
						}

					}
					else {
						this.send([null, null]);
					}
				}
			});
		}
		RED.nodes.registerType("crp", crp);
	}
	catch

	{
		console.error("STI GRAN CAXXI");
	}
	
}

