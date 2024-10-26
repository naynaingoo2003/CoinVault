import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchAssetHistory, fetchTopAssets, formatPrice, formatMarketCap } from "@/lib/api";
import { PriceChart } from "@/components/PriceChart";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const TIME_RANGES = {
  "1H": "h1",
  "4H": "h1",
  "12H": "h1",
  "24H": "h1",
  "1W": "d1",
  "ALL": "d1"
} as const;

type TimeRange = keyof typeof TIME_RANGES;

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [timeRange, setTimeRange] = useState<TimeRange>("24H");

  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchTopAssets,
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["assetHistory", id, timeRange],
    queryFn: () => fetchAssetHistory(id!, TIME_RANGES[timeRange]),
    enabled: !!id,
  });

  const asset = assets?.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const filterHistoryByTimeRange = (data: any[]) => {
    if (!data) return [];
    const now = Date.now();
    const ranges = {
      "1H": 60 * 60 * 1000,
      "4H": 4 * 60 * 60 * 1000,
      "12H": 12 * 60 * 60 * 1000,
      "24H": 24 * 60 * 60 * 1000,
      "1W": 7 * 24 * 60 * 60 * 1000,
      "ALL": Infinity
    };
    return data.filter(item => (now - item.time) <= ranges[timeRange]);
  };

  return (
    <div className="container py-8 max-w-6xl">
      <Link to="/" className="inline-flex items-center gap-2 brutal-border px-4 py-2 bg-white dark:bg-black dark:text-white mb-8">
        <ArrowLeft size={20} />
        Back to Assets
      </Link>
      
      <div className="brutal-border bg-white dark:bg-black dark:text-white p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-black">{asset.name}</h1>
            <p className="text-xl text-muted-foreground">{asset.symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono">{formatPrice(asset.priceUsd)}</p>
            <p className="text-sm text-muted-foreground">
              Market Cap: {formatMarketCap(asset.marketCapUsd)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="brutal-border px-4 py-2 bg-primary/10 dark:bg-primary/20">
            Rank #{asset.rank}
          </div>
          <div className={`brutal-border px-4 py-2 ${
            parseFloat(asset.changePercent24Hr) >= 0 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-red-100 dark:bg-red-900'
          }`}>
            24h: {parseFloat(asset.changePercent24Hr).toFixed(2)}%
          </div>
        </div>
      </div>

      <Tabs defaultValue="24H" className="mb-4" onValueChange={(value) => setTimeRange(value as TimeRange)}>
        <TabsList className="brutal-border bg-white dark:bg-black">
          {Object.keys(TIME_RANGES).map((range) => (
            <TabsTrigger
              key={range}
              value={range}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {range}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoadingHistory ? (
        <div className="h-[400px] brutal-border bg-white dark:bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        history && <PriceChart data={filterHistoryByTimeRange(history)} />
      )}
    </div>
  );
};

export default AssetDetail;