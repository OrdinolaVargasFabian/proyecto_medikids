import { memo } from "react"
import { CalendarDays } from "lucide-react"

const OPTIONS = [
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "year", label: "Año" },
]

export const TimeFilter = memo(({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100/70 shadow-sm p-1">
      <CalendarDays className="w-4 h-4 text-medi-500 ml-2 shrink-0" />
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          aria-pressed={value === opt.key}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            value === opt.key
              ? "bg-gradient-to-r from-medi-400 to-medi-500 text-white shadow-sm shadow-medi-400/30"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
})
