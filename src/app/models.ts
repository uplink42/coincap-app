export interface Response<T> {
  data: T;
  timestamp: number;
}

export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
}

export interface Rate {
  id: string;
  symbol: string;
  currencySymbol: string;
  rateUsd: string;
  type: 'fiat' | 'crypto';
}

export interface Profile {
  assets: Asset[];
  id: number;
  name: string;
}

export interface CoinPrices {
  [key: string]: { priceUsd: string; priceCurrentCurrency: string };
}
