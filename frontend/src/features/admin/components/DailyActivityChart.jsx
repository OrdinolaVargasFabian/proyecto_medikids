import { memo } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Users } from "lucide-react"

const TITLES = {
  week: "Usuarios Registrados (Diario)",
  month: "Usuarios Registrados (Semanal)",
  year: "Usuarios Registrados (Mensual)",
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3.5 text-sm min-w-[140px]">
      <p className="font-bold text-white/90 mb-1">{label}</p>
      <p className="text-xs tabular-nums">
        <span className="text-medi-400 font-bold">{payload[0].value}</span>{" "}
        <span className="text-gray-400">usuarios</span>
      </p>
    </div>
  )
}

export const DailyActivityChart = memo(({ data, timeRange = "month" }) => {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6 h-full outline-none focus:outline-none select-none overflow-hidden" role="img" aria-label="Usuarios registrados en el período">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-medi-400/40 to-transparent" />
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-medi-400 to-medi-500 flex items-center justify-center shadow-sm">
          <Users className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">{TITLES[timeRange] || "Usuarios Registrados"}</h3>
      </div>

      {data.length === 0 || data.every((d) => d.registros === 0) ? (
        <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm font-medium">
          Sin registros en este período
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200} className="focus:outline-none">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barCategoryGap="32%" style={{ outline: "none" }} className="focus:outline-none focus-visible:outline-none">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8ca76" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#b8ca76" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a0b85e" stopOpacity={1} />
                <stop offset="100%" stopColor="#b8ca76" stopOpacity={0.6} />
              </linearGradient>
              <filter id="barShadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#b8ca76" floodOpacity="0.3" />
              </filter>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={{ stroke: "#f3f4f6" }}
              tickLine={false}
              dy={4}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="registros"
              fill="url(#barGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
              filter="url(#barShadow)"
              className="transition-all duration-200"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
})
