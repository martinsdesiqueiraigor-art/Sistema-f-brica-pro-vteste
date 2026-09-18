import React from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { InspecaoQualidade } from '../types';

interface Props {
  inspecoes: InspecaoQualidade[];
  onAbrirNovaInspecao: () => void;
  onEditarInspecao: (inspecao: InspecaoQualidade) => void;
  onExcluirInspecao: (id: number) => void;
}

export const QualidadeView: React.FC<Props> = ({
  inspecoes,
  onAbrirNovaInspecao,
  onEditarInspecao,
  onExcluirInspecao,
}) => {
  const aprovados = inspecoes.filter((i) => i.resultado === 'aprovado').length;
  const reprovados = inspecoes.filter((i) => i.resultado === 'reprovado').length;
  const pendentes = inspecoes.filter((i) => i.resultado === 'pendente').length;
  const taxaAprovacao = inspecoes.length > 0 ? Math.round((aprovados / inspecoes.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>✅</span> Controle de Qualidade & Testes
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inspeções dimensionais, laudos hidráulicos de estanqueidade e testes funcionais
          </p>
        </div>

        <button
          type="button"
          onClick={onAbrirNovaInspecao}
          className="px-4 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Inspeção</span>
        </button>
      </div>

      {/* KPIs de Qualidade */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Aprovados</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{aprovados}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Pendentes</span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendentes}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Reprovados</span>
          <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1">{reprovados}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block">Taxa de Conformidade</span>
          <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{taxaAprovacao}%</div>
        </div>
      </div>

      {/* Lista de Inspeções */}
      <div className="space-y-3">
        {inspecoes.map((i) => (
          <div
            key={i.id}
            className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-600">#{i.id}</span>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{i.produto}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  Teste: {i.tipo}
                </span>
              </div>
              {i.observacoes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic pl-6">{i.observacoes}</p>
              )}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {i.resultado === 'aprovado' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                </span>
              )}
              {i.resultado === 'reprovado' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Reprovado
                </span>
              )}
              {i.resultado === 'pendente' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pendente
                </span>
              )}

              <button
                type="button"
                onClick={() => onEditarInspecao(i)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onExcluirInspecao(i.id)}
                className="p-1.5 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
