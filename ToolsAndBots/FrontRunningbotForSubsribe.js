var Web3 = require("web3");
var colors = require("colors");
require("ethereumjs-tx");
var url = "wss://eth-mainnet.alchemyapi.io/v2/_Y9bc6nDLknLJsOxOxICCJ5i0mrpdAR6"
var myAddress = "0x115CdAfa75447213aA8C03f899ECEfA519495f20"
var pancakeSwapRouter = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
//mainnetuniswap:0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
// rinkeby:0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506
// mainnetsushiswap:0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F
const privateKey = '76be32dcf2c2004673ca19df7625e7884992788238b3f125dd118bbf93c4ff68'
var WBNB = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'//不用改
//mainnet:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 rinkby:0xc778417E063141139Fce010982780140Aa0cD5Ab
var functionSelectorForSwapETHForExactTokens = '0x7ff36ab5'//uniswap和pancakeswap不一样
var myApprovedAddress=[
    "0xdac17f958d2ee523a2206206994597c13d831ec7",//usdt
    // "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",//usdc有代理合约 需要从前端走
    "0xdbdb4d16eda451d0503b854cf79d55697f90c8df",//alcx
    "0xe80c0cd204d654cebe8dd64a4857cab6be8345a3",//jpeg
    "0xd533a949740bb3306d119cc777fa900ba034cd52",//curve
    "0x5a98fcbea516cf06857215779fd812ca3bef1b32",//lido
 ]
var saleGasHigher=1.05//卖出的时候，【是当时的gas费用的多少倍】，防止抢跑成功了但是卖币因为gas卖不出去，范围随意
var gashigher=0.3//【抢跑多花费的gas百分比】（范围从0-1）
var mygasLimit=300000//抢跑购买和出售交易的gas费用，一样的，可调
var myAcceptableCost=0.01 //可控成本，单位ETH
var thresholdLeft=0.05//我要抢跑的交易，它的下限是多少eth进行购买，可调
var thresholdRight=30//我要抢跑的交易，它的上限是多少eth进行购买，可调
var gasPriceThresholdLeft=1.05//交易的gasprice必须在当前区块中位值的下限倍数
var gasPriceThresholdRight=2//交易的gasprice必须在当前区块中位值的上限倍数

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

// region router_abi
const routerV2_ABI = [{
    "inputs": [{
        "internalType": "address",
        "name": "_factory",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "_WETH",
        "type": "address"
    }],
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "inputs": [],
    "name": "WETH",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amountADesired",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountBDesired",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountAMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountBMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "addLiquidity",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "token",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "amountTokenDesired",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "addLiquidityETH",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [],
    "name": "factory",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "reserveIn",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "reserveOut",
        "type": "uint256"
    }],
    "name": "getAmountIn",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
    }],
    "stateMutability": "pure",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "reserveIn",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "reserveOut",
        "type": "uint256"
    }],
    "name": "getAmountOut",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }],
    "stateMutability": "pure",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }],
    "name": "getAmountsIn",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }],
    "name": "getAmountsOut",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "reserveA",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "reserveB",
        "type": "uint256"
    }],
    "name": "quote",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
    }],
    "stateMutability": "pure",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountAMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountBMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "removeLiquidity",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "token",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "removeLiquidityETH",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "token",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "token",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }, {
        "internalType": "bool",
        "name": "approveMax",
        "type": "bool"
    }, {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
    }, {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
    }, {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
    }],
    "name": "removeLiquidityETHWithPermit",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "token",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }, {
        "internalType": "bool",
        "name": "approveMax",
        "type": "bool"
    }, {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
    }, {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
    }, {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
    }],
    "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
    }, {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountAMin",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountBMin",
        "type": "uint256"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }, {
        "internalType": "bool",
        "name": "approveMax",
        "type": "bool"
    }, {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
    }, {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
    }, {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
    }],
    "name": "removeLiquidityWithPermit",
    "outputs": [{
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapETHForExactTokens",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapExactETHForTokens",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapExactTokensForETH",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapExactTokensForTokens",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountInMax",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapTokensForExactETH",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
    }, {
        "internalType": "uint256",
        "name": "amountInMax",
        "type": "uint256"
    }, {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
    }, {
        "internalType": "address",
        "name": "to",
        "type": "address"
    }, {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
    }],
    "name": "swapTokensForExactTokens",
    "outputs": [{
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "stateMutability": "payable",
    "type": "receive"
}]
// endregion

//region IERC20_abi
const IERC20 = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
//endregion


const WebSocket = require("ws");
let web3 = new Web3(new Web3.providers.WebsocketProvider(url, options));
let RouterContract = new web3.eth.Contract(routerV2_ABI, pancakeSwapRouter);
const init = function () {
    const WebSocket = require('ws');
    const ws = new WebSocket('wss://eth-mainnet.alchemyapi.io/v2/_Y9bc6nDLknLJsOxOxICCJ5i0mrpdAR6');
    ws.onopen = function(e){
        console.log("连接服务器成功");
        // 向服务器发送消息
        ws.send("{\"jsonrpc\":\"2.0\",\"id\": 1, \"method\": \"eth_subscribe\", \"params\": [\"alchemy_filteredNewFullPendingTransactions\", {\"address\": \"0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F\"}]}");
    }
    ws.onmessage = function(e){
        let message = eval("(" + e.data + ")")
        if(message.id!=1) {
            setTimeout(async () => {
                let myBalance;
                try {
                    let tx = message.params.result
                    let nowGasPrice = await web3.eth.getGasPrice();
                    //交易不能为空，且交易的gasprice必须在当前区块中位值的95%-105%之间，防止出现低gas无法抢跑或高gas出现损失的情况
                    if (tx != null && (nowGasPrice * gasPriceThresholdLeft) < web3.utils.hexToNumber(tx.gasPrice) && web3.utils.hexToNumber(tx.gasPrice)< (nowGasPrice * gasPriceThresholdRight)) {
                        console.log("——————————监测到Uniswap交易且满足gasprice,txhash为：".green+tx.hash+"——————————".green)

                        if (tx.input.substring(0, 10) === functionSelectorForSwapETHForExactTokens
                            && tx.from.toLowerCase() !== myAddress.toLowerCase()) {//检测到交易
                            const getTokenAddress = "0x" + (tx.input.substr(tx.input.length - 64, 64).substring(24, 64)) // 你能获得到的代币的地址
                            console.log("可以获得的代币地址为:".yellow + getTokenAddress.yellow)
                            if (web3.utils.toWei(thresholdLeft.toString(), 'ether') <= parseInt(web3.utils.hexToNumberString(tx.value))
                                && parseInt(web3.utils.hexToNumberString(tx.value))<= web3.utils.toWei(thresholdRight.toString(), 'ether')) {
                                if (tx.input.length > 450) {
                                    if ((myApprovedAddress.indexOf(getTokenAddress.toString().toLowerCase()) != -1)
                                        || (myApprovedAddress.indexOf(getTokenAddress.toString().toUpperCase()) != -1)) {
                                        console.log("可以获得的代币地址为在地址集合中".green)
                                        // region 创建抢跑交易对象并签名
                                        // 签署交易
                                        const createTransaction = await web3.eth.accounts.signTransaction(
                                            {
                                                from: myAddress,
                                                data: tx.input.substr(0, 10)
                                                    + "0000000000000000000000000000000000000000000000000000000000000000"// TODO:这里注意 我没有要求必须要能换多少币，后面要改
                                                    + "0000000000000000000000000000000000000000000000000000000000000080"
                                                    + "000000000000000000000000" + myAddress.substring(2, myAddress.length)
                                                    + tx.input.substring(202, tx.input.length),
                                                to: pancakeSwapRouter,
                                                value: web3.utils.toWei(myAcceptableCost.toString(), 'ether'),
                                                gasLimit: mygasLimit,
                                                gasPrice: parseInt(
                                                                    (web3.utils.hexToNumber(tx.gasPrice)
                                                                    +web3.utils.hexToNumber(tx.gasPrice)*gashigher)
                                                                    .toString()
                                                                  ),//比受抢跑的交易高gashigher这么多百分比
                                                gas: mygasLimit,
                                            },
                                            privateKey
                                        );
                                        // endregion

                                        myBalance = await web3.eth.getBalance(myAddress)
                                        //如果我的余额减去gas成本高于我的预花费成本
                                        if (myBalance - (web3.utils.hexToNumber(tx.gasPrice) + web3.utils.hexToNumber(tx.gasPrice)*gashigher) * mygasLimit > web3.utils.toWei(myAcceptableCost.toString(), 'ether')) {
                                            // region 发送抢跑交易并出售所得代币
                                            console.log("——————————————————————————————————————————————————————————————————————————————————————————————".green)
                                            console.log("被抢跑交易：" + tx.hash.green)
                                            console.log("买币花费:" + myAcceptableCost + "ETH".green)

                                            web3.eth.sendSignedTransaction(createTransaction.rawTransaction)
                                                .on('transactionHash', function (hash) {
                                                    console.log("抢跑交易被提交到链上：" + hash)
                                                })
                                                .on('receipt', async function (receipt) {
                                                    console.log("抢跑交易被完成：" + receipt.transactionHash)
                                                    console.log("————————————————————————————————————————准备出售token，抢跑hash：" + receipt.transactionHash + "——————————————————————————————————————————————")
                                                    //查询抢跑所获得的代币数量，用getbalance查，TODO：后续自己计算会快一些
                                                    let TokenContract = new web3.eth.Contract(IERC20, getTokenAddress);
                                                    const valueForToken = await TokenContract.methods.balanceOf(myAddress).call({from: myAddress})

                                                    //对代币进行授权，调用代币合约的approve函数，授权给pancakeRouter
                                                    //授权一次就够了，所以可以弄一个地方把授权过的代币存下来，后面在这行的逻辑就不需运行
                                                    // 因为approve是需要发送交易的，出售代币的时间会延后，造成意外损失从而没有利润
                                                    // TokenContract.methods.approve(pancakeSwapRouter, 2000 * (10 ** 18))
                                                    let nowGasPrice = await web3.eth.getGasPrice();//再拿一下当前gas
                                                    var RouterContract = new web3.eth.Contract(routerV2_ABI, pancakeSwapRouter);
                                                    const saleTransaction = await web3.eth.accounts.signTransaction(

                                                        {

                                                            data: RouterContract.methods.swapExactTokensForETH(valueForToken, 0, [getTokenAddress, WBNB], myAddress, 1949561084).encodeABI(),
                                                            to: pancakeSwapRouter,
                                                            value: 0,
                                                            gasLimit: mygasLimit,
                                                            gasPrice: parseInt((nowGasPrice * saleGasHigher).toString()),//使用了卖出时gas高出一定百分比，需要调整测试
                                                            gas: mygasLimit,
                                                            from: myAddress,
                                                        },
                                                        privateKey
                                                    );
                                                    web3.eth.sendSignedTransaction(saleTransaction.rawTransaction)
                                                        .on('transactionHash', function (hash) {
                                                            console.log("出售交易被提交到链上：" + hash)
                                                        })
                                                        .on('receipt', async function (receipt) {
                                                            console.log("出售交易被完成：" + receipt.transactionHash)
                                                            console.log("————————————————————————————————————————开始出售token，hash：" + receipt.transactionHash + "——————————————————————————————————————————————")
                                                        })
                                                        .on('confirmation', function (confirmationNumber, receipt) {

                                                        })
                                                        .on('error', console.error); // If a out of gas error, the second parameter is the receipt.

                                                })
                                                .on('confirmation', function (confirmationNumber, receipt) {

                                                })
                                                .on('error', console.error); // If a out of gas error, the second parameter is the receipt.


                                            // endregion
                                        } else {
                                            console.log("————————————————————————————".red)
                                            console.log("当前交易：" + tx.hash.red)

                                            console.log("余额不足：你的余额为：" + myBalance.red)
                                            console.log("余额不足：gas为：" + (web3.utils.hexToNumber(tx.gasPrice) - web3.utils.hexToNumber(tx.gasPrice)*gashigher) * mygasLimit)
                                            console.log("余额不足：value为：" + tx.value.red)
                                            console.log("————————————————————————————")

                                        }
                                    }
                                    else{
                                        console.log("代币不包含：所能获取的代币地址不在我们的限制之内！所能获取的代币为：".red+getTokenAddress)
                                    }
                                }
                            }
                            else{
                                console.log("value超限：交易value不在我们的限制之内，交易的value为：".red+web3.utils.fromWei(web3.utils.hexToNumberString(tx.value),'ether')+"ETH".red)
                            }
                        }
                        else{
                            console.log("方法不匹配：不是eth换token".red)
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }
};

init();

