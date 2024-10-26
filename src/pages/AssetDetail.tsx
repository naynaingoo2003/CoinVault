import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchAssetHistory, fetchTopAssets, formatPrice, formatMarketCap } from "@/lib/api";
import { PriceChart } from "@/components/PriceChart";
import { ArrowLeft, Loader2 } from "lucide-react";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: assets } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchTopAssets,
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["assetHistory", id],
    queryFn: () => fetchAssetHistory(id!),
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

  return (
    <div className="container py-8 max-w-6xl">
      <Link to="/" className="inline-flex items-center gap-2 brutal-border px-4 py-2 bg-white mb-8">
        <ArrowLeft size={20} />
        Back to Assets
      </Link>
      
      <div className="brutal-border bg-white p-6 mb-8">
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
          <div className="brutal-border px-4 py-2 bg-primary/10">
            Rank #{asset.rank}
          </div>
          <div className={`brutal-border px-4 py-2 ${
            parseFloat(asset.changePercent24Hr) >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            24h: {parseFloat(asset.changePercent24Hr).toFixed(2)}%
          </div>
        </div>
      </div>

      {isLoadingHistory ? (
        <div className="h-[400px] brutal-border bg-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        history && <PriceChart data={history} />
      )}
    </div>
  );
};

export default AssetDetail;