![0x API](/assets/0x.svg)

## Simple 0x.org MEV Searcher

Extremely simple arbitrage searcher using 0x API. An experiment in fetching and parsing simple price data in real time. **This is not a finished project. This bot will not make you any ETH as is.**

Example usage:

```
$ npm run dev
```

Example Output:

````...
Fetching Arb: WETH / AGLD
Profit Found!
Token0: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
Token1: 0x32353a6c91143bfd6c7d363b546e62a9a2489a20
Profit in ETH: 0.003956828368108703
Estimated Gas: 237000
...```
````

## TODO:

- Refactor main() to use threads
- More efficient price & gas calculations
- Cache profitable transactions into object, send to web3 handler
- Use different starting volumes

## Sources:

- https://0x.org/docs/api
- https://www.npmjs.com/package/qs
- https://docs.ethers.io/v5/
