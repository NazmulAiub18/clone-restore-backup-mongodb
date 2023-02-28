import fs from "fs";
import pool from "@ricokahler/pool";
import { ethers, BigNumber as BN } from "ethers";
import { calculateAmountIn, calculateProfit } from "./model";
// import { initializePairs, getArbitragePairs, getReserves } from "./tokens";
import { getReserves } from "./tokens";
import { ArbitragePair, Pair, Providers } from "./types";

const c = BN.from(30);
const ZERO = BN.from(0);

async function runOnePair(ap: any) {
  let [rb0, rq0] = await getReserves(ap.pair0.provider, ap.pair0.pairId);

  let [rb1, rq1] = await getReserves(ap.pair1.provider, ap.pair1.pairId);

  let amount01 = calculateAmountIn(rb0, rq0, rb1, rq1, 30);
  let amount10 = calculateAmountIn(rb1, rq1, rb0, rq0, 30);
  // let profit01 = calculateProfit(amount01, rb0, rq0, rb1, rq1, c);
  // let profit10 = calculateProfit(amount10, rb1, rq1, rb0, rq0, c);

  // let amountIn: BN;
  // let profit: BN;
  // let pair0: Pair;
  // let pair1: Pair;
  // if (amount01.gt(ZERO)) {
  //   amountIn = amount01;
  //   profit = profit01;
  //   pair0 = ap.pair0;
  //   pair1 = ap.pair1;
  // } else if (amount10.gt(ZERO)) {
  //   amountIn = amount10;
  //   profit = profit10;
  //   pair0 = ap.pair1;
  //   pair1 = ap.pair0;
  // } else {
  //   return;
  // }

  // console.log(
  //   `executing arbitrage`,
  //   `base=${ap.baseToken.symbol}`,
  //   `quote=${ap.quoteToken.symbol}`,
  //   `pair0=${pair0}`,
  //   `pair1=${pair1}`,
  //   `profit=${profit.toNumber() / 1e9} Gwei`,
  // );
}

export async function startArb() {
  while (true) {
    await pool({
      collection: [
        {
          pair0: { provider: Providers.ALCOR_AMMSWAP, pairId: "885" },
          pair1: { provider: Providers.SWAP_TACO, pairId: "LOOWAX" },
        },
      ],
      task: runOnePair,
      maxConcurrency: 3,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
