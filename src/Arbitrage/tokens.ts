import { BigNumber as BN } from "ethers";
import { toBn } from "evm-bn";

import { Providers } from "./types";

type Pool = {
  quantity: string;
  contract: string;
  symbol: string;
};

const reserves: {
  [key in Providers]: {
    [key: string]: { pool1: Pool; pool2: Pool; [key: string]: any };
  };
} = {
  [Providers.ALCOR_AMMSWAP]: {
    "885": {
      id: 885,
      supply: "44798.586963 WAXLOOT",
      pool1: {
        quantity: "8230.00206995",
        symbol: "8,WAX",
        contract: "eosio.token",
      },
      pool2: {
        quantity: "4153369.1548",
        symbol: "4,LOOT",
        contract: "warsaken",
      },
      fee: 30,
      fee_contract: "aw.aq.waa",
    },
  },
  [Providers.ALCOR_DEXMAIN]: {},
  [Providers.SWAP_TACO]: {
    LOOWAX: {
      id: "LOOWAX",
      supply: "64036194.5256 LOOWAX",
      pool1: {
        quantity: "15307256.8541",
        symbol: "4,LOOT",
        contract: "warsaken",
      },
      pool2: {
        quantity: "30764.24309941",
        symbol: "8,WAX",
        contract: "eosio.token",
      },
    },
  },
  [Providers.SWAP_BOX]: {},
};

export async function getReserves(provider: Providers, pairId: string) {
  const reserve = reserves[provider][pairId];
  if (!reserve) {
    throw new Error(`pairId ${pairId} not found!`);
  }
  // const reserve0 = BN.from(toBn(reserve.pool1.quantity));
  // const reserve1 = BN.from(toBn(reserve.pool2.quantity));
  const reserve0 = Number(reserve.pool1.quantity);
  const reserve1 = Number(reserve.pool2.quantity);

  return reserve.pool1.symbol.includes("WAX")
    ? [reserve0, reserve1]
    : [reserve1, reserve0];
}
