import { memo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { PieChart as PieIcon } from "lucide-react"

const COLORS = {
  Completada: "#10b981",
  Pendiente: "#f59e0b",
  "En curso": "#60a5fa",
  Cancelada: "#f87171",
}

const STATUS_LABELS = {
  Completada: "Completada",
  Pendiente: "Pendiente",
  "En curso": "En curso",
  Cancelada: "Cancelada",
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  const total = payload.reduce((s, e) => s + e.value, 0)
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3.5 text-sm min-w-[140px]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[name] || "#9ca3af" }} />
        <span className="font-bold text-white/90">{STATUS_LABELS[name] || name}</span>
      </div>
      <p className="text-xs text-gray-400 tabular-nums">
        <span className="text-white font-semibold">{value}</span> citas ({total > 0 ? Math.round((value / total) * 100) : 0}%)
      </p>
    </div>
  )
}

export const StatusChart = memo(({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6 h-full outline-none focus:outline-none select-none overflow-hidden" role="img" aria-label="Distribución de estados de citas">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-medi-400/40 to-transparent" />
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-medi-400 to-medi-500 flex items-center justify-center shadow-sm">
          <PieIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">Estado de Citas</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm font-medium">
          Sin datos
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={180} className="focus:outline-none">
            <PieChart style={{ outline: "none" }} className="focus:outline-none focus-visible:outline-none">
              <defs>
                {data.map((entry) => (
                  <filter key={entry.name} id={`shadow-${entry.name}`}>
                    <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.25" />
                  </filter>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] || "#9ca3af"}
                    filter={`url(#shadow-${entry.name})`}
                    className="transition-all duration-200 hover:opacity-90"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} />
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center -mt-10 mb-2 pointer-events-none">
            <div className="text-xl font-bold text-gray-900 tabular-nums">{total}</div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</div>
          </div>

          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2.5 mt-1 pt-4 border-t border-gray-100">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs group">
                <span
                  className="w-2 h-2 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                  style={{ backgroundColor: COLORS[item.name] || "#9ca3af" }}
                />
                <span className="text-gray-500 truncate group-hover:text-gray-700 transition-colors">{STATUS_LABELS[item.name] || item.name}</span>
                <span className="font-bold text-gray-800 ml-auto tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})
