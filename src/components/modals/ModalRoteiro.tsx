import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Produto, RoteiroProduto, CentroTrabalho } from '../../types';

// Modal para adicionar Produto ao Roteiro
export const ModalNovoRoteiroProduto: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  produtos: Produto[];
  roteiros: RoteiroProduto[];
  onSalvar: (produtoId: number, produtoNome: string) => void;
}> = ({ isOpen, onClose, produtos, roteiros, onSalvar }) => {
  const produtosComRoteiro = roteiros.map((r) => r.produtoId);
  const produtosDisponiveis = produtos.filter((p) => !produtosComRoteiro.includes(p.id));

  const [produtoId, setProdutoId] = useState<number>(produtosDisponiveis[0]?.id || 0);

  if (!isOpen) return null;

  return (
    <div
      id="modalNovoRoteiroProduto"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>📦</span> Vincular Produto ao Roteiro
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {produtosDisponiveis.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">
            Todos os produtos cadastrados já possuem roteiro de fabricação configurado.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const p = produtos.find((x) => x.id === Number(produtoId)) || produtosDisponiveis[0];
              if (p) {
                onSalvar(p.id, p.nome);
                onClose();
              }
            }}
            className="mt-4 space-y-4"
          >
            <div>
              <label htmlFor="fRoteiroProdutoSelect" className="block text-sm font-semibold mb-1">
                Selecione o Produto *
              </label>
              <select
                id="fRoteiroProdutoSelect"
                value={produtoId || produtosDisponiveis[0]?.id}
                onChange={(e) => setProdutoId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              >
                {produtosDisponiveis.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} {p.codigo ? `(${p.codigo})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                Cancelar
              </button>
              <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md">
                Criar Roteiro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Modal para adicionar Componente ao Roteiro
export const ModalNovoComponente: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  roteiros: RoteiroProduto[];
  roteiroPreSelecionadoId?: number;
  onSalvar: (roteiroId: number, nomeComponente: string) => void;
}> = ({ isOpen, onClose, roteiros, roteiroPreSelecionadoId, onSalvar }) => {
  const [roteiroId, setRoteiroId] = useState<number>(roteiroPreSelecionadoId || roteiros[0]?.id || 0);
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  return (
    <div
      id="modalNovoComponenteRoteiro"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🔩</span> Novo Componente no Roteiro
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {erro && (
          <div className="mt-3 p-2 bg-red-50 text-red-600 rounded text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {erro}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!nome.trim()) {
              setErro('Nome do componente é obrigatório.');
              return;
            }
            const rId = roteiroId || roteiroPreSelecionadoId || roteiros[0]?.id;
            onSalvar(rId, nome.trim());
            setNome('');
            onClose();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="fComponenteRoteiroSelect" className="block text-sm font-semibold mb-1">
              Produto *
            </label>
            <select
              id="fComponenteRoteiroSelect"
              value={roteiroId || roteiroPreSelecionadoId || roteiros[0]?.id}
              onChange={(e) => setRoteiroId(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            >
              {roteiros.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.produtoNome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fComponenteNomeInput" className="block text-sm font-semibold mb-1">
              Nome do Componente *
            </label>
            <input
              id="fComponenteNomeInput"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Camisa, Haste, Pistão, Lança..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md">
              Salvar Componente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para adicionar/editar Operação no Roteiro
export const ModalNovaOperacao: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  roteiros: RoteiroProduto[];
  centros: CentroTrabalho[];
  preSelected?: { roteiroId: number; componenteId: number; operacaoId?: number } | null;
  onSalvar: (dados: {
    roteiroId: number;
    componenteId: number;
    operacaoId?: number;
    titulo: string;
    descricao: string;
    centro: string;
    tempo: number;
  }) => void;
}> = ({ isOpen, onClose, roteiros, centros, preSelected, onSalvar }) => {
  const [roteiroId, setRoteiroId] = useState<number>(preSelected?.roteiroId || roteiros[0]?.id || 0);
  const roteiroAtual = roteiros.find((r) => r.id === roteiroId) || roteiros[0];

  const [componenteId, setComponenteId] = useState<number>(
    preSelected?.componenteId || roteiroAtual?.componentes[0]?.id || 0
  );

  const operacaoEdit = preSelected?.operacaoId
    ? roteiroAtual?.componentes
        .find((c) => c.id === preSelected.componenteId)
        ?.operacoes.find((o) => o.id === preSelected.operacaoId)
    : null;

  const [titulo, setTitulo] = useState(operacaoEdit?.titulo || '');
  const [descricao, setDescricao] = useState(operacaoEdit?.descricao || '');
  const [centro, setCentro] = useState(operacaoEdit?.centro || centros[0]?.nome || 'Corte');
  const [tempo, setTempo] = useState(operacaoEdit?.tempo || 15);
  const [erro, setErro] = useState('');

  // Sincronizar se preSelected mudar
  React.useEffect(() => {
    if (preSelected) {
      setRoteiroId(preSelected.roteiroId);
      setComponenteId(preSelected.componenteId);
      if (operacaoEdit) {
        setTitulo(operacaoEdit.titulo);
        setDescricao(operacaoEdit.descricao || '');
        setCentro(operacaoEdit.centro);
        setTempo(operacaoEdit.tempo);
      } else {
        setTitulo('');
        setDescricao('');
        setTempo(15);
      }
    }
  }, [preSelected, operacaoEdit]);

  if (!isOpen) return null;

  return (
    <div
      id="modalNovaOperacaoRoteiro"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>⚙️</span> {operacaoEdit ? 'Editar Operação' : 'Nova Operação no Roteiro'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {erro && (
          <div className="mt-3 p-2 bg-red-50 text-red-600 rounded text-xs flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {erro}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!titulo.trim()) {
              setErro('Título da operação é obrigatório.');
              return;
            }
            onSalvar({
              roteiroId,
              componenteId,
              operacaoId: operacaoEdit?.id,
              titulo: titulo.trim(),
              descricao: descricao.trim(),
              centro,
              tempo: Math.max(1, tempo),
            });
            onClose();
          }}
          className="mt-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="fOpProdutoSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Produto *
              </label>
              <select
                id="fOpProdutoSelect"
                value={roteiroId}
                onChange={(e) => {
                  const newRId = Number(e.target.value);
                  setRoteiroId(newRId);
                  const rot = roteiros.find((r) => r.id === newRId);
                  if (rot && rot.componentes.length > 0) {
                    setComponenteId(rot.componentes[0].id);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              >
                {roteiros.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.produtoNome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fOpComponenteSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Componente *
              </label>
              <select
                id="fOpComponenteSelect"
                value={componenteId}
                onChange={(e) => setComponenteId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              >
                {roteiroAtual?.componentes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="fOpTituloInput" className="block text-sm font-semibold mb-1">
              Título da Operação *
            </label>
            <input
              id="fOpTituloInput"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Corte do Tubo, Faceamento, Mandrilamento, Solda..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="fOpCentroSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Centro de Trabalho *
              </label>
              <select
                id="fOpCentroSelect"
                value={centro}
                onChange={(e) => setCentro(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              >
                {centros.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fOpTempoInput" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Tempo Padrão (minutos) *
              </label>
              <input
                id="fOpTempoInput"
                type="number"
                min="1"
                value={tempo}
                onChange={(e) => setTempo(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="fOpDescricaoTextarea" className="block text-sm font-semibold mb-1">
              Descrição / Parâmetros Técnicos
            </label>
            <textarea
              id="fOpDescricaoTextarea"
              rows={2}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Ferramenta CNMG 120408, avanço 0.25mm/rot, rotação 450 RPM..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {operacaoEdit ? 'Atualizar Operação' : 'Salvar Operação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
