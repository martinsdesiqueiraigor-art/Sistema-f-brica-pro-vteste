import React, { useState } from 'react';
import { Plus, Play, CheckCircle2, Edit3, Trash2, Search, Filter, GitBranch, Calendar } from 'lucide-react';
import { OrdemProducao, StatusOrdem, Produto } from '../types';

interface Props {
  ordens: OrdemProducao[];
  produtos: Produto[];
  onAbrirNovaOrdem: () => void;
  onAvancarEtapa: (id: string) => void;
  onFinalizarOrdem: (id: string) => void;
  onEditarOrdem: (ordem: OrdemProducao) => void;
  onExcluirOrdem: (id: string) => void;
  onVerRoteiroProduto: (produtoNome: string) => void;
}

export const ProducaoView: React.FC<Props> = ({
  ordens,
  produtos,
  onAbrirNovaOrdem,
  onAvancarEtapa,
  onFinalizarOrdem,
  onEditarOrdem,
  onExcluirOrdem,
  onVerRoteiroProduto,
}) => {
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  const ordensFiltradas = ordens.filter((o) => {
    if (filtroStatus !== 'todos' && o.status !== filtroStatus) return false;
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      const matchId = o.id.toLowerCase().includes(termo);
      const matchProd = o.produto.toLowerCase().includes(termo);
      const matchOp = o.operador.toLowerCase().includes(termo);
      return matchId || matchProd || matchOp;
    }
    return true;
  });

  const getStatusBadge = (status: StatusOrdem) => {
    switch (status) {
      case 'producao':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">🔄 Em Produção</span>;
      case 'teste':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">🔬 Teste Hidráulico</span>;
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
            <span>🏭</span> Gestão de Ordens de Produção (OP)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Acompanhe o apontamento de chão de fábrica, lotes e etapas de fabricação
          </p>
        </div>

        <button
          id="btnProducaoNovaOrdem"
          type="button"
          onClick={onAbrirNovaOrdem}
          className="px-4 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Ordem de Produção</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por OP, produto ou operador..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="w-full sm:w-48 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="todos">Todos os Status ({ordens.length})</option>
            <option value="producao">Em Produção</option>
            <option value="teste">Em Teste</option>
            <option value="planejado">Planejadas</option>
            <option value="concluido">Concluídas</option>
            <option value="pendente">Pendentes</option>
          </select>
        </div>
      </div>

      {/* Lista de Ordens em Cards Elegantes */}
      <div className="space-y-3">
        {ordensFiltradas.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            Nenhuma ordem de produção encontrada com os filtros selecionados.
            <div className="mt-3">
              <button
                onClick={onAbrirNovaOrdem}
                className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg"
              >
                Criar Nova Ordem Agora
              </button>
            </div>
          </div>
        ) : (
          ordensFiltradas.map((ordem) => (
            <div
              key={ordem.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-extrabold text-sm text-amber-600 dark:text-amber-500">
                    {ordem.id}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {ordem.produto}
                  </h3>
                  {ordem.prioridade === 'urgente' && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 font-bold uppercase rounded-xs">
                      Urgente
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {getStatusBadge(ordem.status)}
                  <button
                    type="button"
                    onClick={() => onVerRoteiroProduto(ordem.produto)}
                    title="Ver Roteiro de Fabricação deste Produto"
                    className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditarOrdem(ordem)}
                    title="Editar Ordem"
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onExcluirOrdem(ordem.id)}
                    title="Excluir Ordem"
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Informações detalhadas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Lote / Qtd</span>
                  <strong className="text-slate-800 dark:text-slate-200 text-sm">{ordem.quantidade} unidades</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Início / Entrega</span>
                  <span className="font-medium">{ordem.dataInicio}</span>
                  {ordem.previsaoEntrega && (
                    <span className="text-slate-400 text-[11px] block">Até {ordem.previsaoEntrega}</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Operador</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{ordem.operador}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Etapa Atual</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 truncate block">
                    {ordem.etapaAtual || 'Em execução'}
                  </span>
                </div>
              </div>

              {/* Barra de Progresso e Ações Rápidas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex-1 max-w-md">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-medium">Progresso de Fabricação</span>
                    <strong className="text-slate-800 dark:text-slate-200">{ordem.progresso}%</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 dark:bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${ordem.progresso}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {ordem.status !== 'concluido' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onAvancarEtapa(ordem.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Avançar Etapa (+15%)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onFinalizarOrdem(ordem.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluir</span>
                      </button>
                    </>
                  )}
                  {ordem.status === 'concluido' && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Concluída e Inspecionada
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
};
