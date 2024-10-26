import { useQuery } from "@tanstack/react-query";
import { fetchTopAssets } from "@/lib/api";
import { AssetCard } from "@/components/AssetCard";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Index = () => {
  const [filter, setFilter] = useState("");
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchTopAssets,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const filteredAssets = assets?.filter((asset) =>
    asset.name.toLowerCase().includes(filter.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <h1 className="text-4xl font-black mb-8 brutal-border inline-block px-4 py-2 bg-white dark:bg-black dark:text-white">
        CoinVault
      </h1>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or symbol..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-9 brutal-border"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredAssets?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default Index;