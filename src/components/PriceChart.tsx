import { AssetHistory } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface PriceChartProps {
  data: AssetHistory[];
}

export const PriceChart = ({ data }: PriceChartProps) => {
  const formattedData = data.map(item => ({
    time: new Date(item.time).toLocaleDateString(),
    price: parseFloat(item.priceUsd)
  }));

  return (
    <div className="h-[400px] brutal-border bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <XAxis dataKey="time" />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '4px solid black',
              borderRadius: '0px',
              padding: '10px'
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#000"
            fill="#0066FF"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};