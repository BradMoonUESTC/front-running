const axios = require('axios')
//alchemy
const alchemyTrace = function () {
    axios.post('https://eth-mainnet.g.alchemy.com/v2/demo/', {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "debug_traceTransaction",
        "params":
            ["0x066be677c4b4578305d4b6ecfaf7310caf51d5cf6459447d71bc803fc287e226",
                {tracer: "callTracer"}
            ]
    })
        .then((res) => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res.data)
        })
        .catch((error) => {
            console.error(error)
        })
}
//getblock
const getblockTrace = function () {
    axios.post('https://eth.getblock.io/mainnet/?api_key=9955ba9f-4e1e-44c6-9ca6-0f8c6d3e7c36', {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "debug_traceTransaction",
        "params": ['0x96a129768ec66fd7d65114bf182f4e173bf0b73a44219adaf71f01381a3d0143',
            {
                tracer:

                "prestateTracer"
            }
        ]
    })
        .then((res) => {
            console.log(res.data)
        })
        .catch((error) => {
            console.error(error)
        })
}
getblockTrace();
// alchemyTrace()