const Web3 = require('web3')

const rpcURL = "https://bsc-dataseed1.binance.org:443"

const web3 = new Web3(rpcURL)

const address = "0x6c2E1B446d434564e1Ec22210f1634E529a64552"


//读取address中的余额，余额的单位是wei
web3.eth.getBalance(address, (err, wei) => {

    //余额单位从wei转换为ether
    balance = web3.utils.fromWei(wei, 'ether')
    console.log(("balance: " + balance))
})