import { BigNumber as BN } from "ethers";
import { toBn } from "evm-bn";

const BN_BASE = BN.from(1000);
const ZERO = BN.from(0);
const ONE = BN.from(1);
const TWO = BN.from(2);

/** sqrt() function for BN https://github.com/dholms/bn-sqrt */
function bnSqrt(num: BN): BN {
  if (num.lt(ZERO)) {
    throw new Error("Sqrt only works on non-negtiave inputs");
  }

  if (num.lt(TWO)) {
    return num;
  }

  const smallCand = bnSqrt(num.shr(2)).shl(1);
  const largeCand = smallCand.add(ONE);

  if (largeCand.mul(largeCand).gt(num)) {
    return smallCand;
  } else {
    return largeCand;
  }
}

/** Calculate the optimal trading amount for an arbitrage */
export function calculateAmountIn(
  rb0: number,
  rq0: number,
  rb1: number,
  rq1: number,
  fee: number,
): number {
  console.log(rb0);
  console.log(rq0);
  console.log(rb1);
  console.log(rq1);

  let r = 1000 - fee;
  // let a = rb0.mul(rq1).div(rq0.mul(r).div(BN_BASE).add(rq1));
  let a = (rb0 * rq1) / ((rq0 * r) / 1000) + rq1;
  // let a_ = rb1
  //   .mul(rq0)
  //   .mul(r)
  //   .div(BN_BASE)
  //   .div(rq0.mul(r).div(BN_BASE).add(rq1));
  let a_ = (rb1 * rq0 * r) / 1000 / ((rq0 * r) / 1000) + rq1;
  // let d = bnSqrt(a.mul(a_).mul(r).div(BN_BASE)).sub(a).mul(BN_BASE).div(r);
  let d = ((Math.sqrt((a * a_ * r) / 1000) - a) * 1000) / r;

  console.log(d);

  return d;
  // return d.gt(ZERO) ? d : ZERO;
}

export function calculateProfit(
  delta: BN,
  a1: BN,
  b1: BN,
  a2: BN,
  b2: BN,
  c: BN,
): BN {
  let r = BN_BASE.sub(c);
  let a = a1.mul(b2).div(b1.mul(r).div(BN_BASE).add(b2));
  let a_ = a2.mul(b1).mul(r).div(BN_BASE).div(b1.mul(r).div(BN_BASE).add(b2));
  let delta_ = a_
    .mul(delta)
    .mul(r)
    .div(BN_BASE)
    .div(delta.mul(r).div(BN_BASE).add(a));
  return delta_.sub(delta);
}
