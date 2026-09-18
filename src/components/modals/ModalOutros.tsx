import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { BoM, CentroTrabalho, InspecaoQualidade, MaterialEstoque, Produto } from '../../types';

// Modal BoM
export const ModalNovaBom: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  produtos: Produto[];
  bomParaEditar: BoM | null;
  onSalvar: (dados: { id?: number; nome: string; componentes: string[] }) => void;
}> = ({ isOpen, onClose, produtos, bomParaEditar, onSalvar }) => {
  const [nome, setNome] = useState('');
  const [componentesStr, setComponentesStr] = useState('');

  useEffect(() => {
    if (bomParaEditar) {
      setNome(bomParaEditar.nome);
      setComponentesStr(bomParaEditar.componentes.join(', '));
    } else {
      setNome(produtos[0]?.nome || '');
      setComponentesStr('');
    }
  }, [bomParaEditar, isOpen, produtos]);

  if (!isOpen) return null;

  return (
    <div
      id="modalNovaBom"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>📐</span> {bomParaEditar ? 'Editar Estrutura (BoM)' : 'Nova Estrutura de Produto (BoM)'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const comps = componentesStr
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean);
            onSalvar({
              id: bomParaEditar?.id,
              nome: nome.trim(),
              componentes: comps,
            });
            onClose();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="fBomNomeSelect" className="block text-sm font-semibold mb-1">
              Produto / Conjunto *
            </label>
            <div className="flex gap-2">
              <input
                id="fBomNomeSelect"
                type="text"
                list="produtos-list-bom"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Selecione ou digite o nome do produto..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                required
              />
              <datalist id="produtos-list-bom">
                {produtos.map((p) => (
                  <option key={p.id} value={p.nome} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label htmlFor="fBomComponentesTextarea" className="block text-sm font-semibold mb-1">
              Componentes e Matérias-Primas (separados por vírgula) *
            </label>
            <textarea
              id="fBomComponentesTextarea"
              rows={4}
              value={componentesStr}
              onChange={(e) => setComponentesStr(e.target.value)}
              placeholder="Ex: Camisa Tubular, Haste Cromada, Pistão, Anel Raspador, Guia de Bronze, Olhal"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Salvar BoM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Centro de Trabalho
export const ModalNovoCentro: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  centroParaEditar: CentroTrabalho | null;
  onSalvar: (dados: { id?: number; nome: string; capacidade: number; eficiencia: number; operador: string }) => void;
}> = ({ isOpen, onClose, centroParaEditar, onSalvar }) => {
  const [nome, setNome] = useState('');
  const [capacidade, setCapacidade] = useState(30);
  const [eficiencia, setEficiencia] = useState(90);
  const [operador, setOperador] = useState('');

  useEffect(() => {
    if (centroParaEditar) {
      setNome(centroParaEditar.nome);
      setCapacidade(centroParaEditar.capacidade);
      setEficiencia(centroParaEditar.eficiencia);
      setOperador(centroParaEditar.operador);
    } else {
      setNome('');
      setCapacidade(30);
      setEficiencia(90);
      setOperador('');
    }
  }, [centroParaEditar, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="modalNovoCentro"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>🔧</span> {centroParaEditar ? 'Editar Centro' : 'Novo Centro de Trabalho'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSalvar({
              id: centroParaEditar?.id,
              nome: nome.trim(),
              capacidade: Math.max(1, capacidade),
              eficiencia: Math.min(100, Math.max(1, eficiencia)),
              operador: operador.trim() || 'Não atribuído',
            });
            onClose();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="fCentroNomeInput" className="block text-sm font-semibold mb-1">
              Nome do Centro *
            </label>
            <input
              id="fCentroNomeInput"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Torno CNC, Solda Robotizada..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fCentroCapacidadeInput" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Capacidade (peças/dia)
              </label>
              <input
                id="fCentroCapacidadeInput"
                type="number"
                min="1"
                value={capacidade}
                onChange={(e) => setCapacidade(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>

            <div>
              <label htmlFor="fCentroEficienciaInput" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Eficiência (%)
              </label>
              <input
                id="fCentroEficienciaInput"
                type="number"
                min="1"
                max="100"
                value={eficiencia}
                onChange={(e) => setEficiencia(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="fCentroOperadorInput" className="block text-sm font-semibold mb-1">
              Operador Responsável
            </label>
            <input
              id="fCentroOperadorInput"
              type="text"
              value={operador}
              onChange={(e) => setOperador(e.target.value)}
              placeholder="Ex: Carlos Silva"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Salvar Centro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Inspeção Qualidade
export const ModalNovaInspecao: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  produtos: Produto[];
  inspecaoParaEditar: InspecaoQualidade | null;
  onSalvar: (dados: {
    id?: number;
    produto: string;
    tipo: 'Hidráulico' | 'Dimensional' | 'Visual' | 'Funcional';
    resultado: 'aprovado' | 'reprovado' | 'pendente';
    observacoes: string;
  }) => void;
}> = ({ isOpen, onClose, produtos, inspecaoParaEditar, onSalvar }) => {
  const [produto, setProduto] = useState('');
  const [tipo, setTipo] = useState<'Hidráulico' | 'Dimensional' | 'Visual' | 'Funcional'>('Hidráulico');
  const [resultado, setResultado] = useState<'aprovado' | 'reprovado' | 'pendente'>('aprovado');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (inspecaoParaEditar) {
      setProduto(inspecaoParaEditar.produto);
      setTipo(inspecaoParaEditar.tipo);
      setResultado(inspecaoParaEditar.resultado);
      setObservacoes(inspecaoParaEditar.observacoes || '');
    } else {
      setProduto(produtos[0]?.nome || '');
      setTipo('Hidráulico');
      setResultado('aprovado');
      setObservacoes('');
    }
  }, [inspecaoParaEditar, isOpen, produtos]);

  if (!isOpen) return null;

  return (
    <div
      id="modalNovaInspecao"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>✅</span> {inspecaoParaEditar ? 'Editar Inspeção' : 'Nova Inspeção de Qualidade'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSalvar({
              id: inspecaoParaEditar?.id,
              produto: produto.trim(),
              tipo,
              resultado,
              observacoes: observacoes.trim(),
            });
            onClose();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="fInspecaoProdutoInput" className="block text-sm font-semibold mb-1">
              Produto / Ordem *
            </label>
            <input
              id="fInspecaoProdutoInput"
              type="text"
              list="lista-produtos-insp"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              placeholder="Ex: CH-001 - Cilindro Série 150"
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              required
            />
            <datalist id="lista-produtos-insp">
              {produtos.map((p) => (
                <option key={p.id} value={p.nome} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fInspecaoTipoSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Tipo de Teste *
              </label>
              <select
                id="fInspecaoTipoSelect"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value="Hidráulico">Hidráulico (Pressão)</option>
                <option value="Dimensional">Dimensional</option>
                <option value="Visual">Visual / Acabamento</option>
                <option value="Funcional">Funcional</option>
              </select>
            </div>

            <div>
              <label htmlFor="fInspecaoResultadoSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Resultado *
              </label>
              <select
                id="fInspecaoResultadoSelect"
                value={resultado}
                onChange={(e) => setResultado(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold"
              >
                <option value="aprovado">✅ Aprovado</option>
                <option value="reprovado">❌ Reprovado</option>
                <option value="pendente">⏳ Pendente</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="fInspecaoObsTextarea" className="block text-sm font-semibold mb-1">
              Observações / Laudo
            </label>
            <textarea
              id="fInspecaoObsTextarea"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Valores medidos, pressões atingidas, observações técnicas..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Salvar Laudo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Material de Estoque
export const ModalNovoMaterial: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  materialParaEditar: MaterialEstoque | null;
  onSalvar: (dados: {
    id?: number;
    nome: string;
    categoria: 'Matéria-prima' | 'Produtos Acabados' | 'Insumos' | 'Componentes';
    quantidade: number;
    minimo: number;
    localizacao: string;
    unidade?: string;
  }) => void;
}> = ({ isOpen, onClose, materialParaEditar, onSalvar }) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<'Matéria-prima' | 'Produtos Acabados' | 'Insumos' | 'Componentes'>('Matéria-prima');
  const [quantidade, setQuantidade] = useState(10);
  const [minimo, setMinimo] = useState(5);
  const [localizacao, setLocalizacao] = useState('');
  const [unidade, setUnidade] = useState('un');

  useEffect(() => {
    if (materialParaEditar) {
      setNome(materialParaEditar.nome);
      setCategoria(materialParaEditar.categoria);
      setQuantidade(materialParaEditar.quantidade);
      setMinimo(materialParaEditar.minimo);
      setLocalizacao(materialParaEditar.localizacao);
      setUnidade(materialParaEditar.unidade || 'un');
    } else {
      setNome('');
      setCategoria('Matéria-prima');
      setQuantidade(10);
      setMinimo(5);
      setLocalizacao('Almoxarifado Central');
      setUnidade('un');
    }
  }, [materialParaEditar, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="modalNovoMaterial"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>📦</span> {materialParaEditar ? 'Editar Item no Estoque' : 'Novo Item no Estoque'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSalvar({
              id: materialParaEditar?.id,
              nome: nome.trim(),
              categoria,
              quantidade: Math.max(0, quantidade),
              minimo: Math.max(0, minimo),
              localizacao: localizacao.trim(),
              unidade,
            });
            onClose();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="fMaterialNomeInput" className="block text-sm font-semibold mb-1">
              Nome do Material / Insumo *
            </label>
            <input
              id="fMaterialNomeInput"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Tubo Seamless Ø120mm, Barra Cromada..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fMaterialCategoriaSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Categoria
              </label>
              <select
                id="fMaterialCategoriaSelect"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value="Matéria-prima">Matéria-prima</option>
                <option value="Produtos Acabados">Produtos Acabados</option>
                <option value="Insumos">Insumos</option>
                <option value="Componentes">Componentes</option>
              </select>
            </div>

            <div>
              <label htmlFor="fMaterialUnidadeSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Unidade
              </label>
              <select
                id="fMaterialUnidadeSelect"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
              >
                <option value="un">un (unidades)</option>
                <option value="peças">peças</option>
                <option value="barras">barras</option>
                <option value="jogos">jogos / kits</option>
                <option value="litros">litros</option>
                <option value="kg">kg (quilos)</option>
                <option value="metros">metros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fMaterialQtdInput" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Saldo Atual
              </label>
              <input
                id="fMaterialQtdInput"
                type="number"
                min="0"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="fMaterialMinimoInput" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Estoque Mínimo (Alerta)
              </label>
              <input
                id="fMaterialMinimoInput"
                type="number"
                min="0"
                value={minimo}
                onChange={(e) => setMinimo(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="fMaterialLocInput" className="block text-sm font-semibold mb-1">
              Localização Física
            </label>
            <input
              id="fMaterialLocInput"
              type="text"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder="Ex: Rua A - Prateleira 2, Almoxarifado B..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Salvar Estoque
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Movimentação de Estoque
export const ModalMovimentacao: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  materiais: MaterialEstoque[];
  onMovimentar: (materialId: number, tipo: 'entrada' | 'saida', quantidade: number) => void;
}> = ({ isOpen, onClose, materiais, onMovimentar }) => {
  const [materialId, setMaterialId] = useState<number>(materiais[0]?.id || 0);
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const matObj = materiais.find((m) => m.id === materialId) || materiais[0];

  return (
    <div
      id="modalMovimentacao"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span>📊</span> Movimentação de Estoque
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
            if (tipo === 'saida' && matObj && matObj.quantidade < quantidade) {
              setErro(`Saldo insuficiente! Disponível: ${matObj.quantidade} ${matObj.unidade || 'un'}`);
              return;
            }
            onMovimentar(materialId || materiais[0]?.id, tipo, Math.max(1, quantidade));
            onClose();
          }}
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="fMovMaterialSelect" className="block text-sm font-semibold mb-1">
              Material *
            </label>
            <select
              id="fMovMaterialSelect"
              value={materialId || materiais[0]?.id}
              onChange={(e) => {
                setMaterialId(Number(e.target.value));
                setErro('');
              }}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            >
              {materiais.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} (Saldo: {m.quantidade} {m.unidade || 'un'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fMovTipoSelect" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Tipo de Operação *
              </label>
              <select
                id="fMovTipoSelect"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as 'entrada' | 'saida')}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold"
              >
                <option value="entrada">📥 Entrada (Compra/Produzido)</option>
                <option value="saida">📤 Saída (Consumo/Envio)</option>
              </select>
            </div>

            <div>
              <label htmlFor="fMovQtdInput" className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-400">
                Quantidade *
              </label>
              <input
                id="fMovQtdInput"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-amber-600 rounded-lg shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Confirmar Movimentação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
