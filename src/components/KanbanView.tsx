import React, { useState } from 'react';
import { Plus, Play, CheckCircle2, Eye, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { OrdemProducao, StatusOrdem } from '../types';

interface Props {
  ordens: OrdemProducao[];
  onAbrirNovaOrdem: () => void;
  onAvancarEtapa: (id: string) => void;
  onFinalizarOrdem: (id: string) => void;
  onEditarOrdem: (ordem: OrdemProducao) => void;
  onExcluirOrdem: (id: string) => void;
  onMudarStatus: (id: string, novoStatus: StatusOrdem) => void;
}

const COLUNAS: { id: StatusOrdem; titulo: string; cor: string; borda: string; badge: string }[] = [
  {
    id: 'planejado',
    titulo: '📅 Planejado',
    cor: 'bg-blue-50/60 dark:bg-blue-950/20',
    borda: 'border-blue-200 dark:border-blue-900',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
  },
  {
    id: 'producao',
    titulo: '🔄 Em Produção',
    cor: 'bg-amber-50/60 dark:bg-amber-950/20',
    borda: 'border-amber-200 dark:border-amber-900',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
  },
  {
    id: 'teste',
    titulo: '🔬 Teste Hidráulico',
    cor: 'bg-purple-50/60 dark:bg-purple-950/20',
    borda: 'border-purple-200 dark:border-purple-900',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
  },
  {
    id: 'concluido',
    titulo: '✅ Concluído',
    cor: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    borda: 'border-emerald-200 dark:border-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
  },
];

export const KanbanView: React.FC<Props> = ({
  ordens,
  onAbrirNovaOrdem,
  onAvancarEtapa,
  onFinalizarOrdem,
  onEditarOrdem,
  onExcluirOrdem,
  onMudarStatus,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: StatusOrdem) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      onMudarStatus(id, targetStatus);
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📋</span> Kanban de Produção
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Arraste os cartões entre as colunas ou use os botões rápidos para avançar etapas
          </p>
        </div>

        <button
          id="btnKanbanNovaOrdem"
          type="button"
          onClick={onAbrirNovaOrdem}
          className="px-4 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Ordem (OP)</span>
        </button>
      </div>

      {/* Grid de Colunas Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUNAS.map((col) => {
          const cards = ordens.filter((o) => o.status === col.id);
          return (
            <div
              key={col.id}
              id={`kanbanColuna-${col.id}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-xl border ${col.borda} ${col.cor} p-3 min-h-[500px] flex flex-col transition-colors`}
            >
              {/* Cabeçalho da coluna */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{col.titulo}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                  {cards.length}
                </span>
              </div>

              {/* Lista de cartões */}
              <div className="space-y-3 flex-1">
                {cards.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-400 text-center p-4">
                    Nenhuma ordem nesta etapa.
                  </div>
                ) : (
                  cards.map((ordem) => (
                    <div
                      key={ordem.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ordem.id)}
                      className="bg-white dark:bg-slate-900 rounded-lg p-3.5 shadow-xs border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-500">
                            {ordem.id}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug">
                            {ordem.produto}
                          </h4>
                        </div>
                        {ordem.prioridade === 'urgente' && (
                          <span className="text-[9px] px-1 py-0.2 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 font-bold uppercase rounded-xs">
                            Urgente
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Quantidade:</span>
                          <strong className="text-slate-700 dark:text-slate-300">{ordem.quantidade} un</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Operador:</span>
                          <span>{ordem.operador}</span>
                        </div>
                        {ordem.etapaAtual && (
                          <div className="text-amber-600 dark:text-amber-400 text-[10px] font-medium pt-0.5 truncate">
                            ⚙️ {ordem.etapaAtual}
                          </div>
                        )}
                      </div>

                      {/* Barra de Progresso */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Progresso</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{ordem.progresso}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-300"
                            style={{ width: `${ordem.progresso}%` }}
                          />
                        </div>
                      </div>

                      {/* Botões de Ação do Card */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onEditarOrdem(ordem)}
                            title="Editar Ordem"
                            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onExcluirOrdem(ordem.id)}
                            title="Excluir Ordem"
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {ordem.status !== 'concluido' && (
                            <>
                              <button
                                type="button"
                                onClick={() => onAvancarEtapa(ordem.id)}
                                title="Avançar Etapa (+15%)"
                                className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-semibold flex items-center gap-0.5 shadow-xs"
                              >
                                <Play className="w-3 h-3" />
                                <span>+15%</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => onFinalizarOrdem(ordem.id)}
                                title="Concluir Ordem (100%)"
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {ordem.status === 'concluido' && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Liberada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
