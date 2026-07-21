"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export default function WeeklyChart({
  data,
}: {
  data: { settimana: string; chiamate: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl2 border border-teal-900/10 bg-white text-sm text-teal-600/70 shadow-card">
        Nessuna chiamata registrata ancora — il grafico si popola da qui.
      </div>
    );
  }

  return (
    <div className="rounded-xl2 border border-teal-900/10 bg-white p-4 shadow-card">
      <p className="mb-3 font-body text-xs font-medium uppercase tracking-wide text-teal-600/80">
        Chiamate per settimana (lun–dom)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E7EEEC" />
          <XAxis
            dataKey="settimana"
            tick={{ fontSize: 11, fill: "#5E8E89" }}
            axisLine={{ stroke: "#CFE0DC" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#5E8E89" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ fill: "#E7EEEC" }}
            contentStyle={{
              borderRadius: 10,
              borderColor: "#CFE0DC",
              fontSize: 12,
              fontFamily: "var(--font-inter)",
            }}
          />
          <Bar dataKey="chiamate" fill="#0A3F3F" radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
