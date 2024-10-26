import { Asset, formatPrice, formatMarketCap } from "@/lib/api";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const priceChange = parseFloat(asset.changePercent24Hr);
  const isPositive = priceChange >= 0;

  return (
    <Link to={`/asset/${asset.id}`}>
      <div className="brutal-card p-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">{asset.rank}</span>
            <h2 className="text-xl font-bold">{asset.name}</h2>
            <span className="text-sm text-muted-foreground">{asset.symbol}</span>
          </div>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
            <span className="font-mono">{Math.abs(priceChange).toFixed(2)}%</span>
          </div>
        </div>
        <div className="flex justify-between items-end mt-2">
          <span className="text-2xl font-mono">{formatPrice(asset.priceUsd)}</span>
          <span className="text-sm text-muted-foreground">
            MCap: {formatMarketCap(asset.marketCapUsd)}
          </span>
        </div>
      </div>
    </Link>
  );
};