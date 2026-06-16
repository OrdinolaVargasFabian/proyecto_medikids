import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { PieChart as PieIcon } from "lucide-react"

const COLORS = ["#b8ca76", "#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#fb923c", "#f472b6", "#94a3b8"]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value, percent } = payload[0].payload
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-bold text-gray-900">{name}</p>
      <p className="text-xs text-gray-500">{value} citas ({(percent * 100).toFixed(1)}%)</p>
    </div>
  )
}

const RADIAN = Math.PI / 180
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#6b7280" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export const PieChartCard = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <PieIcon className="w-5 h-5 text-medi-500" />
        <h3 className="text-base font-bold text-gray-900">Por Especialidad</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-52 text-gray-400 text-sm font-medium">
          Sin datos
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={CustomLabel}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="mt-3 space-y-1.5">
        {data.slice(0, 4).map((item, i) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-gray-500 truncate flex-1">{item.name}</span>
            <span className="font-bold text-gray-700">{item.value}</span>
          </div>
        ))}
        {data.length > 4 && (
          <div className="text-xs text-gray-400 font-medium pt-1">+{data.length - 4} más</div>
        )}
      </div>
    </div>
  )
}
