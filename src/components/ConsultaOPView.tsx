import React, { useState } from 'react';
import {
  Search,
  Printer,
  FileDown,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  AlertTriangle,
  Barcode,
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { OrdemProducao, ApontamentoMES, EtapaExecucaoOP } from '../types';

interface Props {
  ordens: OrdemProducao[];
  apontamentos: ApontamentoMES[];
}

export const ConsultaOPView: React.FC<Props> = ({ ordens, apontamentos }) => {
  const [opSelecionadaId, setOpSelecionadaId] = useState<string>(ordens[0]?.id || '');
  const [modalImprimirOpen, setModalImprimirOpen] = useState(false);

  const opAtual = ordens.find((o) => o.id === opSelecionadaId) || ordens[0];
  const apontamentosOP = apontamentos.filter(
    (a) => a.numOp === opAtual?.id && a.status === 'Concluido' && a.qtdBoas !== null
  );

  const totalProduzido = apontamentosOP.reduce((acc, a) => acc + (a.qtdBoas || 0), 0);
  const totalRefugo = apontamentosOP.reduce((acc, a) => acc + (a.refugo || 0), 0);
  const taxaAproveitamento =
    totalProduzido + totalRefugo > 0
      ? Math.round((totalProduzido / (totalProduzido + totalRefugo)) * 100)
      : 100;

  const exportarCSVOP = () => {
    if (!opAtual || apontamentosOP.length === 0) {
      alert('Nenhum apontamento para exportar nesta OP.');
      return;
    }

    let csv = 'OP,Etapa,Descricao,Operador,Maquina,Pecas_Boas,Refugo,Data_Inicio,Data_Fim\n';
    apontamentosOP.forEach((a) => {
      csv += `${a.numOp},${a.numeroEtapa},"${a.descricaoEtapa}","${a.operadorNome} (${a.operadorMatricula})",${a.codigoMaquina},${a.qtdBoas},${a.refugo},${a.dataHoraInicio},${a.dataHoraFim || ''}\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apontamentos_${opAtual.id}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Seletor de OP */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🔍</span> Consulta & Rastreabilidade de OP
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Histórico completo de apontamentos, saldo de etapas e folha de processo do chão de fábrica
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Selecionar OP:
          </label>
          <select
            value={opSelecionadaId}
            onChange={(e) => setOpSelecionadaId(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500 min-w-[200px]"
          >
            {ordens.map((o) => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.produto} ({o.status.toUpperCase()})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setModalImprimirOpen(true)}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            title="Imprimir folha de processo da OP"
          >
            <Printer className="w-4 h-4" />
            <span>Ficha de Fabricação</span>
          </button>
        </div>
      </div>

      {opAtual ? (
        <>
          {/* Informações Gerais da OP */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {opAtual.id}
                  </span>
                  <span className="text-base font-bold text-slate-700 dark:text-slate-200">
                    {opAtual.produto}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      opAtual.status === 'concluido'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : opAtual.status === 'producao'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : opAtual.status === 'teste'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opAtual.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Desenho Técnico: <strong className="text-slate-700 dark:text-slate-300">{opAtual.numeroDesenho || 'DES-001'}</strong> • Série: {opAtual.serie} • Início: {opAtual.dataInicio}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {opAtual.progresso}%
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Progresso da OP</div>
              </div>
            </div>

            {/* Grid de Resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Meta Total</span>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {opAtual.quantidade} peças
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Peças Apontadas</span>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {totalProduzido} un
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Refugo Total</span>
                <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-0.5">
                  {totalRefugo} un
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Rendimento / Yield</span>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {taxaAproveitamento}%
                </p>
              </div>
            </div>
          </div>

          {/* Etapas de Execução do Roteiro */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>Etapas de Execução da OP</span>
            </h3>

            {opAtual.etapas && opAtual.etapas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Etapa</th>
                      <th className="py-2.5 px-3">Descrição da Operação</th>
                      <th className="py-2.5 px-3">Máquina Padrão</th>
                      <th className="py-2.5 px-3 text-right">Tempo Ciclo</th>
                      <th className="py-2.5 px-3 text-right">Saldo Residual</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {opAtual.etapas.map((et) => (
                      <tr key={et.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">
                          Etapa {et.numeroEtapa}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100">
                          {et.descricaoEtapa}
                        </td>
                        <td className="py-3 px-3 font-mono font-medium">{et.codigoMaquinaPadrao}</td>
                        <td className="py-3 px-3 text-right text-slate-500">{et.tempoCicloMinutos} min</td>
                        <td className="py-3 px-3 text-right font-bold">
                          <span
                            className={
                              et.saldoResidual === 0
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }
                          >
                            {et.saldoResidual} un
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              et.statusExecucao === 'Concluída'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : et.statusExecucao === 'Em Execução'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {et.statusExecucao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4">Nenhuma etapa individual cadastrada nesta OP.</p>
            )}
          </div>

          {/* Tabela de Apontamentos de Chão de Fábrica */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Apontamentos Realizados pelos Operadores</span>
              </h3>

              {apontamentosOP.length > 0 && (
                <button
                  type="button"
                  onClick={exportarCSVOP}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              )}
            </div>

            {apontamentosOP.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Nenhum apontamento finalizado registrado para esta OP até o momento.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Data / Hora</th>
                      <th className="py-2.5 px-3">Operador</th>
                      <th className="py-2.5 px-3">Etapa</th>
                      <th className="py-2.5 px-3">Máquina</th>
                      <th className="py-2.5 px-3 text-right">Peças Boas</th>
                      <th className="py-2.5 px-3 text-right">Refugo</th>
                      <th className="py-2.5 px-3">Observações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {apontamentosOP.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {new Date(a.dataHoraInicio).toLocaleDateString('pt-BR')}{' '}
                          {new Date(a.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3 font-medium">
                          {a.operadorNome} <span className="text-slate-400 font-normal">#{a.operadorMatricula}</span>
                        </td>
                        <td className="py-2.5 px-3">Etapa {a.numeroEtapa} - {a.descricaoEtapa}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{a.codigoMaquina}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {a.qtdBoas} un
                        </td>
                        <td className="py-2.5 px-3 text-right text-red-600 font-semibold">
                          {a.refugo > 0 ? `${a.refugo} un` : '0'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 italic">
                          {a.motivoRefugo || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-center py-10 text-slate-400">Selecione uma Ordem de Produção acima.</p>
      )}

      {/* Modal / Visualização de Impressão da Ficha de Produção */}
      {modalImprimirOpen && opAtual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8 text-black font-mono">
            {/* Cabeçalho da Ordem */}
            <div className="border-b-2 border-black pb-4 text-center">
              <h1 className="text-2xl font-black uppercase tracking-wider">🏭 SISTEMA FÁBRICA PRO - MES / PCP</h1>
              <h2 className="text-base font-bold mt-1 text-slate-800">ORDEM DE PRODUÇÃO & FICHA DE CHÃO DE FÁBRICA</h2>
              <p className="text-xs text-slate-600 mt-1">
                Documento de rastreabilidade de processo para fabricação mecânica e hidráulica
              </p>
            </div>

            {/* Dados Principais */}
            <div className="grid grid-cols-2 gap-4 py-5 border-b border-black text-xs">
              <div>
                <p><strong>Nº DA ORDEM (OP):</strong> {opAtual.id}</p>
                <p className="mt-1"><strong>PRODUTO:</strong> {opAtual.produto}</p>
                <p className="mt-1"><strong>DESENHO Nº:</strong> {opAtual.numeroDesenho || 'DES-001'}</p>
                <p className="mt-1"><strong>SÉRIE TÉCNICA:</strong> {opAtual.serie}</p>
              </div>
              <div>
                <p><strong>QUANTIDADE PROGRAMADA:</strong> {opAtual.quantidade} peças</p>
                <p className="mt-1"><strong>DATA DE CRIAÇÃO:</strong> {opAtual.dataInicio}</p>
                <p className="mt-1"><strong>STATUS:</strong> {opAtual.status.toUpperCase()}</p>
                <p className="mt-1"><strong>RESPONSÁVEL PCP:</strong> {opAtual.operador}</p>
              </div>
            </div>

            {/* Roteiro e Etapas */}
            <div className="py-5">
              <h3 className="text-sm font-bold uppercase mb-3 text-slate-900">
                📋 Roteiro de Operações & Rastreabilidade Chão de Fábrica
              </h3>
              <table className="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-black p-2 text-left">Etapa</th>
                    <th className="border border-black p-2 text-left">Operação</th>
                    <th className="border border-black p-2 text-left">Máquina</th>
                    <th className="border border-black p-2 text-right">Tempo (min)</th>
                    <th className="border border-black p-2 text-center">Visto Operador</th>
                    <th className="border border-black p-2 text-center">Data / Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {opAtual.etapas?.map((et) => (
                    <tr key={et.id}>
                      <td className="border border-black p-2 font-bold">{et.numeroEtapa}</td>
                      <td className="border border-black p-2">{et.descricaoEtapa}</td>
                      <td className="border border-black p-2">{et.codigoMaquinaPadrao}</td>
                      <td className="border border-black p-2 text-right">{et.tempoCicloMinutos} min</td>
                      <td className="border border-black p-2 text-center text-slate-400">
                        {et.statusExecucao === 'Concluída' ? '✅ OK' : '_______________'}
                      </td>
                      <td className="border border-black p-2 text-center text-slate-400">
                        {et.statusExecucao === 'Concluída' ? 'Concluído' : '__/__/____ __:__'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Campo de Assinaturas */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-black text-center text-xs">
              <div>
                <div className="border-t border-black w-3/4 mx-auto pt-1 font-bold">Operador Responsável</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Apontamento de início e fim no terminal</p>
              </div>
              <div>
                <div className="border-t border-black w-3/4 mx-auto pt-1 font-bold">Inspetor de Qualidade / Supervisor</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Liberação final e teste de pressão</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 no-print">
              <button
                type="button"
                onClick={() => setModalImprimirOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleImprimir}
                className="px-5 py-2 rounded-lg bg-black text-white text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
