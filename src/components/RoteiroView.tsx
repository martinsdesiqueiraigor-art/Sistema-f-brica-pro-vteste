import React from 'react';
import { Plus, GitBranch, Wrench, Clock, FileDown, Edit3, Trash2 } from 'lucide-react';
import { RoteiroProduto } from '../types';

interface Props {
  roteiros: RoteiroProduto[];
  onAbrirNovoRoteiroProduto: () => void;
  onAbrirNovoComponente: (roteiroId?: number) => void;
  onAbrirNovaOperacao: (roteiroId?: number, componenteId?: number) => void;
  onEditarOperacao: (roteiroId: number, componenteId: number, operacaoId: number) => void;
  onExcluirOperacao: (roteiroId: number, componenteId: number, operacaoId: number) => void;
  onExcluirComponente: (roteiroId: number, componenteId: number) => void;
  onExcluirRoteiro: (roteiroId: number) => void;
  onExportarPDF: () => void;
}

export const RoteiroView: React.FC<Props> = ({
  roteiros,
  onAbrirNovoRoteiroProduto,
  onAbrirNovoComponente,
  onAbrirNovaOperacao,
  onEditarOperacao,
  onExcluirOperacao,
  onExcluirComponente,
  onExcluirRoteiro,
  onExportarPDF,
}) => {
  const totalOperacoes = roteiros.reduce(
    (acc, r) => acc + r.componentes.reduce((acc2, c) => acc2 + c.operacoes.length, 0),
    0
  );
  const totalComponentes = roteiros.reduce((acc, r) => acc + r.componentes.length, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🔄</span> Roteiro de Fabricação & Engenharia
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Estrutura de operações: Produto → Componentes → Operações e Centros de Trabalho
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <button
            id="btnRoteiroExportarPDF"
            type="button"
            onClick={onExportarPDF}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Exportar PDF</span>
          </button>
          <button
            id="btnNovoRoteiroProduto"
            type="button"
            onClick={onAbrirNovoRoteiroProduto}
            className="px-3.5 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>📦 + Produto</span>
          </button>
          <button
            id="btnNovoComponenteRoteiro"
            type="button"
            onClick={() => onAbrirNovoComponente()}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>🔩 + Componente</span>
          </button>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span>
            Produtos com Roteiro: <strong>{roteiros.length}</strong>
          </span>
          <span>•</span>
          <span>
            Componentes: <strong>{totalComponentes}</strong>
          </span>
          <span>•</span>
          <span>
            Operações Padrão: <strong>{totalOperacoes}</strong>
          </span>
        </div>
        <span className="text-slate-400">
          💡 Os tempos definidos aqui são utilizados para calcular a ocupação de máquinas e prazos de OPs
        </span>
      </div>

      {/* Lista de Roteiros por Produto */}
      <div className="space-y-6">
        {roteiros.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            Nenhum roteiro cadastrado.
            <div className="mt-3">
              <button
                onClick={onAbrirNovoRoteiroProduto}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg"
              >
                Vincular Primeiro Produto
              </button>
            </div>
          </div>
        ) : (
          roteiros.map((roteiro) => {
            let tempoTotal = 0;
            roteiro.componentes.forEach((comp) => {
              comp.operacoes.forEach((op) => {
                tempoTotal += op.tempo;
              });
            });
            const horas = Math.floor(tempoTotal / 60);
            const minutos = tempoTotal % 60;

            return (
              <div
                key={roteiro.id}
                className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                {/* Header do Produto no Roteiro */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📦</span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                        {roteiro.produtoNome}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {roteiro.componentes.length} componentes • {tempoTotal} min (~{horas}h {minutos}min tempo total)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAbrirNovoComponente(roteiro.id)}
                      className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Componente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onExcluirRoteiro(roteiro.id)}
                      title="Excluir Roteiro Completo"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lista de Componentes do Produto */}
                <div className="p-4 space-y-4">
                  {roteiro.componentes.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                      Nenhum componente adicionado a este produto ainda.{' '}
                      <button
                        onClick={() => onAbrirNovoComponente(roteiro.id)}
                        className="text-amber-600 font-bold underline"
                      >
                        Adicionar Componente
                      </button>
                    </div>
                  ) : (
                    roteiro.componentes.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-2.5"
                      >
                        {/* Header do Componente */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-600 dark:text-amber-500 font-bold">🔩</span>
                            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                              {comp.nome}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                              {comp.operacoes.length} ops
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onAbrirNovaOperacao(roteiro.id, comp.id)}
                              className="px-2 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Op</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onExcluirComponente(roteiro.id, comp.id)}
                              title="Excluir Componente"
                              className="p-1 text-slate-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Tabela de Operações do Componente */}
                        <div className="space-y-1.5 pt-1">
                          {comp.operacoes.length === 0 ? (
                            <div className="text-[11px] text-slate-400 italic pl-6">
                              Nenhuma operação cadastrada para este componente.
                            </div>
                          ) : (
                            comp.operacoes.map((op, opIdx) => (
                              <div
                                key={op.id}
                                className="flex items-center justify-between gap-3 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-md border border-slate-200/60 dark:border-slate-800 text-xs hover:border-slate-300 transition-colors"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="font-mono text-slate-400 text-[11px] font-bold">
                                    #{opIdx + 1}
                                  </span>
                                  <div className="truncate">
                                    <strong className="text-slate-800 dark:text-slate-200">{op.titulo}</strong>
                                    {op.descricao && (
                                      <span className="text-slate-400 text-[11px] ml-2 hidden sm:inline truncate">
                                        • {op.descricao}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                    {op.centro}
                                  </span>
                                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-500">
                                    {op.tempo} min
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onEditarOperacao(roteiro.id, comp.id, op.id)}
                                    title="Editar Operação"
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onExcluirOperacao(roteiro.id, comp.id, op.id)}
                                    title="Excluir Operação"
                                    className="p-1 text-slate-400 hover:text-red-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
