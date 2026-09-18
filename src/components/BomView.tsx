import React from 'react';
import { Plus, Edit3, Trash2, Layers } from 'lucide-react';
import { BoM } from '../types';

interface Props {
  boms: BoM[];
  onAbrirNovaBom: () => void;
  onEditarBom: (bom: BoM) => void;
  onExcluirBom: (id: number) => void;
}

export const BomView: React.FC<Props> = ({
  boms,
  onAbrirNovaBom,
  onEditarBom,
  onExcluirBom,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📐</span> Estruturas de Produto (BoM - Bill of Materials)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lista técnica de componentes, subconjuntos e matérias-primas por produto
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirNovaBom}
          className="px-4 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova BoM</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boms.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            Nenhuma estrutura cadastrada.
          </div>
        ) : (
          boms.map((bom) => (
            <div
              key={bom.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔩</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{bom.nome}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {bom.componentes.length} itens
                </span>
              </div>

              {/* Árvore de Componentes */}
              <div className="py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                <div className="font-bold text-amber-700 dark:text-amber-400">
                  📦 {bom.nome} (1 unidade montada)
                </div>
                {bom.componentes.map((c, i) => (
                  <div key={i} className="pl-4 text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-400">├──</span>
                    <span>🔩 {c}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => onEditarBom(bom)}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onExcluirBom(bom.id)}
                  className="px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
