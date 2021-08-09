 
module.exports = function(RED) {
	try
	{
    function crm(config) {
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
			
				//this.send({payload: max_msg});
				
				if (msg.topic === "SET") 
				{                    
                    nodeContext.set('count', msg.count);
                    count = msg.count;
                    msg = null;
                    node.status({fill:"yellow",shape:"dot",text:count});
                    this.send([ null , null ]);
					
                } 
				else if (msg.topic === "RESET") 
				{
                    nodeContext.set('count',0);
                    count = 0;
                    msg = null;
                    node.status({fill:"red",shape:"dot",text:count});
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
    RED.nodes.registerType("crm",crm);
	}
	catch
	
	{
		console.error("STI GRAN CAZZI");
	}
}
