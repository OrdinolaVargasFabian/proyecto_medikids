import { memo } from "react"
import { Trophy } from "lucide-react"

const BAR_GRADIENTS = [
  { from: "#b8ca76", to: "#a0b85e" },
  { from: "#60a5fa", to: "#3b82f6" },
  { from: "#a78bfa", to: "#8b5cf6" },
  { from: "#fb7185", to: "#f43f5e" },
  { from: "#f59e0b", to: "#d97706" },
]

export const EngagementChart = memo(({ data }) => {
  const max = Math.max(...data.map((d) => d.citas), 1)

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6 h-full outline-none focus:outline-none select-none overflow-hidden" role="img" aria-label="Top doctores por cantidad de citas">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-medi-400/40 to-transparent" />
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-medi-400 to-medi-500 flex items-center justify-center shadow-sm">
          <Trophy className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">Top Doctores</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm font-medium">
          Sin datos
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((doctor, i) => {
            const pct = (doctor.citas / max) * 100
            const g = BAR_GRADIENTS[i] || BAR_GRADIENTS[0]
            const posStyles = [
              "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-[0_2px_6px_rgba(251,191,36,0.4)]",
              "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-[0_2px_6px_rgba(156,163,175,0.3)]",
              "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_2px_6px_rgba(234,88,12,0.3)]",
              "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400",
              "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400",
            ]

            return (
              <div key={doctor.name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center shrink-0 ${posStyles[i] || "bg-gray-100 text-gray-400"}`}>
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 truncate group-hover:text-gray-900 transition-colors">{doctor.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500 tabular-nums shrink-0 ml-3">{doctor.citas}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})
