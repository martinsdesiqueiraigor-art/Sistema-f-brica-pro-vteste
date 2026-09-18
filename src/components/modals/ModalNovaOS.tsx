import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { OrdemServico, Produto, StatusOrdem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  produtos: Produto[];
  osParaEditar: OrdemServico | null;
  onSalvar: (dados: {
    id?: string;
    cliente: string;
    produto: string;
    produtoId?: number;
    quantidade: number;
    valor: number;
    status: StatusOrdem;
    observacoes?: string;
  }) => void;
  onAbrirCadastroProduto: () => void;
}

export const ModalNovaOS: React.FC<Props> = ({
  isOpen,
  onClose,
  produtos,
  osParaEditar,
  onSalvar,
  onAbrirCadastroProduto,
}) => {
  const [cliente, setCliente] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valor, setValor] = useState<number | ''>('');
  const [status, setStatus] = useState<StatusOrdem>('planejado');
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (osParaEditar) {
      setCliente(osParaEditar.cliente);
      setProdutoSelecionado(osParaEditar.produto);
      setQuantidade(osParaEditar.quantidade);
      setValor(osParaEditar.valor);
      setStatus(osParaEditar.status);
      setObservacoes(osParaEditar.observacoes || '');
    } else {
      setCliente('');
      if (produtos.length > 0) {
        setProdutoSelecionado(produtos[0].nome);
      }
      setQuantidade(1);
      setValor('');
      setStatus('planejado');
      setObservacoes('');
    }
    setErro('');
  }, [osParaEditar, isOpen, produtos]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente.trim()) {
      setErro('O nome do cliente é obrigatório.');
      return;
    }
    const prodFinal = produtoSelecionado || produtos[0]?.nome;
    if (!prodFinal) {
      setErro('Selecione um produto para a OS.');
      return;
    }

    const produtoObj = produtos.find((p) => p.nome === prodFinal);

    onSalvar({
      id: osParaEditar ? osParaEditar.id : undefined,
      cliente: cliente.trim(),
      produto: prodFinal,
      produtoId: produtoObj?.id,
      quantidade: Math.max(1, quantidade),
      valor: typeof valor === 'number' ? valor : 0,
      status,
      observacoes,
    });

    onClose();
  };

  return (
    <div
      id="modalNovaOS"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modalNovaOSBox"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 id="modalTitleOS" className="text-xl font-bold flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-500">📝</span>
              {osParaEditar ? `Editar Ordem de Serviço ${osParaEditar.id}` : 'Nova Ordem de Serviço (OS)'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registro comercial e ordens de clientes
            </p>
          </div>
          <button
            id="btnFecharModalNovaOS"
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
          <div>
            <label htmlFor="fOSClienteInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cliente / Empresa Solicitante <span className="text-red-500">*</span>
            </label>
            <input
              id="fOSClienteInput"
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ex: Hidráulica Brasil Ltda, Vale S/A..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="fOSProdutoSelect" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Produto / Serviço Solicitado <span className="text-red-500">*</span>
              </label>
              <button
                id="btnCadastrarNovoProdutoOSInline"
                type="button"
                onClick={onAbrirCadastroProduto}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                + Novo Produto
              </button>
            </div>
            <select
              id="fOSProdutoSelect"
              value={produtoSelecionado}
              onChange={(e) => setProdutoSelecionado(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
              required
            >
              {produtos.map((p) => (
                <option key={p.id} value={p.nome}>
                  {p.nome} {p.codigo ? `(${p.codigo})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fOSQuantidadeInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                id="fOSQuantidadeInput"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="fOSValorInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Valor Total (R$)
              </label>
              <input
                id="fOSValorInput"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="0,00"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="fOSStatusSelect" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status da OS
            </label>
            <select
              id="fOSStatusSelect"
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusOrdem)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
            >
              <option value="planejado">📅 Planejado</option>
              <option value="producao">🔄 Em Produção</option>
              <option value="teste">🔬 Teste e Inspeção</option>
              <option value="pendente">⏳ Pendente</option>
              <option value="concluido">✅ Concluído / Faturado</option>
            </select>
          </div>

          <div>
            <label htmlFor="fOSObservacoesTextarea" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações
            </label>
            <textarea
              id="fOSObservacoesTextarea"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Requisitos de transporte, data limite de entrega pelo cliente..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              id="btnCancelarNovaOS"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btnSalvarNovaOS"
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {osParaEditar ? 'Atualizar OS' : 'Salvar OS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
