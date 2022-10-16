var Web3 = require("web3");
var url = "http://123.60.36.208:8545";
let web3 = new Web3(new Web3.providers.HttpProvider(url, options));
let myAddress="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
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

const BokiAddress = "0x248139aFB8d3A2e16154FbE4Fb528A3a214fd8E7";
var init=async function(){
    
    blockNum = await web3.eth.getBlockNumber()
    info=web3.eth.getBlock(3610)
    console.log(blockNum)
    console.log(info)
}
init();