import { memo } from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Activity } from "lucide-react"

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 text-sm min-w-[180px]">
      <p className="font-bold text-white/90 mb-2.5 tracking-tight">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-medi-400 shadow-[0_0_6px_rgba(184,202,118,0.6)]" />
            <span className="text-gray-400 text-xs font-medium">Admitidas</span>
          </div>
          <span className="font-bold text-white text-sm tabular-nums">{payload[0]?.value || 0}</span>
        </div>
        {payload[1] && (
          <div className="flex items-center justify-between gap-6 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.5)]" />
              <span className="text-gray-400 text-xs font-medium">En Consulta</span>
            </div>
            <span className="font-bold text-white text-sm tabular-nums">{payload[1]?.value || 0}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const TITLES = { week: "Admisiones Diarias", month: "Admisiones Mensuales", year: "Admisiones Anuales" }

export const TrendChart = memo(({ data, timeRange = "month" }) => {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6 h-full outline-none focus:outline-none select-none overflow-hidden" role="img" aria-label="Gráfico de admisiones y consultas">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-medi-400/40 to-transparent" />
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-[18px] h-[18px] text-medi-500" />
            <h3 className="text-sm font-bold text-gray-800">{TITLES[timeRange] || "Admisiones"}</h3>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">Admitidas vs. En Consulta</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-medi-400 shadow-[0_0_4px_rgba(184,202,118,0.5)]" />
            Admitidas
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.5)]" />
            En Consulta
          </div>
        </div>
      </div>

      {data.every((d) => d.admitidas === 0 && d.consulta === 0) ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm font-medium">
          Sin datos disponibles
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300} className="focus:outline-none">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} style={{ outline: "none" }} className="focus:outline-none focus-visible:outline-none">
            <defs>
              <linearGradient id="admitidasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8ca76" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#b8ca76" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="consultaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={{ stroke: "#f3f4f6" }}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="consulta"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#consultaGradient)"
              dot={false}
              activeDot={{ fill: "#60a5fa", stroke: "#fff", strokeWidth: 2.5, r: 5, filter: "url(#glow)" }}
            />
            <Area
              type="monotone"
              dataKey="admitidas"
              stroke="#b8ca76"
              strokeWidth={2.5}
              fill="url(#admitidasGradient)"
              filter="url(#glow)"
              dot={{ fill: "#b8ca76", stroke: "#fff", strokeWidth: 2, r: 3 }}
              activeDot={{ fill: "#b8ca76", stroke: "#fff", strokeWidth: 3, r: 7, filter: "url(#glow)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
})
