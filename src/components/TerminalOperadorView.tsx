import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  User,
  RotateCcw,
  ShieldAlert,
  Flame,
  Check,
  X,
  History,
  Timer,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  OrdemProducao,
  CentroTrabalho,
  ApontamentoMES,
  ParadaMaquina,
  OperadorMES,
  EtapaExecucaoOP,
} from '../types';

interface Props {
  ordens: OrdemProducao[];
  centros: CentroTrabalho[];
  operadores: OperadorMES[];
  apontamentos: ApontamentoMES[];
  paradas: ParadaMaquina[];
  operadorAtivo: OperadorMES;
  onMudarOperador: (op: OperadorMES) => void;
  onIniciarProducao: (numOp: string, numeroEtapa: number, codigoMaquina: string) => void;
  onFecharApontamento: (id: number, qtdBoas: number, refugo: number, motivoRefugo?: string) => void;
  onRegistrarParada: (codigoMaquina: string, motivo: ParadaMaquina['motivo'], observacoes?: string) => void;
  onRetomarParada: (id: number) => void;
}

export const TerminalOperadorView: React.FC<Props> = ({
  ordens,
  centros,
  operadores,
  apontamentos,
  paradas,
  operadorAtivo,
  onMudarOperador,
  onIniciarProducao,
  onFecharApontamento,
  onRegistrarParada,
  onRetomarParada,
}) => {
  // Estado do formulário de início
  const [opSelecionada, setOpSelecionada] = useState<string>('');
  const [etapaSelecionada, setEtapaSelecionada] = useState<number | ''>('');
  const [maquinaSelecionada, setMaquinaSelecionada] = useState<string>('');

  // Estado do modal/card de fechamento de apontamento
  const [apontamentoParaFechar, setApontamentoParaFechar] = useState<ApontamentoMES | null>(null);
  const [qtdBoasInput, setQtdBoasInput] = useState<number>(0);
  const [refugoInput, setRefugoInput] = useState<number>(0);
  const [motivoRefugoInput, setMotivoRefugoInput] = useState<string>('');

  // Estado do formulário de parada de máquina
  const [paradaMaquinaCodigo, setParadaMaquinaCodigo] = useState<string>('');
  const [paradaMotivo, setParadaMotivo] = useState<ParadaMaquina['motivo']>('Setup / Troca de Dispositivo');
  const [paradaObs, setParadaObs] = useState<string>('');

  // Timer para atualizar o tempo decorrido ao vivo
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtrar OPs ativas que possuem etapas com saldo residual > 0
  const opsDisponiveis = ordens.filter(
    (o) => o.status !== 'concluido' && (o.etapas?.some((e) => e.saldoResidual > 0) ?? true)
  );

  // Etapas disponíveis para a OP selecionada
  const ordemAtual = ordens.find((o) => o.id === opSelecionada);
  const etapasDisponiveis = ordemAtual?.etapas?.filter((e) => e.saldoResidual > 0) || [];

  // Definir máquina padrão ao selecionar a etapa
  useEffect(() => {
    if (etapaSelecionada !== '' && ordemAtual?.etapas) {
      const etapaObj = ordemAtual.etapas.find((e) => e.numeroEtapa === etapaSelecionada);
      if (etapaObj?.codigoMaquinaPadrao) {
        setMaquinaSelecionada(etapaObj.codigoMaquinaPadrao);
      }
    }
  }, [etapaSelecionada, ordemAtual]);

  // Atividades ativas do operador atual
  const atividadesAtivas = apontamentos.filter(
    (a) => a.operadorMatricula === operadorAtivo.matricula && a.status === 'Ativo'
  );

  // Paradas ativas de máquinas
  const paradasAtivas = paradas.filter((p) => p.status === 'Ativa');

  // Histórico do turno atual (apontamentos fechados do operador hoje)
  const hojeStr = new Date().toISOString().split('T')[0];
  const historicoHoje = apontamentos.filter(
    (a) =>
      a.operadorMatricula === operadorAtivo.matricula &&
      a.status === 'Concluido' &&
      a.dataHoraInicio.startsWith(hojeStr)
  );

  const totalProduzidoHoje = historicoHoje.reduce((acc, a) => acc + (a.qtdBoas || 0), 0);
  const totalRefugoHoje = historicoHoje.reduce((acc, a) => acc + (a.refugo || 0), 0);

  // Formatação de duração em HH:MM:SS
  const formatarDuracao = (inicioIso: string) => {
    const inicio = new Date(inicioIso).getTime();
    const agora = Date.now();
    const diffSeg = Math.max(0, Math.floor((agora - inicio) / 1000));
    const horas = Math.floor(diffSeg / 3600);
    const minutos = Math.floor((diffSeg % 3600) / 60);
    const segundos = diffSeg % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  };

  const handleIniciar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opSelecionada || etapaSelecionada === '' || !maquinaSelecionada) {
      alert('Selecione a OP, a etapa do roteiro e a máquina.');
      return;
    }
    onIniciarProducao(opSelecionada, Number(etapaSelecionada), maquinaSelecionada);
    // Limpar seleção
    setEtapaSelecionada('');
  };

  const abrirModalFechar = (ap: ApontamentoMES) => {
    setApontamentoParaFechar(ap);
    // Sugerir saldo residual da etapa como padrão se disponível
    const op = ordens.find((o) => o.id === ap.numOp);
    const etapa = op?.etapas?.find((e) => e.numeroEtapa === ap.numeroEtapa);
    const saldoSugerido = etapa?.saldoResidual ?? 1;
    setQtdBoasInput(saldoSugerido > 0 ? saldoSugerido : 1);
    setRefugoInput(0);
    setMotivoRefugoInput('');
  };

  const handleConfirmarFechamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apontamentoParaFechar) return;

    if (qtdBoasInput < 0 || refugoInput < 0) {
      alert('Quantidades não podem ser negativas.');
      return;
    }

    if (qtdBoasInput === 0 && refugoInput === 0) {
      alert('Informe ao menos 1 peça boa ou 1 refugo.');
      return;
    }

    onFecharApontamento(
      apontamentoParaFechar.id,
      qtdBoasInput,
      refugoInput,
      refugoInput > 0 ? motivoRefugoInput : undefined
    );
    setApontamentoParaFechar(null);
  };

  const handleDispararParada = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paradaMaquinaCodigo) {
      alert('Selecione qual máquina está parando.');
      return;
    }
    onRegistrarParada(paradaMaquinaCodigo, paradaMotivo, paradaObs);
    setParadaMaquinaCodigo('');
    setParadaObs('');
  };

  return (
    <div className="space-y-6">
      {/* Topo do Terminal: Operador Ativo e Quick Switch */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-xl font-bold shadow-md shadow-amber-500/20">
            🧑‍🔧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">{operadorAtivo.nome}</h2>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Matrícula #{operadorAtivo.matricula}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>🏭 Terminal MES Chão de Fábrica</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{operadorAtivo.turno}</span>
            </p>
          </div>
        </div>

        {/* Troca Rápida de Operador */}
        <div className="flex items-center gap-2.5 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
          <User className="w-4 h-4 text-slate-400 ml-1" />
          <span className="text-xs text-slate-400 font-medium">Trocar:</span>
          <select
            value={operadorAtivo.matricula}
            onChange={(e) => {
              const op = operadores.find((o) => o.matricula === e.target.value);
              if (op) onMudarOperador(op);
            }}
            className="bg-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 outline-none focus:border-amber-500"
          >
            {operadores.map((op) => (
              <option key={op.matricula} value={op.matricula}>
                {op.nome} (#{op.matricula} - {op.turno})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Rápidos do Chão de Fábrica */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{atividadesAtivas.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Atividades Ativas</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalProduzidoHoje}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Peças Boas Hoje</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalRefugoHoje}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Refugos Registrados</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalProduzidoHoje + totalRefugoHoje > 0
                ? `${Math.round((totalProduzidoHoje / (totalProduzidoHoje + totalRefugoHoje)) * 100)}%`
                : '100%'}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Qualidade do Turno</div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Iniciar Produção + Atividades em Andamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel 1: Iniciar Produção */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-500" />
                <span>Iniciar Produção (Apontamento)</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-medium">
                Ponto de Trabalho
              </span>
            </div>

            <form onSubmit={handleIniciar} className="space-y-4">
              {/* Seleção de OP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1. Selecione a Ordem de Produção (OP) *
                </label>
                <select
                  value={opSelecionada}
                  onChange={(e) => {
                    setOpSelecionada(e.target.value);
                    setEtapaSelecionada('');
                  }}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                  required
                >
                  <option value="">-- Selecione uma OP em andamento --</option>
                  {opsDisponiveis.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.id} - {op.produto} (Meta: {op.quantidade} un | {op.progresso}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção da Etapa com Saldo Residual */}
              {opSelecionada && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    2. Etapa do Roteiro de Fabricação *
                  </label>
                  {etapasDisponiveis.length > 0 ? (
                    <select
                      value={etapaSelecionada}
                      onChange={(e) => setEtapaSelecionada(Number(e.target.value))}
                      className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                      required
                    >
                      <option value="">-- Selecione a Etapa do Roteiro --</option>
                      {etapasDisponiveis.map((et) => (
                        <option key={et.id} value={et.numeroEtapa}>
                          Etapa {et.numeroEtapa}: {et.descricaoEtapa} (Saldo Residual: {et.saldoResidual} peças | Máq: {et.codigoMaquinaPadrao})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-700 dark:text-amber-300">
                      ⚠️ Todas as etapas cadastradas desta OP já foram concluídas ou ela não possui etapas residuais.
                    </div>
                  )}
                </div>
              )}

              {/* Seleção da Máquina / Centro */}
              {opSelecionada && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    3. Máquina / Posto Operacional *
                  </label>
                  <select
                    value={maquinaSelecionada}
                    onChange={(e) => setMaquinaSelecionada(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">-- Selecione a Máquina --</option>
                    {centros.map((c) => {
                      const isParada = paradasAtivas.some((p) => p.codigoMaquina === c.codigo);
                      return (
                        <option key={c.id} value={c.codigo} disabled={isParada}>
                          {c.codigo} - {c.nome} {isParada ? '⛔ (PARADA)' : '✅ (DISPONÍVEL)'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={!opSelecionada || etapaSelecionada === '' || !maquinaSelecionada}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Cronômetro de Produção</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>O início registra o timestamp exato para cálculo do tempo de ciclo real e OEE.</span>
          </div>
        </div>

        {/* Painel 2: Atividades Ativas em Andamento */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />
                <span>Atividades em Andamento</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-semibold">
                {atividadesAtivas.length} Operando
              </span>
            </div>

            {atividadesAtivas.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Clock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs font-medium">Nenhuma atividade ativa no momento para este operador.</p>
                <p className="text-[11px] text-slate-500 mt-1">Selecione uma OP ao lado e clique em Iniciar Produção.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {atividadesAtivas.map((ap) => (
                  <div
                    key={ap.id}
                    className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                            {ap.numOp}
                          </span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
                            Etapa {ap.numeroEtapa}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            Máquina: {ap.codigoMaquina}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                          {ap.descricaoEtapa}
                        </p>
                      </div>

                      {/* Cronômetro Dinâmico */}
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatarDuracao(ap.dataHoraInicio)}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Tempo decorrido</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-blue-100 dark:border-blue-900/40">
                      <span className="text-[11px] text-slate-500">
                        Início às {new Date(ap.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => abrirModalFechar(ap)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Fechar / Apontar Peças</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Ao concluir, aponte as peças boas e refugo para atualizar o saldo residual da OP.</span>
          </div>
        </div>
      </div>

      {/* Painel 3: Gestão de Paradas de Máquina (Andon / Stoppage Management) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-red-200 dark:border-red-950 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-100 dark:border-red-950 mb-4">
          <div>
            <h3 className="text-base font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>🚨 Gestão de Paradas de Máquina (Andon)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Acione paradas para alertar manutenção, logística ou liderança e pausar o OEE da máquina.
            </p>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold self-start sm:self-auto">
            {paradasAtivas.length} Máquina(s) Parada(s)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário para Disparar Parada */}
          <form onSubmit={handleDispararParada} className="space-y-3 bg-red-50/50 dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/40">
            <h4 className="text-xs font-bold text-red-900 dark:text-red-300 uppercase tracking-wider">
              Disparar Nova Parada
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Máquina a Interromper *
              </label>
              <select
                value={paradaMaquinaCodigo}
                onChange={(e) => setParadaMaquinaCodigo(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-red-500"
                required
              >
                <option value="">-- Selecione a Máquina --</option>
                {centros.map((c) => (
                  <option key={c.id} value={c.codigo}>
                    {c.codigo} - {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Motivo da Interrupção *
              </label>
              <select
                value={paradaMotivo}
                onChange={(e) => setParadaMotivo(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-red-500"
              >
                <option value="Falta de Matéria-Prima">Falta de Matéria-Prima</option>
                <option value="Quebra de Ferramenta / Componente">Quebra de Ferramenta / Componente</option>
                <option value="Setup / Troca de Dispositivo">Setup / Troca de Dispositivo</option>
                <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                <option value="Aguardando Inspeção de Qualidade">Aguardando Inspeção de Qualidade</option>
                <option value="Outro">Outro Motivo</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Observações Adicionais
              </label>
              <input
                type="text"
                placeholder="Ex: Quebra da pastilha de corte ou vazamento"
                value={paradaObs}
                onChange={(e) => setParadaObs(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Registrar Parada Imediata</span>
            </button>
          </form>

          {/* Lista de Paradas Ativas no Chão de Fábrica */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Máquinas Interrompidas Atualmente
            </h4>

            {paradasAtivas.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-emerald-300 dark:border-emerald-900 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Excelente! Nenhuma máquina com parada ativa neste momento. Parque 100% operacional.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {paradasAtivas.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg border border-red-300 dark:border-red-900 bg-red-50/70 dark:bg-red-950/30 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-red-800 dark:text-red-300">
                          {p.codigoMaquina}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                          • {p.motivo}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 font-mono font-bold">
                          {formatarDuracao(p.dataHoraInicio)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Acionado por {p.operadorNome} às {new Date(p.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        {p.observacoes ? ` — "${p.observacoes}"` : ''}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRetomarParada(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Retomar Produção</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Histórico do Dia do Operador */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span>Histórico de Apontamentos Realizados Hoje ({operadorAtivo.nome})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Total apontado: {totalProduzidoHoje} peças boas
          </span>
        </div>

        {historicoHoje.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Nenhum apontamento finalizado hoje para este operador.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">OP</th>
                  <th className="py-2.5 px-3">Etapa</th>
                  <th className="py-2.5 px-3">Máquina</th>
                  <th className="py-2.5 px-3 text-right">Peças Boas</th>
                  <th className="py-2.5 px-3 text-right">Refugo</th>
                  <th className="py-2.5 px-3">Horário</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {historicoHoje.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">{item.numOp}</td>
                    <td className="py-2.5 px-3">{item.descricaoEtapa} (Etapa {item.numeroEtapa})</td>
                    <td className="py-2.5 px-3 font-mono">{item.codigoMaquina}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {item.qtdBoas} un
                    </td>
                    <td className="py-2.5 px-3 text-right text-red-600 dark:text-red-400 font-semibold">
                      {item.refugo > 0 ? `${item.refugo} un` : '0'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(item.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {item.dataHoraFim ? ` ➔ ${new Date(item.dataHoraFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        ✅ Fechado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Dialog de Fechamento de Apontamento */}
      {apontamentoParaFechar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Fechar Apontamento - {apontamentoParaFechar.numOp}</span>
              </h3>
              <button
                type="button"
                onClick={() => setApontamentoParaFechar(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-4 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Operação: </span>
                <span className="font-bold">{apontamentoParaFechar.descricaoEtapa} (Etapa {apontamentoParaFechar.numeroEtapa})</span>
              </div>
              <div>
                <span className="text-slate-500">Máquina: </span>
                <span className="font-mono font-semibold">{apontamentoParaFechar.codigoMaquina}</span>
                <span className="text-slate-500 ml-3">Duração: </span>
                <span className="font-mono font-bold text-blue-600">{formatarDuracao(apontamentoParaFechar.dataHoraInicio)}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmarFechamento} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                    ✅ Peças Boas Aprovadas *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={qtdBoasInput}
                    onChange={(e) => setQtdBoasInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-base font-bold p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500 text-center"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                    ❌ Peças Refugadas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={refugoInput}
                    onChange={(e) => setRefugoInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-base font-bold p-2.5 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 outline-none focus:ring-2 focus:ring-red-500 text-center"
                  />
                </div>
              </div>

              {refugoInput > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Motivo do Refugo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rebarba excessiva, risco na haste, cota fora"
                    value={motivoRefugoInput}
                    onChange={(e) => setMotivoRefugoInput(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-red-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApontamentoParaFechar(null)}
                  className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Confirmar e Baixar Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
