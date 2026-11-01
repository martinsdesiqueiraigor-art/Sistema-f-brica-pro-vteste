import React from 'react';
import { Plus, Edit3, Trash2, Wrench, Activity, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CentroTrabalho, ParadaMaquina } from '../types';

interface Props {
  centros: CentroTrabalho[];
  paradas?: ParadaMaquina[];
  onAbrirNovoCentro: () => void;
  onEditarCentro: (centro: CentroTrabalho) => void;
  onExcluirCentro: (id: number) => void;
  onAlternarStatus?: (id: number, novoStatus: 'Ativa' | 'Parada' | 'Manutenção') => void;
}

export const WorkcentersView: React.FC<Props> = ({
  centros,
  paradas = [],
  onAbrirNovoCentro,
  onEditarCentro,
  onExcluirCentro,
  onAlternarStatus,
}) => {
  const paradasAtivas = paradas.filter((p) => p.status === 'Ativa');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🔧</span> Postos de Trabalho & Máquinas (MES)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gestão de máquinas, códigos operacionais, capacidade diária e status de parada em tempo real
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirNovoCentro}
          className="px-4 py-2 bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Máquina / Centro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {centros.map((c) => {
          const paradaAtiva = paradasAtivas.find((p) => p.codigoMaquina === c.codigo);
          const isParada = Boolean(paradaAtiva) || c.status === 'parado' || c.statusOperacional === 'Parada';
          const isManutencao = c.status === 'manutencao' || c.statusOperacional === 'Manutenção';

          return (
            <div
              key={c.id}
              className={`bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-xs space-y-3 flex flex-col justify-between transition-all ${
                isParada
                  ? 'border-red-400 dark:border-red-800 bg-red-50/20 dark:bg-red-950/20'
                  : isManutencao
                  ? 'border-amber-400 dark:border-amber-800'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {c.codigo || `M-${c.id}`}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{c.nome}</h3>
                  </div>

                  {isParada ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>PARADA</span>
                    </span>
                  ) : isManutencao ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      MANUTENÇÃO
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ATIVA</span>
                    </span>
                  )}
                </div>

                {paradaAtiva && (
                  <div className="mt-2 p-2 rounded bg-red-100 dark:bg-red-950/60 text-[11px] text-red-800 dark:text-red-200 font-medium">
                    🚨 <strong>Motivo da parada:</strong> {paradaAtiva.motivo}
                  </div>
                )}

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
                      <span className="text-[10px] uppercase text-slate-400 block font-semibold">Operador Padrão</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{c.operador}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {onAlternarStatus ? (
                  <select
                    value={isParada ? 'Parada' : isManutencao ? 'Manutenção' : 'Ativa'}
                    onChange={(e) => onAlternarStatus(c.id, e.target.value as any)}
                    className="text-[11px] p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    <option value="Ativa">🟢 Ativa</option>
                    <option value="Parada">🔴 Parada</option>
                    <option value="Manutenção">🟡 Manutenção</option>
                  </select>
                ) : <span />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEditarCentro(c)}
                    className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onExcluirCentro(c.id)}
                    className="px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
