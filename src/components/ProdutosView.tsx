import React from 'react';
import { Plus, Edit3, Trash2, Package, Sparkles, Layers, GitBranch, ArrowRight } from 'lucide-react';
import { Produto } from '../types';

interface Props {
  produtos: Produto[];
  onAbrirNovoProduto: () => void;
  onEditarProduto: (produto: Produto) => void;
  onExcluirProduto: (id: number) => void;
  onCriarOpDoProduto: (produtoNome: string) => void;
  onCriarRoteiroDoProduto?: (produtoId: number, produtoNome: string) => void;
}

export const ProdutosView: React.FC<Props> = ({
  produtos,
  onAbrirNovoProduto,
  onEditarProduto,
  onExcluirProduto,
  onCriarOpDoProduto,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🔩</span> Catálogo de Produtos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cadastro de cilindros, equipamentos e máquinas integrados ao PCP
          </p>
        </div>

        <button
          id="btnNovoProdutoHeader"
          type="button"
          onClick={onAbrirNovoProduto}
          className="px-4 py-2 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Produto</span>
        </button>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            Nenhum produto cadastrado no catálogo.
            <div className="mt-3">
              <button
                onClick={onAbrirNovoProduto}
                className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg"
              >
                Cadastrar Primeiro Produto
              </button>
            </div>
          </div>
        ) : (
          produtos.map((p) => {
            const specLinhas = p.spec ? p.spec.split('\n').filter((s) => s.trim()) : [];

            return (
              <div
                key={p.id}
                id={`cardProduto-${p.id}`}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  {/* Topo do Card */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔩</span>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                          {p.nome}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          Cód: <strong className="text-slate-600 dark:text-slate-300">{p.codigo || 'N/A'}</strong>
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Ativo
                    </span>
                  </div>

                  {/* Grid de Especificações */}
                  <div className="pt-3">
                    {specLinhas.length > 0 ? (
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {specLinhas.map((linha, idx) => {
                          const parts = linha.split(':');
                          if (parts.length >= 2) {
                            const chave = parts[0].trim();
                            const valor = parts.slice(1).join(':').trim();
                            return (
                              <div
                                key={idx}
                                className="p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80"
                              >
                                <span className="text-[10px] uppercase text-slate-400 font-semibold block leading-tight">
                                  {chave}
                                </span>
                                <strong className="text-slate-800 dark:text-slate-200 text-xs truncate block font-mono">
                                  {valor}
                                </strong>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={idx}
                              className="col-span-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300"
                            >
                              {linha}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-400 italic">
                        Sem especificações cadastradas.
                      </div>
                    )}
                  </div>
                </div>

                {/* Botões do Card */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onCriarOpDoProduto(p.nome)}
                    className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>+ Criar Nova Ordem (OP)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => onEditarProduto(p)}
                      className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-medium flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onExcluirProduto(p.id)}
                      className="px-2.5 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md font-medium flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
