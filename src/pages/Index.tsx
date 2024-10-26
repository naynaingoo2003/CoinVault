import { useQuery } from "@tanstack/react-query";
import { fetchTopAssets } from "@/lib/api";
import { AssetCard } from "@/components/AssetCard";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchTopAssets,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-4xl font-black mb-8 brutal-border inline-block px-4 py-2 bg-white">
        Crypto Assets
      </h1>
      <div className="grid gap-4 md:grid-cols-2">
        {assets?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default Index;