import React, { useState } from 'react';
import { Plus, FileDown, Search, Edit3, Trash2 } from 'lucide-react';
import { OrdemServico, StatusOrdem } from '../types';

interface Props {
  ordensServico: OrdemServico[];
  onAbrirNovaOS: () => void;
  onEditarOS: (os: OrdemServico) => void;
  onExcluirOS: (id: string) => void;
  onExportarPDF: () => void;
}

export const OrdensServicoView: React.FC<Props> = ({
  ordensServico,
  onAbrirNovaOS,
  onEditarOS,
  onExcluirOS,
  onExportarPDF,
}) => {
  const [busca, setBusca] = useState('');

  const filtradas = ordensServico.filter((os) => {
    if (!busca.trim()) return true;
    const b = busca.toLowerCase();
    return os.id.toLowerCase().includes(b) || os.cliente.toLowerCase().includes(b) || os.produto.toLowerCase().includes(b);
  });

  const getStatusBadge = (status: StatusOrdem) => {
    switch (status) {
      case 'producao':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">🔄 Em Produção</span>;
      case 'teste':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">🔬 Teste</span>;
      case 'concluido':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">✅ Concluído</span>;
      case 'planejado':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">📅 Planejado</span>;
      case 'pendente':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">⏳ Pendente</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📋</span> Ordens de Serviço (OS)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Acompanhamento comercial, vendas e pedidos de clientes
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="btnOSExportarPDF"
            type="button"
            onClick={onExportarPDF}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Exportar PDF</span>
          </button>
          <button
            id="btnNovaOSHeader"
            type="button"
            onClick={onAbrirNovaOS}
            className="px-4 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova OS</span>
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por cliente, número da OS ou produto..."
          className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-hidden"
        />
      </div>

      {/* Tabela de OS */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4">OS</th>
              <th className="py-3 px-4">CLIENTE</th>
              <th className="py-3 px-4">PRODUTO</th>
              <th className="py-3 px-4">QTD</th>
              <th className="py-3 px-4">DATA</th>
              <th className="py-3 px-4">VALOR (R$)</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Nenhuma ordem de serviço cadastrada.
                </td>
              </tr>
            ) : (
              filtradas.map((os) => (
                <tr
                  key={os.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-500">
                    {os.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {os.cliente}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {os.produto}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {os.quantidade} un
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {os.data}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    R$ {os.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(os.status)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditarOS(os)}
                        title="Editar OS"
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onExcluirOS(os.id)}
                        title="Excluir OS"
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
