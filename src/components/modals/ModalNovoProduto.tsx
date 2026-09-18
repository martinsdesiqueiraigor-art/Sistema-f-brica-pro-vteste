import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Produto } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  produtoParaEditar: Produto | null;
  onSalvar: (dados: {
    id?: number;
    nome: string;
    codigo: string;
    categoria: string;
    spec: string;
  }) => void;
}

const CATEGORIAS_PADRAO = [
  'Cilindros Hidráulicos',
  'Equipamentos',
  'Máquinas',
  'Hidráulica',
  'Componentes',
  'Kits de Reparo',
  'Outros',
];

export const ModalNovoProduto: React.FC<Props> = ({
  isOpen,
  onClose,
  produtoParaEditar,
  onSalvar,
}) => {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState('Cilindros Hidráulicos');
  const [spec, setSpec] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (produtoParaEditar) {
      setNome(produtoParaEditar.nome);
      setCodigo(produtoParaEditar.codigo);
      setCategoria(produtoParaEditar.categoria || 'Cilindros Hidráulicos');
      setSpec(produtoParaEditar.spec || '');
    } else {
      setNome('');
      setCodigo('');
      setCategoria('Cilindros Hidráulicos');
      setSpec('');
    }
    setErro('');
  }, [produtoParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErro('O nome do produto é obrigatório.');
      return;
    }

    onSalvar({
      id: produtoParaEditar ? produtoParaEditar.id : undefined,
      nome: nome.trim(),
      codigo: codigo.trim() || `PRD-${Math.floor(100 + Math.random() * 900)}`,
      categoria,
      spec: spec.trim(),
    });

    onClose();
  };

  return (
    <div
      id="modalNovoProduto"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modalNovoProdutoBox"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 id="modalTitleProduto" className="text-xl font-bold flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-500">🔩</span>
              {produtoParaEditar ? `Editar Produto: ${produtoParaEditar.nome}` : 'Cadastrar Novo Produto no Catálogo'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fica imediatamente disponível para criação de Ordens de Produção (OP), Roteiro e BoM
            </p>
          </div>
          <button
            id="btnFecharModalNovoProduto"
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
            <label htmlFor="fProdutoNomeInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              id="fProdutoNomeInput"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Guindaste, Filetadora 100, Cilindro Dupla Ação..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fProdutoCodigoInput" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Código / Referência
              </label>
              <input
                id="fProdutoCodigoInput"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: Gui 001, FI 100, CH-150"
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="fProdutoCategoriaSelect" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoria
              </label>
              <select
                id="fProdutoCategoriaSelect"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
              >
                {CATEGORIAS_PADRAO.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="fProdutoSpecTextarea" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Especificações Técnicas / Notas
            </label>
            <textarea
              id="fProdutoSpecTextarea"
              rows={3}
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              placeholder="Ex: Diâmetro: 150mm&#10;Pressão: 300 bar&#10;Curso: 800mm"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden font-mono text-xs"
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
              Dica: Digite uma especificação por linha no formato &quot;Chave: Valor&quot; para formatação automática em cards.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              id="btnCancelarNovoProduto"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btnSalvarNovoProduto"
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {produtoParaEditar ? 'Atualizar Produto' : 'Salvar no Catálogo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
