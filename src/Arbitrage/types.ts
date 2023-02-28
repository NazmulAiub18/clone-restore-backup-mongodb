export enum Providers {
  ALCOR_AMMSWAP = "alcorammswap",
  ALCOR_DEXMAIN = "alcordexmain",
  SWAP_BOX = "swap.box",
  SWAP_TACO = "swap.taco",
}

export interface Token {
  readonly symbol: string;
}

export interface Pair {
  readonly token0: string;
  readonly token1: string;
}

/** Represents a pair of AMM pairs to perform arbitrage on for a pair of baseToken & quoteToken */
export interface ArbitragePair {
  readonly baseToken: Token;
  readonly quoteToken: Token;
  readonly pair0: Pair;
  readonly pair1: Pair;
}
