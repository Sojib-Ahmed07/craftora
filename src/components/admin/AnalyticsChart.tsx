"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <Card className="border-neutral-200/80 shadow-sm bg-white overflow-hidden">
      <CardHeader className="p-6 border-b border-neutral-50 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <CardTitle className="text-base font-bold tracking-tight text-neutral-900">
            Performance Vectors
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Visualized distribution logs mapping transactional volumes and gross values.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-6">
        <div className="h-72 w-full text-xs font-medium">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#a3a3a3" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#a3a3a3" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "12px", 
                  borderColor: "#e5e5e5",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)"
                }} 
              />
              <Area 
                name="Revenue ($)"
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
              <Area 
                name="Orders Count"
                type="monotone" 
                dataKey="orders" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOrders)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}