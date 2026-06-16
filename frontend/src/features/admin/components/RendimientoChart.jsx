import { memo } from "react"
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  const ingresos = payload.find((p) => p.dataKey === "ingresos")
  const citas = payload.find((p) => p.dataKey === "citas")

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-3.5 text-sm min-w-[160px]">
      <p className="text-xs font-semibold text-gray-500 mb-2.5">{label}</p>
      {ingresos && (
        <div className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-medi-400" />
            <span className="text-gray-600 text-xs font-medium">Ingresos</span>
          </div>
          <span className="font-bold text-gray-900 text-sm tabular-nums">
            S/ {(ingresos.value || 0).toLocaleString("es-PE")}
          </span>
        </div>
      )}
      {citas && (
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-transparent" />
            <span className="text-gray-600 text-xs font-medium">Citas</span>
          </div>
          <span className="font-bold text-gray-900 text-sm tabular-nums">{citas.value || 0}</span>
        </div>
      )}
    </div>
  )
}

const TITLES = { week: "Rendimiento Semanal", month: "Rendimiento Mensual", year: "Rendimiento Anual" }

export const RendimientoChart = memo(({ data, timeRange = "month" }) => {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6 h-full outline-none focus:outline-none select-none overflow-hidden" role="img" aria-label="Gráfico de rendimiento de citas e ingresos">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-medi-400/40 to-transparent" />
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-[18px] h-[18px] text-medi-500" />
            <h3 className="text-sm font-bold text-gray-800">{TITLES[timeRange] || "Rendimiento"}</h3>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Citas vs. Ingresos</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-medi-400 shadow-[0_0_4px_rgba(184,202,118,0.5)]" />
            Ingresos
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-transparent" />
            Citas
          </div>
        </div>
      </div>

      {data.every((d) => d.citas === 0 && d.ingresos === 0) ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm font-medium">
          Sin datos disponibles
        </div>
      ) : (
        <>
        <style>{`@keyframes chartIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{ animation: "chartIn 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <ResponsiveContainer width="100%" height={300} className="focus:outline-none">
          <ComposedChart key={`chart-${data.length}-${timeRange}`} data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} style={{ outline: "none" }} className="focus:outline-none focus-visible:outline-none">
            <defs>
              <linearGradient id="ingresosAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8ca76" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#b8ca76" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={35}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) => `S/${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="ingresos"
              stroke="#b8ca76"
              strokeWidth={2.5}
              fill="url(#ingresosAreaGradient)"
              dot={false}
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-out"
              activeDot={{ fill: "#b8ca76", stroke: "#fff", strokeWidth: 2.5, r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="citas"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-out"
              activeDot={{ fill: "#9ca3af", stroke: "#fff", strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        </div>
        </>
      )}
    </div>
  )
})
