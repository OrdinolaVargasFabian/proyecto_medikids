import { memo, useRef, useEffect } from "react"
import ApexCharts from "apexcharts"
import { PieChart as PieIcon } from "lucide-react"

const COLORS = [
  "#b8ca76",
  "#60a5fa",
  "#a78bfa",
  "#fb7185",
  "#f59e0b",
  "#34d399",
  "#f472b6",
  "#38bdf8",
]

export const DoctorAgenda = memo(({ data = [] }) => {
  const containerRef = useRef(null)
  const instanceRef = useRef(null)
  const total = data.reduce((s, d) => s + d.value, 0)

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return

    if (instanceRef.current) {
      instanceRef.current.destroy()
      instanceRef.current = null
    }

    const chart = new ApexCharts(containerRef.current, {
      chart: {
        type: "donut",
        width: "100%",
        height: 280,
        animations: {
          enabled: true,
          easing: "easeout",
          speed: 1800,
          animateGradually: { enabled: true, delay: 250 },
          dynamicAnimation: { enabled: true, speed: 400 },
        },
        toolbar: { show: false },
      },
      colors: COLORS.slice(0, data.length),
      labels: data.map((d) => d.name),
      series: data.map((d) => d.value),
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          donut: {
            size: "72%",
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      legend: { show: false },
      tooltip: {
        enabled: true,
        followCursor: true,
        theme: "dark",
        x: { show: false },
        y: { show: false },
        style: { fontSize: "13px" },
        custom({ series, seriesIndex, w }) {
          const name = w.globals.labels[seriesIndex]
          const value = series[seriesIndex]
          const color = w.globals.colors[seriesIndex]
          return `<div style="background:#333;border-radius:6px;padding:6px 14px;box-shadow:0 4px 16px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px;white-space:nowrap;font-size:13px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0"></span>
            <span style="color:#e5e7eb">${name}</span>
            <span style="color:#9ca3af">:</span>
            <span style="color:#fff;font-weight:700">${value}</span>
          </div>`
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1800,
        animateGradually: { enabled: true, delay: 200 },
        dynamicAnimation: { enabled: true, speed: 400 },
      },
      states: {
        hover: { filter: { type: "none" } },
        active: { filter: { type: "none" } },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { height: 220 },
            plotOptions: { pie: { donut: { size: "60%" } } },
          },
        },
      ],
    })

    chart.render()
    instanceRef.current = chart

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy()
        instanceRef.current = null
      }
    }
  }, [data])

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100/70 shadow-sm p-6 h-full">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-medi-400/40 to-transparent" />
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-[18px] h-[18px] text-medi-500" />
        <h3 className="text-sm font-bold text-gray-800">Distribución por Especialidad</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm font-medium">
          Sin datos
        </div>
      ) : (
        <>
          <style>{`@keyframes donutIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}`}</style>
          <div key={`donut-${data.length}`} className="relative flex justify-center" style={{ animation: "donutIn 0.9s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div ref={containerRef} className="w-full max-w-[320px]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: 4 }}>
              <div className="text-center leading-none select-none">
                <div className="text-[28px] font-bold text-gray-900 tabular-nums">{total}</div>
                <div className="text-xs font-semibold text-gray-400 tracking-wider mt-1">Citas</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-3 pt-4 border-t border-gray-100">
            {data.slice(0, 6).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-gray-500 whitespace-nowrap">{item.name}</span>
                <span className="font-semibold text-gray-800 tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
})
