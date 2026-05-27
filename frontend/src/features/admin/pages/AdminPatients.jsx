import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { Users, AlertTriangle, Search } from "lucide-react";
import { getAllPatients } from "../../../services/api";
import { AdminTableSkeleton } from "../../../app/components/skeletons/AdminTableSkeleton";

const columnHelper = createColumnHelper();

export const AdminPatients = () => {
  const { data: patients = [], isLoading: loading, error } = useQuery({
    queryKey: ['admin', 'patients'],
    queryFn: getAllPatients,
  });

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter((p) => (
      p.nombre_completo?.toLowerCase().includes(q) ||
      p.dni_menor?.includes(q) ||
      p.cliente?.usuario?.nombres?.toLowerCase().includes(q)
    ));
  }, [patients, search]);

  const columns = useMemo(() => [
    columnHelper.accessor('nombre_completo', {
      header: 'Nombre',
      cell: info => <span className="font-bold text-gray-900">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('dni_menor', {
      header: 'DNI',
      cell: info => <span className="text-gray-700">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('fecha_nacimiento', {
      header: 'Fecha Nac.',
      cell: info => <span className="text-gray-700">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor('cliente', {
      header: 'Padre / Madre',
      cell: info => {
        const c = info.getValue();
        const name = c?.usuario?.nombres ? `${c.usuario.nombres} ${c.usuario.apellidos || ""}`.trim() : "—";
        return <span className="text-gray-700">{name}</span>;
      },
    }),
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <AdminTableSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-lg font-bold text-gray-900">Error al cargar pacientes</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-medi-500 text-white rounded-xl font-bold hover:bg-medi-600 transition-colors">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pacientes</h2>
        <p className="text-gray-500 font-medium mt-1">Lista de todos los pacientes registrados en el sistema.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Todos los Pacientes <span className="text-medi-500 font-extrabold">({patients.length})</span></h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:border-medi-400 focus:ring-2 focus:ring-medi-200 transition-all outline-none w-64"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
            <Users className="w-10 h-10" />
            <p className="font-semibold text-sm">No se encontraron pacientes</p>
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