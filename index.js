import axios from "axios";
import QueryString from "qs";
import { ethers, BigNumber } from "ethers";

const ZEROX_API = "https://api.0x.org/swap/v1/quote?";

const WETH = {
  id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  decimals: "18",
};

const TOKENS = {
  DAI: { id: "0x6b175474e89094c44da98b954eedeac495271d0f", decimals: "18" },
  USDC: { id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: "6" },
  WBTC: { id: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", decimals: "8" },
  UNI: { id: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", decimals: "18" },
  LDO: { id: "0x5a98fcbea516cf06857215779fd812ca3bef1b32", decimals: "18" },
  AGLD: { id: "0x32353a6c91143bfd6c7d363b546e62a9a2489a20", decimals: "18" },
  ANY: { id: "0xf99d58e463a2e07e5692127302c20a191861b4d6", decimals: "18" },
  STARL: { id: "0x8e6cd950ad6ba651f6dd608dc70e5886b1aa6b24", decimals: "18" },
  MEME: { id: "0xd5525d397898e5502075ea5e830d8914f6f0affe", decimals: "8" },
  OKLG: { id: "0x5dbb9f64cd96e2dbbca58d14863d615b67b42f2e", decimals: "9" },
  TERA: { id: "0x15fb5c5b8a20a9fdf844d5739828b5be304c6cc1", decimals: "18" },
  UFO: { id: "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b", decimals: "18" },
  LFG: { id: "0xdb7a1a851a2977a6f2ba064b2b76a0f79e5ca587", decimals: "9" },
  DPI: { id: "0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b", decimals: "18" },
  METIS: { id: "0x9e32b13ce7f2e80a01932b42553652e053d6ed8e", decimals: "18" },
};

// Convert Integer -> BigNumber -> String
function parseUnits(value, decimals) {
  return ethers.utils.parseUnits(value, decimals).toString();
}
// Convert BigNumber -> Integer -> String
function formatUnits(value, decimals) {
  return ethers.utils.formatUnits(value, decimals).toString();
}

// Get swap quote for two tokens using 0x API
// Optional: specify exchanges [array, string]
const quoteSellTokens = async (
  buyToken,
  sellToken,
  sellAmount,
  includedSources
) => {
  const params = {
    buyToken,
    sellToken,
    sellAmount,
    includedSources,
  };

  let response = await axios.get(
    `${ZEROX_API}${QueryString.stringify(params)}`
  );

  return Promise.resolve({
    amount: response.data.buyAmount,
    tx: response.data.orders[0],
    estimatedGas: BigNumber.from(response.data.gas).toString(),
  });
};

// Fetch swap price of Token0 for Token1
// Fetch swap price of Token1 for Token0, Use amount0 as volume
const getArbQuote = async (token0, token1, volume) => {
  // Quote 1 -- Swap Token0 for Token1
  let amount0 = await quoteSellTokens(token1.id, token0.id, volume);

  // Quote 2 -- Swap Token1 for Token0
  let amount1 = await quoteSellTokens(token0.id, token1.id, amount0.amount);

  // Profit ?
  let profit = BigNumber.from(amount1.amount).gt(volume);
  if (profit) {
    console.log(`Profit Found!`);
    console.log(`Token0: ${token0.id}`);
    console.log(`Token1: ${token1.id}`);
    // Calc difference in WETH
    let delta = BigNumber.from(amount1.amount).sub(volume).toString();
    console.log(`Profit in ETH: ${formatUnits(delta, token0.decimals)}`);
    // Calc total gas
    let totalGas = BigNumber.from(amount0.estimatedGas)
      .add(amount1.estimatedGas)
      .toString();
    console.log(`Estimated Gas: ${totalGas}`);
  }
};

// Application Function
// Set the starting volume in ETH
// For each token fetch the buy/sell price and calculate arb opportunity
const main = async () => {
  let startingVol = parseUnits("0.5", "ether");

  for (const token in TOKENS) {
    console.log(`Fetching Arb: WETH / ${token}`);
    await getArbQuote(WETH, TOKENS[token], startingVol);
  }
};

main();
