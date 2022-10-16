const WebSocket = require('ws');
const ws = new WebSocket('wss://eth-mainnet.alchemyapi.io/v2/_Y9bc6nDLknLJsOxOxICCJ5i0mrpdAR6');
ws.onopen = function(e){
    console.log("连接服务器成功");
    // 向服务器发送消息
    ws.send("{\"jsonrpc\":\"2.0\",\"id\": 1, \"method\": \"eth_subscribe\", \"params\": [\"alchemy_filteredNewFullPendingTransactions\", {\"address\": \"0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D\"}]}");
}
ws.onclose = function(e){
    console.log("服务器关闭");
}
ws.onerror = function(){
    console.log("连接出错");
}
// 接收服务器的消息
var i=0
ws.onmessage = function(e){
    console.log(i++)
    console.log(e.data)
}