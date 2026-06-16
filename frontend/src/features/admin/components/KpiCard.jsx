import { memo, useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react"

function useCountUp(end, duration = 900) {
  const [value, setValue] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const raw = typeof end === "string" ? end.replace(/[^0-9.\-]/g, "") : String(end)
    const numeric = parseFloat(raw)
    if (isNaN(numeric)) return
    startRef.current = null

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * numeric))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
      else setValue(numeric)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [end, duration])

  if (typeof end === "string" && end.startsWith("S/"))
    return `S/ ${value.toLocaleString("es-PE")}`
  if (typeof end === "string" && end.endsWith("%"))
    return `${value}%`
  if (typeof end === "string")
    return value.toLocaleString("es-PE")
  return value.toLocaleString("es-PE")
}

export const KpiCard = memo(({ icon: Icon, label, value, cambio, subtitle, linkTo }) => {
  const display = useCountUp(value)

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100/70 shadow-sm overflow-hidden">
      <div className="absolute left-0 top-0 w-[3px] h-0 bg-gradient-to-b from-medi-400 to-medi-500 group-hover:h-full transition-all duration-500 ease-out" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-medi-50/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative p-5 space-y-4">
        {/* Header row: icon + title (left) · arrow link (right) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon className="w-[18px] h-[18px] text-medi-500" />
            <span className="text-sm font-semibold text-gray-500">{label}</span>
          </div>
          {linkTo && (
            <Link
              to={linkTo}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors text-gray-300 group-hover:text-medi-400 hover:bg-gray-50"
            >
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* Metric row: large number + trend badge */}
        <div className="flex items-center gap-3">
          <div className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-gray-900 leading-none tabular-nums">
            {display}
          </div>
          {cambio !== null && cambio !== undefined && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold leading-none ${
                cambio > 0
                  ? "bg-green-50 text-green-700"
                  : cambio < 0
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-50 text-gray-500"
              }`}
            >
              {cambio > 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : cambio < 0 ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              <span>{cambio > 0 ? "+" : ""}{cambio}%</span>
            </div>
          )}
        </div>

        {/* Subtext row */}
        {subtitle && (
          <div>
            <span className="text-xs text-gray-400">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  )
})

export { useCountUp }
