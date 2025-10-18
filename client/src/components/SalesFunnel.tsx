import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelData {
  name: string;
  value: number;
  percentage: number;
}

interface SalesFunnelProps {
  data: FunnelData[];
}

export function SalesFunnel({ data }: SalesFunnelProps) {
  const maxValue = data[0]?.value || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => {
            const widthPercentage = (item.value / maxValue) * 100;
            const colors = ['#1E40AF', '#06B6D4', '#1E40AF'];
            const bgColor = colors[index % colors.length];

            return (
              <div key={item.name} className="flex items-center gap-4">
                <div className="flex-1">
                  <div
                    className="relative h-16 flex items-center justify-between px-4 text-white font-semibold rounded transition-all"
                    style={{
                      backgroundColor: bgColor,
                      width: `${widthPercentage}%`,
                      minWidth: '200px',
                    }}
                  >
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

