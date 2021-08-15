module.exports = function(RED) {
	try
	{
    function crp(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) 
		{
			var msg1 = { payload: "" };
			var node = this;
			var max_msg = msg.hasOwnProperty("max_msg")? msg.max_count : config.max_msg;
			var autoreset = msg.hasOwnProperty("autoreset")? msg.autoreset : config.autoreset;
            var nodeContext = this.context();
            var count=nodeContext.get('count') || 0;	
			
				
				
				if (msg.payload === "STOP" || msg.payload === "stop") 
				{                    
                  
                    node.status({fill:"red",shape:"dot",text:count});
                    this.send([ null , null ]);
					
                } 
				else if (msg.payload === "RESET" || msg.payload === "reset") 
				{
                    nodeContext.set('count',0);
                    count = 0;
                    msg = null;
                    node.status({fill:"yellow",shape:"dot",text:count});
                    this.send([ null , null ]);
                } 
				else 
				{
                    count = count+1;
										                      
                    var newMsg = {payload: count};
                    node.status({fill:"green",shape:"dot",text:count});
                    nodeContext.set('count',count);
					if (count >= max_msg)
					{ 
						msg.count = count;
						this.send([ msg , newMsg ]);
						if (autoreset === true)
						{
							nodeContext.set('count',0);
							count = 0;
							msg = null;
							node.status({fill:"red",shape:"dot",text:count});							
						}	
						
					}
					else
					{
						this.send([ null , null ]);
					}	
                }
					
        });
    }
    RED.nodes.registerType("crp",crp);
	}
	catch
	
	{
		console.error("STI GRAN CAXXI");
	}
}

