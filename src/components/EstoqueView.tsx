import React, { useState } from 'react';
import { Plus, ArrowDownUp, Search, Edit3, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MaterialEstoque } from '../types';

interface Props {
  materiais: MaterialEstoque[];
  onAbrirNovoMaterial: () => void;
  onAbrirMovimentacao: () => void;
  onEditarMaterial: (material: MaterialEstoque) => void;
  onExcluirMaterial: (id: number) => void;
}

export const EstoqueView: React.FC<Props> = ({
  materiais,
  onAbrirNovoMaterial,
  onAbrirMovimentacao,
  onEditarMaterial,
  onExcluirMaterial,
}) => {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');

  const filtrados = materiais.filter((m) => {
    if (categoriaFiltro !== 'todas' && m.categoria !== categoriaFiltro) return false;
    if (busca.trim()) {
      const b = busca.toLowerCase();
      return m.nome.toLowerCase().includes(b) || m.localizacao.toLowerCase().includes(b);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📦</span> Estoque & Almoxarifado
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Controle de matéria-prima, kits de vedação, insumos e produtos acabados
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="btnEstoqueMovimentar"
            type="button"
            onClick={onAbrirMovimentacao}
            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <ArrowDownUp className="w-4 h-4" />
            <span>📊 Movimentar (+/-)</span>
          </button>
          <button
            id="btnNovoMaterialHeader"
            type="button"
            onClick={onAbrirNovoMaterial}
            className="px-3.5 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Item</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar material ou localização..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 outline-hidden"
          />
        </div>

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="w-full sm:w-56 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          <option value="todas">Todas as Categorias</option>
          <option value="Matéria-prima">Matéria-prima</option>
          <option value="Produtos Acabados">Produtos Acabados</option>
          <option value="Insumos">Insumos</option>
          <option value="Componentes">Componentes</option>
        </select>
      </div>

      {/* Tabela de Estoque */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4">ITEM / MATERIAL</th>
              <th className="py-3 px-4">CATEGORIA</th>
              <th className="py-3 px-4">SALDO ATUAL</th>
              <th className="py-3 px-4">ESTOQUE MÍNIMO</th>
              <th className="py-3 px-4">LOCALIZAÇÃO</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtrados.map((m) => {
              const isBaixo = m.quantidade <= m.minimo;
              return (
                <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {m.nome}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                      {m.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {m.quantidade} <span className="text-xs font-normal text-slate-400">{m.unidade || 'un'}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {m.minimo} {m.unidade || 'un'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {m.localizacao || '-'}
                  </td>
                  <td className="py-3 px-4">
                    {isBaixo ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Crítico
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Normal
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditarMaterial(m)}
                        className="p-1.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onExcluirMaterial(m.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
