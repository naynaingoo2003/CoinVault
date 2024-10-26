import { toast } from "sonner";

const COINCAP_API_BASE = "https://api.coincap.io/v2";

export interface Asset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  priceUsd: string;
  changePercent24Hr: string;
  marketCapUsd: string;
}

export interface AssetHistory {
  priceUsd: string;
  time: number;
}

export const fetchTopAssets = async (): Promise<Asset[]> => {
  try {
    const response = await fetch(`${COINCAP_API_BASE}/assets?limit=50`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    toast.error("Failed to fetch assets");
    return [];
  }
};

export const fetchAssetHistory = async (id: string, interval: string = "h1"): Promise<AssetHistory[]> => {
  try {
    const response = await fetch(
      `${COINCAP_API_BASE}/assets/${id}/history?interval=${interval}`
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    toast.error("Failed to fetch asset history");
    return [];
  }
};

export const formatPrice = (price: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(price));
};

export const formatMarketCap = (marketCap: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(parseFloat(marketCap));
};