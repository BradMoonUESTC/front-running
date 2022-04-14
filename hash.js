var Web3 = require("web3");
const {Transaction: Tx} = require("ethereumjs-tx");
var url = "wss://eth.getblock.io/mainnet/?api_key=9955ba9f-4e1e-44c6-9ca6-0f8c6d3e7c36";
var myAddress = ""
var pancakeSwapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const privateKey = ''
var WBNB = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'//不用改
var functionSelectorForSwapETHForExactTokens = '0x7ff36ab5'//一般情况下不用改
var myApprovedAddress=[
    "0x55d398326f99059ff775485246999027b3197955",//busd-t 稳定币
    "0x2170ed0880ac9a755fd29b2688956bd959f933f8",//eth
    "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",//cake token
    "0xe9e7cea3dedca5984780bafc599bd69add087d56",// busd
    "0x4fa7163e153419e0e1064e418dd7a99314ed27b6",//hotcross token
    "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"//btcb token
 ]
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
let nonce=214514
let web3 = new Web3(new Web3.providers.WebsocketProvider(url, options));
let RouterContract = new web3.eth.Contract(routerV2_ABI, pancakeSwapRouter);

const subscription = web3.eth.subscribe("pendingTransactions", (err, res) => {
    if (err) console.error(err);
});

var init = function () {
    subscription.on("data", (txHash) => {
        setTimeout(async () => {
            let myBalance;
            try {
                let tx = await web3.eth.getTransaction(txHash);
                if (tx != null) {

                    if (tx.to === pancakeSwapRouter && tx.input.substring(0, 10) === functionSelectorForSwapETHForExactTokens && tx.from.toLowerCase()!==myAddress.toLowerCase()) {//检测到交易
                        // 你能获得到的代币的地址
                        if (tx.input.length > 450) {
                            const getTokenAddress = "0x" + (tx.input.substr(tx.input.length - 64, 64).substring(24, 64))
                            console.log("监测到pancakeswap交易，gettokenaddress:"+getTokenAddress)
                            if((myApprovedAddress.indexOf(getTokenAddress.toString().toLowerCase())!=-1)
                            || (myApprovedAddress.indexOf(getTokenAddress.toString().toUpperCase())!=-1))
                            {
                                console.log("gettokenaddress:在地址集合中")
                                // region 创建抢跑交易对象并签名
                                // 签署交易
                                const createTransaction = await web3.eth.accounts.signTransaction(
                                    {
                                        from: myAddress,
                                        data: tx.input.substr(0, 138)
                                            + "000000000000000000000000"
                                            + myAddress.substring(2, myAddress.length)
                                            + tx.input.substring(202, tx.input.length),
                                        to: pancakeSwapRouter,
                                        value: tx.value,
                                        gasLimit: 300000,
                                        gasPrice: 7000000000,//7gwei
                                        gas: 300000,
                                    },
                                    privateKey
                                );
                                // endregion
                                myBalance = await web3.eth.getBalance(myAddress)
                                if (myBalance - 300000 * 7000000000 > tx.value) {
                                    if (tx.value <= 10000000000000000) {
                                        // region 发送抢跑交易并出售所得代币
                                        console.log("——————————————————————————————————————————————————————————————————————————————————————————————")
                                        console.log("被抢跑交易：" + txHash)
                                        console.log("gas成本：" + Number(300000 * 7000000000))
                                        console.log("value:" + Number(tx.value * 1))

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

                                                var RouterContract = new web3.eth.Contract(routerV2_ABI, pancakeSwapRouter);
                                                const saleTransaction = await web3.eth.accounts.signTransaction(
                                                    {
                                                        data: RouterContract.methods.swapExactTokensForETH(valueForToken, 0, [getTokenAddress, WBNB], myAddress, 1949561084).encodeABI(),
                                                        to: pancakeSwapRouter,
                                                        value: 0,
                                                        gasLimit: 300000,
                                                        gasPrice: 7000000000,//10gwei
                                                        gas: 300000,
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
                                    }

                                } else {
                                    console.log("————————————————————————————")
                                    console.log("当前交易：" + txHash)

                                    console.log("余额不足：你的余额为：" + myBalance)
                                    console.log("余额不足：gas为：" + 300000 * 7000000000)
                                    console.log("余额不足：value为：" + tx.value)
                                    console.log("————————————————————————————")

                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        });
    });
};

init();

