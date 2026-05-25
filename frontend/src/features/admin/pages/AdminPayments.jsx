import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { DollarSign, AlertTriangle, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { getAllPayments } from "../../../services/api";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

const columnHelper = createColumnHelper();

const isCompleted = (estado) => estado === "completado" || estado === "COMPLETADO";

export const AdminPayments = () => {
  const { data: payments = [], isLoading: loading, error } = useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: getAllPayments,
  });

  const stats = useMemo(() => {
    const total = payments.reduce((s, p) => s + (p.monto || 0), 0);
    const completed = payments.filter((p) => isCompleted(p.estado_transaccion));
    const completedTotal = completed.reduce((s, p) => s + (p.monto || 0), 0);
    return { total, completedCount: completed.length, completedTotal, pendingCount: payments.length - completed.length };
  }, [payments]);

  const columns = useMemo(() => [
    columnHelper.accessor('id_pago', {
      header: '#',
      cell: info => <span className="font-bold text-gray-900">{info.getValue()}</span>,
    }),
    columnHelper.accessor('fecha_pago', {
      header: 'Fecha',
      cell: info => <span className="text-gray-700 whitespace-nowrap">{info.getValue()?.split("T")[0] || "—"}</span>,
    }),
    columnHelper.accessor('monto', {
      header: 'Monto',
      cell: info => <span className="font-bold text-gray-900">S/ {(info.getValue() || 0).toFixed(2)}</span>,
    }),
    columnHelper.accessor('metodo_pago', {
      header: 'Método',
      cell: info => <span className="text-gray-700">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('estado_transaccion', {
      header: 'Estado',
      cell: info => {
        const val = info.getValue();
        return isCompleted(val) ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" /> Completado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
            <XCircle className="w-3.5 h-3.5" /> {val || "Pendiente"}
          </span>
        );
      },
    }),
    columnHelper.accessor('cita.paciente.nombre_completo', {
      id: 'paciente',
      header: 'Paciente',
      cell: info => <span className="text-gray-700">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('cita', {
      id: 'medico',
      header: 'Médico',
      cell: info => {
        const cita = info.getValue();
        const name = cita?.medico?.usuario ? `${cita.medico.usuario.nombres} ${cita.medico.usuario.apellidos}`.trim() : "—";
        return <span className="text-gray-700 whitespace-nowrap">{name}</span>;
      },
    }),
  ], []);

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <AdminTableSkeleton headerWidth="w-48" subtitleWidth="w-64" cards={3} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-lg font-bold text-gray-900">Error al cargar pagos</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-medi-500 text-white rounded-xl font-bold hover:bg-medi-600 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pagos</h2>
        <p className="text-gray-500 font-medium mt-1">Registro de todos los pagos realizados en el sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600">S/ {stats.completedTotal.toFixed(2)}</div>
            <div className="text-sm text-gray-500 font-medium">Ingresos Confirmados</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-blue-600">{stats.completedCount}</div>
            <div className="text-sm text-gray-500 font-medium">Pagos Completados</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-600">{stats.pendingCount}</div>
            <div className="text-sm text-gray-500 font-medium">Pendientes</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Todos los Pagos <span className="text-medi-500 font-extrabold">({payments.length})</span></h3>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
            <DollarSign className="w-10 h-10" />
            <p className="font-semibold text-sm">No hay pagos registrados</p>
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