var Tx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const web3 = new Web3('https://ropsten.infura.io/v3/877b29c12f4545e5855cc5729f51343d')

const account1 = '0x6038Bb4123d5F73115255cc79eF428A63e2Ce604'
const account2 = '0xb07b677cd67D7F245E67417Cf7B45dd8ac68e5DF' //0x6038Bb4123d5F73115255cc79eF428A63e2Ce604

const pk1 = '0x9d386adac38cfa9b4d7cb7deb9658e3fca6f12b07983e3f4ef90deb4f23c99a1'
const pk2 = '0x5b9209ef5bc7cca28bcb4fefb1a2157d1212609d30ab4998a59a2e6abc5ab023'//0x9d386adac38cfa9b4d7cb7deb9658e3fca6f12b07983e3f4ef90deb4f23c99a1

const privateKey1 = Buffer.from(pk1, 'hex')
const privateKey2 = Buffer.from(pk2, 'hex')


web3.eth.getTransactionCount(account1, (err, txCount) => {
    //创建交易对象
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: account2,
        value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
    }

    // 签署交易
    const tx = new Tx(txObject, {chain: 'ropsten', hardfork: 'petersburg'})
    tx.sign(privateKey1)

    const serializedTx = tx.serialize()
    const raw = '0x' + serializedTx.toString('hex')

    //广播交易
    web3.eth.sendSignedTransaction(raw, (err, txHash) => {
        console.log('txHash:', txHash)
        //可以去ropsten.etherscan.io查看交易详情
    })
})

