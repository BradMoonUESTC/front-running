require("ethereumjs-tx");
var options = {
    timeout: 30000,
    clientConfig: {
        maxReceivedFrameSize: 100000000,
        maxReceivedMessageSize: 100000000,
    },
    reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 15,
        onTimeout: false,
    },
};
const init = function () {
    const WebSocket = require('ws');
    const ws = new WebSocket('wss://eth-mainnet.g.alchemy.com/v2/OkB7GJHLYFWYFK5y2zhnwe2kDSa8kMCl');
    ws.onopen = function(e){
        console.log("连接服务器成功");
        // 向服务器发送消息
         ws.send("{\"jsonrpc\":\"2.0\",\"id\": 1, \"method\": \"eth_subscribe\", \"params\": [\"alchemy_filteredNewFullPendingTransactions\", {\"address\": \"0x1a0a589f19544cce54ec381d30180a24300f41cf\"}]}");
     }
    ws.onmessage = function(e){
        let message = eval("(" + e.data + ")")
        if(message.id!=1) {
            setTimeout(async () => {
                try {
                    let tx = message.params.result
                    console.log(tx.input.substring(0,10))

                    if(tx.input.substring(0,10)=="0x5276837c"&&tx.from=="0x7b931342a2f827bc820a77220fb1cb673b6398c4"){
                        console.log("状态已更改！可以mint！")
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }
};

init();

