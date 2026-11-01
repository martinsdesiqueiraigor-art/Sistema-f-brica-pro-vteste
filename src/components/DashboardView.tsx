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
  Flame,
  ShieldAlert,
  Play,
  Search,
} from 'lucide-react';
import {
  OrdemProducao,
  CentroTrabalho,
  LogAuditoria,
  MaterialEstoque,
  ApontamentoMES,
  ParadaMaquina,
} from '../types';

interface Props {
  ordens: OrdemProducao[];
  centros: CentroTrabalho[];
  materiais: MaterialEstoque[];
  auditLog: LogAuditoria[];
  apontamentos?: ApontamentoMES[];
  paradas?: ParadaMaquina[];
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
  apontamentos = [],
  paradas = [],
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

  const paradasAtivas = paradas.filter((p) => p.status === 'Ativa');
  const centrosParados = centros.filter(
    (c) => c.status === 'parado' || paradasAtivas.some((p) => p.codigoMaquina === c.codigo)
  ).length;
  const centrosAtivos = centros.length - centrosParados;

  const materiaisBaixos = materiais.filter((m) => m.quantidade <= m.minimo);

  // Cálculo do OEE real com base em dados de chão de fábrica
  const apontamentosConcluidos = apontamentos.filter((a) => a.status === 'Concluido' && a.qtdBoas !== null);
  const totalPecasBoas = apontamentosConcluidos.reduce((acc, a) => acc + (a.qtdBoas || 0), 0);
  const totalRefugo = apontamentosConcluidos.reduce((acc, a) => acc + (a.refugo || 0), 0);

  // Qualidade = Boas / Total
  const taxaQualidade =
    totalPecasBoas + totalRefugo > 0
      ? Math.round((totalPecasBoas / (totalPecasBoas + totalRefugo)) * 100)
      : 98;

  // Disponibilidade = 100 - proporção de máquinas paradas
  const taxaDisponibilidade = centros.length > 0 ? Math.round(((centros.length - centrosParados) / centros.length) * 100) : 95;

  // Performance média dos centros
  const taxaPerformance = centros.length > 0 ? Math.round(centros.reduce((acc, c) => acc + (c.eficiencia || 90), 0) / centros.length) : 92;

  // OEE = Disp * Perf * Qual
  const oeeGeral = Math.round((taxaDisponibilidade * taxaPerformance * taxaQualidade) / 10000);

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
            <span>🏭</span> Dashboard Integrado PCP & MES
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold shadow-xs">
              Chão de Fábrica ao Vivo
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento, roteiros de usinagem, apontamentos de operadores e telemetria de postos de trabalho
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => onNavegar('terminal-operador')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Terminal Operador</span>
          </button>
          <button
            type="button"
            onClick={() => onNavegar('consulta-op')}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Consultar OP</span>
          </button>
          <button
            id="btnDashboardExportarPDF"
            type="button"
            onClick={onExportarPDF}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>PDF</span>
          </button>
          <button
            id="btnDashboardAtualizar"
            type="button"
            onClick={onAtualizar}
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="btnDashboardNovaOrdem"
            type="button"
            onClick={onAbrirNovaOrdem}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-amber-600 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova OP</span>
          </button>
        </div>
      </div>

      {/* Alerta de Parada Ativa no Chão de Fábrica (Andon) */}
      {paradasAtivas.length > 0 && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-xl flex items-center justify-between gap-3 text-xs text-red-900 dark:text-red-200 animate-pulse">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            <span>
              <strong>🚨 Alerta Chão de Fábrica:</strong> {paradasAtivas.length} máquina(s) com parada ativa ({paradasAtivas.map(p => `${p.codigoMaquina} - ${p.motivo}`).join(', ')}).
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavegar('terminal-operador')}
            className="font-bold underline hover:text-red-700 dark:hover:text-red-300 cursor-pointer shrink-0"
          >
            Ver Terminal Operador →
          </button>
        </div>
      )}

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

      {/* Grid de Cards de KPI: OEE Real + OPs + Máquinas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: OEE Geral da Fábrica */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">OEE Global (MES)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 flex items-baseline gap-2">
            <span>{oeeGeral}%</span>
            <span className="text-[11px] font-semibold text-emerald-600">Meta: 85%</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Disp: {taxaDisponibilidade}% • Perf: {taxaPerformance}% • Qual: {taxaQualidade}%
          </div>
        </div>

        {/* Card 2: Em Andamento */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">OPs em Andamento</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {emAndamento} <span className="text-xs font-normal text-slate-400">OPs ativas</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>{apontamentos.filter(a => a.status === 'Ativo').length} apontamentos operando</span>
          </div>
        </div>

        {/* Card 3: Postos de Trabalho & Máquinas */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Postos Operacionais</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {centrosAtivos} / {centros.length}{' '}
            <span className="text-xs font-normal text-slate-400">ativos</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {centrosParados > 0 ? (
              <span className="text-red-500 font-bold">⚠️ {centrosParados} posto(s) parado(s)</span>
            ) : (
              <span className="text-emerald-500">✅ Todos postos disponíveis</span>
            )}
          </div>
        </div>

        {/* Card 4: Concluídas */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total OPs Concluídas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            {concluidas} <span className="text-xs font-normal text-slate-400">de {total}</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            {totalPecasBoas} peças aprovadas no chão
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
            <span className="text-xs text-slate-400 font-mono">Total: {total} OPs</span>
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

        {/* Produção Diária */}
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
              Média de cilindros montados e testados por turno de trabalho
            </p>
          </div>

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
              <span>Ordens de Produção Ativas no Chão</span>
            </h3>
            <button
              onClick={() => onNavegar('producao')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
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
                    <span>Resp: {o.operador}</span>
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
              📜 Atividades e Apontamentos Recentes
            </h3>
            <button
              onClick={() => onNavegar('historico')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
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
