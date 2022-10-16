var myAddress = "0x1D7b63721c10c6Fffb1CFc3d355b2aeA809031b5"
const privateKey = 'a02850bd0ca74263d6d38b5f7850cd8e9f176545249a300c2b5bd41820cb149d'
var saleGasHigher=1.05//卖出的时候，【是当时的gas费用的多少倍】，防止抢跑成功了但是卖币因为gas卖不出去，范围随意
var gashigher=0.1//【抢跑多花费的gas百分比】（范围从0-1）
var mygasLimit=300000//抢跑购买和出售交易的gas费用，一样的，可调
var myAcceptableCost=0.01 //可控成本，单位ETH
var thresholdLeft=0.1//我要抢跑的交易，它的下限是多少eth进行购买，可调
var thresholdRight=10//我要抢跑的交易，它的上限是多少eth进行购买，可调
var gasPriceThresholdLeft=0.1//交易的gasprice必须在当前区块中位值的下限倍数
var gasPriceThresholdRight=3//交易的gasprice必须在当前区块中位值的上限倍数

module.exports = {
    myAddress,
    privateKey,
    saleGasHigher,
    gashigher,
    mygasLimit,
    myAcceptableCost,
    thresholdLeft,
    thresholdRight,
    gasPriceThresholdLeft,
    gasPriceThresholdRight
};