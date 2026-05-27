import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { Calendar, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { getAllAppointments, getDoctors } from "../../../services/api";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

const columnHelper = createColumnHelper();

const statusStyle = {
  "Pendiente": "text-amber-600 bg-amber-50 border-amber-100",
  "Completada": "text-emerald-600 bg-emerald-50 border-emerald-100",
  "En curso": "text-blue-600 bg-blue-50 border-blue-100",
  "Cancelada": "text-red-600 bg-red-50 border-red-100",
};

export const AdminAppointments = () => {
  const { data: appointments = [], isLoading: loading, error } = useQuery({
    queryKey: ['admin', 'appointments'],
    queryFn: getAllAppointments,
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['admin', 'doctors'],
    queryFn: getDoctors,
    staleTime: 10 * 60 * 1000,
  });

  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (filterDoctor) {
      list = list.filter((a) => {
        const name = `${a.medico?.usuario?.nombres || ""} ${a.medico?.usuario?.apellidos || ""}`.trim().toLowerCase();
        return name.includes(filterDoctor.toLowerCase());
      });
    }
    if (filterStatus) {
      list = list.filter((a) => a.estado === filterStatus);
    }
    if (filterDate) {
      list = list.filter((a) => a.fecha_cita === filterDate);
    }
    list.sort((a, b) => (a.fecha_cita || "").localeCompare(b.fecha_cita || "") || (a.hora_cita || "").localeCompare(b.hora_cita || ""));
    return list;
  }, [appointments, filterDoctor, filterStatus, filterDate]);

  const columns = useMemo(() => [
    columnHelper.accessor('fecha_cita', {
      header: 'Fecha',
      cell: info => <span className="font-bold text-gray-900 whitespace-nowrap">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('hora_cita', {
      header: 'Hora',
      cell: info => <span className="font-medium text-gray-900">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('paciente.nombre_completo', {
      id: 'paciente',
      header: 'Paciente',
      cell: info => <span className="text-gray-700">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('medico', {
      id: 'medico',
      header: 'Médico',
      cell: info => {
        const m = info.getValue();
        const name = m?.usuario ? `${m.usuario.nombres} ${m.usuario.apellidos}`.trim() : "—";
        return <span className="text-gray-700 whitespace-nowrap">{name}</span>;
      },
    }),
    columnHelper.accessor('medico.especialidad.nombre', {
      id: 'especialidad',
      header: 'Especialidad',
      cell: info => {
        const val = info.getValue();
        return <span className="text-xs font-bold text-medi-600 bg-medi-50 px-3 py-1.5 rounded-full">{val || "—"}</span>;
      },
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: info => {
        const val = info.getValue();
        return (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusStyle[val] || "text-gray-600 bg-gray-50 border-gray-100"}`}>
            {val}
          </span>
        );
      },
    }),
    columnHelper.accessor('asistencia', {
      header: 'Asistencia',
      cell: info => {
        const val = info.getValue();
        const estado = info.row.original.estado;
        if (val === '1') {
          return (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" /> Asistió
            </span>
          );
        }
        if (estado === "Pendiente" || !val) {
          return (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-400">
              <Clock className="w-3.5 h-3.5" /> Por definir
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500">
            <XCircle className="w-3.5 h-3.5" /> No asistió
          </span>
        );
      },
    }),
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <AdminTableSkeleton headerWidth="w-48" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-lg font-bold text-gray-900">Error al cargar citas</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-medi-500 text-white rounded-xl font-bold hover:bg-medi-600 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Citas</h2>
        <p className="text-gray-500 font-medium mt-1">Todas las citas médicas del sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Todas las Citas <span className="text-medi-500 font-extrabold">({appointments.length})</span></h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none"
            >
              <option value="">Todos los médicos</option>
              {doctors.map((d) => {
                const name = `${d.usuario?.nombres || ""} ${d.usuario?.apellidos || ""}`.trim();
                return <option key={d.id_medico} value={name}>{name}</option>;
              })}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En curso">En curso</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
            <Calendar className="w-10 h-10" />
            <p className="font-semibold text-sm">No se encontraron citas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/80">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-50">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-medi-50/50 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};