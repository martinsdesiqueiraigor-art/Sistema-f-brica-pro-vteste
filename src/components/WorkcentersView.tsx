import React from 'react';
import { Plus, Edit3, Trash2, Wrench, Activity, UserCheck } from 'lucide-react';
import { CentroTrabalho } from '../types';

interface Props {
  centros: CentroTrabalho[];
  onAbrirNovoCentro: () => void;
  onEditarCentro: (centro: CentroTrabalho) => void;
  onExcluirCentro: (id: number) => void;
}

export const WorkcentersView: React.FC<Props> = ({
  centros,
  onAbrirNovoCentro,
  onEditarCentro,
  onExcluirCentro,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🔧</span> Centros de Trabalho & Máquinas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestão de capacidade nominal, OEE/eficiência e operadores alocados
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirNovoCentro}
          className="px-4 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Centro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {centros.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔧</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{c.nome}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {c.status || 'Ativo'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Capacidade</span>
                  <strong className="text-slate-800 dark:text-slate-200">{c.capacidade} peças/dia</strong>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">Eficiência OEE</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">{c.eficiencia}%</strong>
                </div>
                <div className="col-span-2 p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Operador Titular</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{c.operador}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => onEditarCentro(c)}
                className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              <button
                type="button"
                onClick={() => onExcluirCentro(c.id)}
                className="px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
