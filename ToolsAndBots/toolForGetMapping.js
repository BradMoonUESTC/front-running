const Web3      = require("web3");

var web3 = new Web3("https://main-light.eth.linkpool.io/");


var spender = "00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45"
var owner   = "00000000000000000000000080f2004a4ac60c6273002d9c961441297e09fcdb"
var slot    = "0000000000000000000000000000000000000000000000000000000000000002"
var spenderAddress="0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45";
var ownerAddress="0x80f2004a4ac60c6273002d9c961441297e09fcdb";
var inner  =  web3.utils.keccak256( "0x" + spender  + slot);

console.log("inner: " + inner);
console.log("inner: " + inner.slice(2));

var allowanceSlot = web3.utils.keccak256("0x" + owner + inner);
console.log(allowanceSlot)
console.log("————————————————")
var otherInner=web3.utils.soliditySha3({ type: "uint", value: ownerAddress},{type: "uint", value: "2"})
console.log("otherInner:"+otherInner);

var otherAllowance=web3.utils.soliditySha3({ type: "uint", value: spenderAddress},{type: "uint", value: otherInner})

console.log("otherAllowance:"+otherAllowance);
async function check() {
    let allowance1 = await web3.eth.getStorageAt("0xAFCdd4f666c84Fed1d8BD825aA762e3714F652c9", allowanceSlot)
    console.log(allowance1)
    let allowance = await web3.eth.getStorageAt("0xAFCdd4f666c84Fed1d8BD825aA762e3714F652c9", otherAllowance)
    console.log(allowance)
    console.log(web3.utils.hexToNumberString(web3.utils.stringToHex(allowance)))
}

check()