import { memo, useState } from "react"
import { Calendar, Search, Plus } from "lucide-react"
import { Link } from "react-router-dom"

const STATUS_STYLES = {
  Pendiente: { dot: "bg-amber-400", bg: "bg-gradient-to-r from-amber-50 to-amber-100/60 text-amber-700 ring-1 ring-amber-200/40" },
  Completada: { dot: "bg-green-400", bg: "bg-gradient-to-r from-green-50 to-green-100/60 text-green-700 ring-1 ring-green-200/40" },
  "En curso": { dot: "bg-blue-400", bg: "bg-gradient-to-r from-blue-50 to-blue-100/60 text-blue-700 ring-1 ring-blue-200/40" },
  Cancelada: { dot: "bg-red-400", bg: "bg-gradient-to-r from-red-50 to-red-100/60 text-red-700 ring-1 ring-red-200/40" },
}

const avatarColors = [
  "bg-gradient-to-br from-medi-400 to-medi-500",
  "bg-gradient-to-br from-blue-400 to-blue-500",
  "bg-gradient-to-br from-purple-400 to-purple-500",
  "bg-gradient-to-br from-rose-400 to-rose-500",
  "bg-gradient-to-br from-amber-400 to-amber-500",
]

export const PremiumTable = memo(({ data = [] }) => {
  const [search, setSearch] = useState("")

  const filtered = data.filter((row) =>
    row.nombre?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100/70 shadow-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-medi-400/40 to-transparent" />
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-[18px] h-[18px] text-medi-500" />
            <h3 className="text-sm font-bold text-gray-800">Citas de Hoy</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 pl-9 pr-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-700 placeholder-gray-400 border border-gray-200/60 focus:border-medi-400 focus:ring-2 focus:ring-medi-400/20 transition-all outline-none"
              />
            </div>
            <Link
              to="/admin/citas"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-medi-400 to-medi-500 text-white rounded-lg text-xs font-semibold hover:from-medi-500 hover:to-medi-600 transition-all shadow-sm shadow-medi-400/30"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Citas de hoy">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pl-6">ID</th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">Paciente</th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">Edad</th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">Género</th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">Especialidad</th>
              <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-6">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-gray-400 font-medium">
                  {search ? "Sin resultados" : "No hay citas para hoy"}
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const style = STATUS_STYLES[row.estado] || STATUS_STYLES.Pendiente
                const initials = row.nombre
                  .split(" ")
                  .map((w) => w.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
                const avatarColor = avatarColors[row.id % avatarColors.length]

                return (
                  <tr
                    key={row.id}
                    className="group relative hover:bg-gradient-to-r hover:from-medi-50/30 hover:to-transparent transition-all duration-200"
                  >
                    <td className="relative py-3.5 pl-6">
                      <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-medi-400 to-medi-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="text-xs font-mono text-gray-400 tabular-nums">#{row.id}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        {row.foto ? (
                          <img src={row.foto} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm" />
                        ) : (
                          <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white shadow-sm shrink-0`}>
                            {initials}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800 text-sm">{row.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="text-gray-500 text-sm tabular-nums">{row.edad}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-gray-500 text-sm">{row.genero}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="text-gray-500 text-sm">{row.especialidad}</span>
                    </td>
                    <td className="py-3.5 pr-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${style.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {row.estado}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
})
