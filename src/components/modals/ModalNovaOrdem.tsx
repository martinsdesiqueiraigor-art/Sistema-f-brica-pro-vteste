import React, { useState, useEffect } from 'react';
import { X, Plus, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { OrdemProducao, Produto, PrioridadeOrdem, StatusOrdem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  produtos: Produto[];
  ordemParaEditar: OrdemProducao | null;
  onSalvar: (dados: {
    id?: string;
    produto: string;
    produtoId?: number;
    serie: string;
    quantidade: number;
    dataInicio: string;
    previsaoEntrega?: string;
    status: StatusOrdem;
    operador: string;
    prioridade: PrioridadeOrdem;
    observacoes?: string;
  }) => void;
  onAbrirCadastroProduto: () => void;
}

const OPERADORES_DISPONIVEIS = [
  'Carlos Silva',
  'Mariana Costa',
  'José Santos',
  'Roberto Almeida',
  'Alexandre Souza',
  'Fernando Lima',
  'Beatriz Ramos',
  'Ana Paula',
];

export const ModalNovaOrdem: React.FC<Props> = ({
  isOpen,
  onClose,
  produtos,
  ordemParaEditar,
  onSalvar,
  onAbrirCadastroProduto,
}) => {
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  const [previsaoEntrega, setPrevisaoEntrega] = useState(
    new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<StatusOrdem>('producao');
  const [operador, setOperador] = useState('Carlos Silva');
  const [prioridade, setPrioridade] = useState<PrioridadeOrdem>('media');
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState('');

  // Ao abrir ou mudar ordem para editar
  useEffect(() => {
    if (ordemParaEditar) {
      setProdutoSelecionado(ordemParaEditar.produto);
      setQuantidade(ordemParaEditar.quantidade);
      setDataInicio(ordemParaEditar.dataInicio);
      setPrevisaoEntrega(ordemParaEditar.previsaoEntrega || '');
      setStatus(ordemParaEditar.status);
      setOperador(ordemParaEditar.operador);
      setPrioridade(ordemParaEditar.prioridade || 'media');
      setObservacoes(ordemParaEditar.observacoes || '');
    } else {
      // Se não estiver editando, seleciona o primeiro produto disponível
      if (produtos.length > 0 && !produtoSelecionado) {
        setProdutoSelecionado(produtos[0].nome);
      }
      setQuantidade(1);
      setDataInicio(new Date().toISOString().split('T')[0]);
      setPrevisaoEntrega(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
      setStatus('producao');
      setPrioridade('media');
      setObservacoes('');
    }
    setErro('');
  }, [ordemParaEditar, isOpen, produtos]);

  if (!isOpen) return null;

  // Produto atualmente selecionado no select
  const produtoObj = produtos.find((p) => p.nome === produtoSelecionado) || produtos[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoSelecionado && produtos.length === 0) {
      setErro('Cadastre pelo menos um produto no sistema antes de criar a OP.');
      return;
    }

    const prodFinal = produtoSelecionado || produtos[0]?.nome;
    if (!prodFinal) {
      setErro('Por favor, selecione um produto.');
      return;
    }

    if (quantidade < 1) {
      setErro('A quantidade deve ser de pelo menos 1 unidade.');
      return;
    }

    onSalvar({
      id: ordemParaEditar ? ordemParaEditar.id : undefined,
      produto: prodFinal,
      produtoId: produtoObj?.id,
      serie: produtoObj?.codigo || produtoObj?.categoria || 'Série Padrão',
      quantidade,
      dataInicio,
      previsaoEntrega,
      status,
      operador,
      prioridade,
      observacoes,
    });

    onClose();
  };

  return (
    <div
      id="modalNovaOrdem"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modalNovaOrdemBox"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 id="modalTitleOrdem" className="text-xl font-bold flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-500">📋</span>
              {ordemParaEditar ? `Editar Ordem de Produção ${ordemParaEditar.id}` : 'Nova Ordem de Produção (OP)'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Defina o produto do catálogo, quantidade e prazos de fabricação
            </p>
          </div>
          <button
            id="btnFecharModalNovaOrdem"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {erro && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* SELETOR DINÂMICO DE PRODUTO */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="fProdutoSelect" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                Produto / Peça a Fabricar <span className="text-red-500">*</span>
              </label>
              <button
                id="btnCadastrarNovoProdutoInline"
                type="button"
                onClick={() => {
                  onAbrirCadastroProduto();
                }}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                + Cadastrar Novo Produto
              </button>
            </div>

            <div className="relative">
              <select
                id="fProdutoSelect"
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium transition-all"
                required
              >
                {produtos.length === 0 ? (
                  <option value="">Nenhum produto cadastrado no catálogo</option>
                ) : (
                  produtos.map((p) => (
                    <option key={p.id} value={p.nome}>
                      {p.nome} {p.codigo ? `[${p.codigo}]` : ''} {p.categoria ? `• ${p.categoria}` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Pré-visualização do produto selecionado */}
            {produtoObj && (
              <div className="mt-2 p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-lg text-xs flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-amber-900 dark:text-amber-300">
                    {produtoObj.nome} {produtoObj.codigo ? `(Código: ${produtoObj.codigo})` : ''}
                  </div>
                  {produtoObj.spec && (
                    <div className="text-slate-600 dark:text-slate-400 whitespace-pre-line text-[11px] leading-relaxed">
                      {produtoObj.spec}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* QUANTIDADE & OPERADOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fQuantidadeInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantidade (unidades) <span className="text-red-500">*</span>
              </label>
              <input
                id="fQuantidadeInput"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="fOperadorSelect" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Responsável / Operador
              </label>
              <select
                id="fOperadorSelect"
                value={operador}
                onChange={(e) => setOperador(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
              >
                {OPERADORES_DISPONIVEIS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DATAS: INÍCIO E PREVISÃO DE ENTREGA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fDataInicioInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Data de Início <span className="text-red-500">*</span>
              </label>
              <input
                id="fDataInicioInput"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label htmlFor="fPrevisaoEntregaInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Previsão de Entrega
              </label>
              <input
                id="fPrevisaoEntregaInput"
                type="date"
                value={previsaoEntrega}
                onChange={(e) => setPrevisaoEntrega(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              />
            </div>
          </div>

          {/* STATUS E PRIORIDADE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fStatusSelect" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status Inicial
              </label>
              <select
                id="fStatusSelect"
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusOrdem)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
              >
                <option value="planejado">📅 Planejado (Aguardando)</option>
                <option value="producao">🔄 Em Produção (Chão de Fábrica)</option>
                <option value="teste">🔬 Teste Hidráulico / Controle</option>
                <option value="pendente">⏳ Pendente / Parado</option>
                <option value="concluido">✅ Concluído (100%)</option>
              </select>
            </div>

            <div>
              <label htmlFor="fPrioridadeSelect" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Prioridade
              </label>
              <select
                id="fPrioridadeSelect"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as PrioridadeOrdem)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
              >
                <option value="baixa">🟢 Baixa</option>
                <option value="media">🟡 Média</option>
                <option value="alta">🟠 Alta</option>
                <option value="urgente">🔴 Urgente (Prioridade PCP)</option>
              </select>
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          <div>
            <label htmlFor="fObservacoesTextarea" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações Técnicas da OP
            </label>
            <textarea
              id="fObservacoesTextarea"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Tolerância crítica no mandrilamento, cliente solicitou teste com óleo especial..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              id="btnCancelarNovaOrdem"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btnSalvarNovaOrdem"
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {ordemParaEditar ? 'Atualizar Ordem' : 'Criar Ordem (OP)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
