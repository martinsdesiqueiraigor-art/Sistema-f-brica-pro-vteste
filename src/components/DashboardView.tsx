import React from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Wrench,
  Package,
  Plus,
  FileDown,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { OrdemProducao, CentroTrabalho, LogAuditoria, MaterialEstoque } from '../types';

interface Props {
  ordens: OrdemProducao[];
  centros: CentroTrabalho[];
  materiais: MaterialEstoque[];
  auditLog: LogAuditoria[];
  onAbrirNovaOrdem: () => void;
  onExportarPDF: () => void;
  onAtualizar: () => void;
  onNavegar: (pagina: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  ordens,
  centros,
  materiais,
  auditLog,
  onAbrirNovaOrdem,
  onExportarPDF,
  onAtualizar,
  onNavegar,
}) => {
  const emAndamento = ordens.filter((o) => o.status === 'producao' || o.status === 'teste').length;
  const concluidas = ordens.filter((o) => o.status === 'concluido').length;
  const planejadas = ordens.filter((o) => o.status === 'planejado').length;
  const pendentes = ordens.filter((o) => o.status === 'pendente').length;
  const total = ordens.length;

  const centrosAtivos = centros.filter((c) => (c.status || 'ativo') === 'ativo').length;
  const materiaisBaixos = materiais.filter((m) => m.quantidade <= m.minimo);

  // Status breakdown percentages
  const statusStats = [
    { label: 'Em Produção', count: ordens.filter((o) => o.status === 'producao').length, color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
    { label: 'Em Teste', count: ordens.filter((o) => o.status === 'teste').length, color: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
    { label: 'Concluídas', count: concluidas, color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Planejadas', count: planejadas, color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
    { label: 'Pendentes', count: pendentes, color: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  ];

  const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Hoje'];

  return (
    <div className="space-y-6">
      {/* Topo do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📊</span> Dashboard Geral PCP
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-medium">
              Chão de Fábrica
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visão consolidada de produção, centros de usinagem e ordens em tempo real
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btnDashboardExportarPDF"
            type="button"
            onClick={onExportarPDF}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Exportar PDF</span>
          </button>
          <button
            id="btnDashboardAtualizar"
            type="button"
            onClick={onAtualizar}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="btnDashboardNovaOrdem"
            type="button"
            onClick={onAbrirNovaOrdem}
            className="px-4 py-1.5 rounded-lg bg-slate-800 dark:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Ordem (OP)</span>
          </button>
        </div>
      </div>

      {/* Alerta de Estoque Mínimo (se houver) */}
      {materiaisBaixos.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Alerta de Estoque:</strong> {materiaisBaixos.length} material(is) atingiram ou estão abaixo do estoque mínimo de segurança!
            </span>
          </div>
          <button
            onClick={() => onNavegar('estoque')}
            className="font-bold underline hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer shrink-0"
          >
            Ver Estoque →
          </button>
        </div>
      )}

      {/* Grid de 4 Cards de KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Em Andamento */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Em Andamento</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {emAndamento} <span className="text-xs font-normal text-slate-400">OPs</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Na linha de montagem e teste</span>
          </div>
        </div>

        {/* Card 2: Concluídas */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {concluidas} <span className="text-xs font-normal text-slate-400">peças</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            100% inspecionadas e liberadas
          </div>
        </div>

        {/* Card 3: Centros de Trabalho */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Centros de Usinagem</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {centrosAtivos} <span className="text-xs font-normal text-slate-400">ativos</span>
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
            Capacidade média ~93%
          </div>
        </div>

        {/* Card 4: Total de Ordens */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Ordens (OP)</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {total} <span className="text-xs font-normal text-slate-400">registradas</span>
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
            {planejadas} planejadas / aguardando
          </div>
        </div>
      </div>

      {/* Gráficos / Indicadores Visuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Status */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              📊 Distribuição de Ordens por Status
            </h3>
            <span className="text-xs text-slate-400 font-mono">Total: {total}</span>
          </div>

          <div className="space-y-3">
            {statusStats.map((st, i) => {
              const perc = total > 0 ? Math.round((st.count / total) * 100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{st.label}</span>
                    <span className="text-slate-500 font-mono">
                      {st.count} un ({perc}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${st.color} transition-all duration-500`}
                      style={{ width: `${perc}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Produção Diária (Simulada / Histórico recente) */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                📈 Ritmo de Conclusão Diária
              </h3>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18% esta semana
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Média de peças entregues e testadas por turno de trabalho
            </p>
          </div>

          {/* Gráfico de barras estilizado com Tailwind */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-2 h-36">
              {[8, 12, 10, 15, 14, 6, concluidas || 9].map((val, idx) => {
                const maxVal = 20;
                const heightPerc = Math.min(100, Math.round((val / maxVal) * 100));
                const isToday = idx === diasSemana.length - 1;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-500 transition-colors">
                      {val}
                    </span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                        isToday
                          ? 'bg-amber-600 dark:bg-amber-500 shadow-md'
                          : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPerc}%` }}
                    />
                    <span className={`text-[10px] ${isToday ? 'font-bold text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                      {diasSemana[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Seção: OPs em Destaque & Últimas Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ordens em Andamento Recentes */}
        <div className="lg:col-span-2 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Ordens de Produção Ativas
            </h3>
            <button
              onClick={() => onNavegar('producao')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Ver todas ({ordens.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {ordens.slice(0, 4).map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{o.id}</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{o.produto}</span>
                    {o.prioridade === 'urgente' && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 rounded-sm font-semibold uppercase">
                        Urgente
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>{o.quantidade} un</span>
                    <span>•</span>
                    <span>Op: {o.operador}</span>
                    {o.etapaAtual && (
                      <>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400">{o.etapaAtual}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right min-w-[100px]">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{o.progresso}%</div>
                  <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1 inline-block">
                    <div
                      className="h-full bg-amber-600 dark:bg-amber-500 rounded-full"
                      style={{ width: `${o.progresso}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Atividades / Log de Auditoria */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              📜 Atividades Recentes
            </h3>
            <button
              onClick={() => onNavegar('historico')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Auditoria →
            </button>
          </div>

          <div className="space-y-3">
            {auditLog.slice(0, 5).map((log) => (
              <div key={log.id} className="text-xs pb-2 border-b border-slate-100 dark:border-slate-800/80 last:border-0">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{log.usuario}</span>
                  <span>{new Date(log.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{log.acao}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{log.detalhes}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
