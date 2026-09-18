import React, { useState, useEffect } from 'react';
import {
  Produto,
  OrdemProducao,
  OrdemServico,
  RoteiroProduto,
  BoM,
  CentroTrabalho,
  InspecaoQualidade,
  MaterialEstoque,
  LogAuditoria,
  UsuarioApp,
  StatusOrdem,
} from './types';
import {
  PRODUTOS_INICIAIS,
  ORDENS_INICIAIS,
  ORDENS_SERVICO_INICIAIS,
  ROTEIROS_INICIAIS,
  BOMS_INICIAIS,
  CENTROS_INICIAIS,
  INSPECOES_INICIAIS,
  MATERIAIS_INICIAIS,
  AUDIT_INICIAL,
} from './data/initialData';
import {
  exportProducaoPDF,
  exportOSPDF,
  exportRoteiroPDF,
  exportHistoricoPDF,
} from './utils/pdfExport';

import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KanbanView } from './components/KanbanView';
import { ProducaoView } from './components/ProducaoView';
import { OrdensServicoView } from './components/OrdensServicoView';
import { RoteiroView } from './components/RoteiroView';
import { ProdutosView } from './components/ProdutosView';
import { BomView } from './components/BomView';
import { WorkcentersView } from './components/WorkcentersView';
import { QualidadeView } from './components/QualidadeView';
import { EstoqueView } from './components/EstoqueView';
import { HistoricoView } from './components/HistoricoView';
import { ConfigView } from './components/ConfigView';

// Modais
import { ModalNovaOrdem } from './components/modals/ModalNovaOrdem';
import { ModalNovoProduto } from './components/modals/ModalNovoProduto';
import { ModalNovaOS } from './components/modals/ModalNovaOS';
import {
  ModalNovoRoteiroProduto,
  ModalNovoComponente,
  ModalNovaOperacao,
} from './components/modals/ModalRoteiro';
import {
  ModalNovaBom,
  ModalNovoCentro,
  ModalNovaInspecao,
  ModalNovoMaterial,
  ModalMovimentacao,
} from './components/modals/ModalOutros';

import { CheckCircle2, AlertTriangle, XCircle, Info, HelpCircle } from 'lucide-react';
import { safeStorage } from './utils/storage';

interface NotificacaoItem {
  id: number;
  mensagem: string;
  tipo: 'success' | 'warning' | 'error';
}

const STORAGE_KEY = 'fabrica_pro_dados_v51';

export default function App() {
  // Estado de Dados
  const [produtos, setProdutos] = useState<Produto[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.produtos) && parsed.produtos.length > 0) {
          return parsed.produtos;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return PRODUTOS_INICIAIS;
  });

  const [ordens, setOrdens] = useState<OrdemProducao[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ordens)) return parsed.ordens;
      }
    } catch (e) {
      console.error(e);
    }
    return ORDENS_INICIAIS;
  });

  const [ordensServico, setOrdensServico] = useState<OrdemServico[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ordensServico)) return parsed.ordensServico;
      }
    } catch (e) {
      console.error(e);
    }
    return ORDENS_SERVICO_INICIAIS;
  });

  const [roteiros, setRoteiros] = useState<RoteiroProduto[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.roteiros)) return parsed.roteiros;
      }
    } catch (e) {
      console.error(e);
    }
    return ROTEIROS_INICIAIS;
  });

  const [boms, setBoms] = useState<BoM[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.boms)) return parsed.boms;
      }
    } catch (e) {
      console.error(e);
    }
    return BOMS_INICIAIS;
  });

  const [centros, setCentros] = useState<CentroTrabalho[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.centros)) return parsed.centros;
      }
    } catch (e) {
      console.error(e);
    }
    return CENTROS_INICIAIS;
  });

  const [inspecoes, setInspecoes] = useState<InspecaoQualidade[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.inspecoes)) return parsed.inspecoes;
      }
    } catch (e) {
      console.error(e);
    }
    return INSPECOES_INICIAIS;
  });

  const [materiais, setMateriais] = useState<MaterialEstoque[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.materiais)) return parsed.materiais;
      }
    } catch (e) {
      console.error(e);
    }
    return MATERIAIS_INICIAIS;
  });

  const [auditLog, setAuditLog] = useState<LogAuditoria[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.auditLog)) return parsed.auditLog;
      }
    } catch (e) {
      console.error(e);
    }
    return AUDIT_INICIAL;
  });

  // Usuário Atual & Navegação
  const [usuario, setUsuario] = useState<UsuarioApp>({
    username: 'admin',
    name: 'Administrador PCP',
    role: 'admin',
  });

  const [paginaAtiva, setPaginaAtiva] = useState('dashboard');
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(() => {
    return safeStorage.getItem('fabrica_tema') === 'dark';
  });

  const [buscaGlobal, setBuscaGlobal] = useState('');
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [modalAjudaOpen, setModalAjudaOpen] = useState(false);

  // Estados dos Modais
  const [modalNovaOrdemOpen, setModalNovaOrdemOpen] = useState(false);
  const [ordemParaEditar, setOrdemParaEditar] = useState<OrdemProducao | null>(null);

  const [modalNovoProdutoOpen, setModalNovoProdutoOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null);

  const [modalNovaOSOpen, setModalNovaOSOpen] = useState(false);
  const [osParaEditar, setOsParaEditar] = useState<OrdemServico | null>(null);

  const [modalNovoRoteiroOpen, setModalNovoRoteiroOpen] = useState(false);
  const [modalNovoComponenteOpen, setModalNovoComponenteOpen] = useState(false);
  const [roteiroPreSelecionadoId, setRoteiroPreSelecionadoId] = useState<number | undefined>(undefined);

  const [modalNovaOperacaoOpen, setModalNovaOperacaoOpen] = useState(false);
  const [operacaoPreSelected, setOperacaoPreSelected] = useState<{
    roteiroId: number;
    componenteId: number;
    operacaoId?: number;
  } | null>(null);

  const [modalNovaBomOpen, setModalNovaBomOpen] = useState(false);
  const [bomParaEditar, setBomParaEditar] = useState<BoM | null>(null);

  const [modalNovoCentroOpen, setModalNovoCentroOpen] = useState(false);
  const [centroParaEditar, setCentroParaEditar] = useState<CentroTrabalho | null>(null);

  const [modalNovaInspecaoOpen, setModalNovaInspecaoOpen] = useState(false);
  const [inspecaoParaEditar, setInspecaoParaEditar] = useState<InspecaoQualidade | null>(null);

  const [modalNovoMaterialOpen, setModalNovoMaterialOpen] = useState(false);
  const [materialParaEditar, setMaterialParaEditar] = useState<MaterialEstoque | null>(null);

  const [modalMovimentacaoOpen, setModalMovimentacaoOpen] = useState(false);

  // Salvar no LocalStorage sempre que houver alteração
  useEffect(() => {
    try {
      const dados = {
        produtos,
        ordens,
        ordensServico,
        roteiros,
        boms,
        centros,
        inspecoes,
        materiais,
        auditLog,
      };
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
      // Garante que o trial fique marcado como permanentemente ativado
      safeStorage.setItem('fabrica_ativado', 'true');
    } catch (e) {
      console.error('Erro ao salvar dados:', e);
    }
  }, [produtos, ordens, ordensServico, roteiros, boms, centros, inspecoes, materiais, auditLog]);

  // Aplicar tema escuro/claro no elemento HTML
  useEffect(() => {
    if (temaEscuro) {
      document.documentElement.classList.add('dark');
      safeStorage.setItem('fabrica_tema', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      safeStorage.setItem('fabrica_tema', 'light');
    }
  }, [temaEscuro]);

  // Função auxiliar de notificação Toast
  const addNotificacao = (mensagem: string, tipo: 'success' | 'warning' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setNotificacoes((prev) => [...prev, { id, mensagem, tipo }]);
    setTimeout(() => {
      setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  // Adicionar registro de auditoria
  const registrarAuditoria = (acao: string, detalhes: string) => {
    const novoLog: LogAuditoria = {
      id: Date.now(),
      usuario: usuario.name,
      acao,
      detalhes,
      data: new Date().toISOString(),
    };
    setAuditLog((prev) => [novoLog, ...prev.slice(0, 199)]);
  };

  // ============================================
  // CRUDS E MANIPULADORES
  // ============================================

  // 1. Ordens de Produção (OP)
  const handleSalvarOrdem = (dados: {
    id?: string;
    produto: string;
    produtoId?: number;
    serie: string;
    quantidade: number;
    dataInicio: string;
    previsaoEntrega?: string;
    status: StatusOrdem;
    operador: string;
    prioridade: any;
    observacoes?: string;
  }) => {
    if (dados.id) {
      // Edição
      setOrdens((prev) =>
        prev.map((o) => {
          if (o.id === dados.id) {
            return {
              ...o,
              ...dados,
              progresso: dados.status === 'concluido' ? 100 : o.progresso,
            };
          }
          return o;
        })
      );
      addNotificacao(`✏️ Ordem de Produção ${dados.id} atualizada com sucesso!`, 'success');
      registrarAuditoria('OP Atualizada', `${dados.id} - ${dados.produto} (${dados.quantidade} un)`);
    } else {
      // Nova OP: Gerar ID sequencial
      const idsNum = ordens.map((o) => parseInt(o.id.replace(/\D/g, '')) || 0);
      const proximoNum = Math.max(0, ...idsNum) + 1;
      const novoId = `CH-${String(proximoNum).padStart(3, '0')}`;

      const novaOp: OrdemProducao = {
        id: novoId,
        produto: dados.produto,
        produtoId: dados.produtoId,
        serie: dados.serie || 'Série Padrão',
        quantidade: dados.quantidade,
        dataInicio: dados.dataInicio,
        previsaoEntrega: dados.previsaoEntrega,
        status: dados.status,
        progresso: dados.status === 'concluido' ? 100 : 0,
        operador: dados.operador,
        prioridade: dados.prioridade,
        observacoes: dados.observacoes,
        etapaAtual: 'Início de fabricação / PCP',
      };

      setOrdens((prev) => [novaOp, ...prev]);
      addNotificacao(`✅ Nova Ordem de Produção ${novoId} criada para "${dados.produto}"!`, 'success');
      registrarAuditoria('Nova OP Criada', `${novoId} - ${dados.produto} (${dados.quantidade} un)`);
    }
  };

  const handleAvancarEtapa = (id: string) => {
    setOrdens((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          if (o.status === 'concluido') return o;
          const novoProg = Math.min(100, o.progresso + 15);
          let novoStatus = o.status;
          if (novoProg >= 100) {
            novoStatus = 'concluido';
          } else if (novoProg >= 75 && o.status !== 'teste') {
            novoStatus = 'teste';
          } else if (novoProg >= 20 && o.status === 'planejado') {
            novoStatus = 'producao';
          }
          addNotificacao(`⏩ Ordem ${o.id} avançou para ${novoProg}% (${novoStatus})`, 'success');
          registrarAuditoria('Etapa Avançada', `${o.id} - ${o.produto} (${novoProg}%)`);
          return { ...o, progresso: novoProg, status: novoStatus };
        }
        return o;
      })
    );
  };

  const handleFinalizarOrdem = (id: string) => {
    setOrdens((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          addNotificacao(`🎉 Ordem ${o.id} concluída com sucesso!`, 'success');
          registrarAuditoria('OP Finalizada', `${o.id} - ${o.produto}`);
          return { ...o, progresso: 100, status: 'concluido' as StatusOrdem, etapaAtual: 'Concluída e Liberada' };
        }
        return o;
      })
    );
  };

  const handleExcluirOrdem = (id: string) => {
    if (!confirm(`Deseja realmente excluir a ordem de produção ${id}?`)) return;
    const ordem = ordens.find((o) => o.id === id);
    setOrdens((prev) => prev.filter((o) => o.id !== id));
    addNotificacao(`🗑️ Ordem ${id} excluída!`, 'warning');
    registrarAuditoria('OP Excluída', `${id} - ${ordem?.produto || ''}`);
  };

  const handleMudarStatusOrdem = (id: string, novoStatus: StatusOrdem) => {
    setOrdens((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const prog = novoStatus === 'concluido' ? 100 : o.progresso;
          addNotificacao(`📋 Ordem ${o.id} movida para ${novoStatus.toUpperCase()}`, 'success');
          registrarAuditoria('Status OP Alterado', `${o.id} -> ${novoStatus}`);
          return { ...o, status: novoStatus, progresso: prog };
        }
        return o;
      })
    );
  };

  // 2. Produtos do Catálogo
  const handleSalvarProduto = (dados: {
    id?: number;
    nome: string;
    codigo: string;
    categoria: string;
    spec: string;
  }) => {
    if (dados.id) {
      setProdutos((prev) =>
        prev.map((p) => (p.id === dados.id ? { ...p, ...dados } : p))
      );
      addNotificacao(`✏️ Produto "${dados.nome}" atualizado no catálogo!`, 'success');
      registrarAuditoria('Produto Atualizado', `${dados.nome} (${dados.codigo})`);
    } else {
      const novoId = Math.max(0, ...produtos.map((p) => p.id)) + 1;
      const novoProduto: Produto = {
        id: novoId,
        nome: dados.nome,
        codigo: dados.codigo,
        categoria: dados.categoria,
        spec: dados.spec,
        ativo: true,
      };
      setProdutos((prev) => [...prev, novoProduto]);
      addNotificacao(`✅ Produto "${dados.nome}" cadastrado com sucesso! Já disponível para novas OPs.`, 'success');
      registrarAuditoria('Novo Produto Cadastrado', `${dados.nome} (${dados.codigo})`);
    }
  };

  const handleExcluirProduto = (id: number) => {
    const prod = produtos.find((p) => p.id === id);
    if (!prod) return;
    if (!confirm(`Deseja excluir o produto "${prod.nome}"? As OPs existentes vinculadas a ele serão preservadas.`)) return;
    setProdutos((prev) => prev.filter((p) => p.id !== id));
    addNotificacao(`🗑️ Produto "${prod.nome}" excluído do catálogo!`, 'warning');
    registrarAuditoria('Produto Excluído', prod.nome);
  };

  // 3. Ordens de Serviço (OS)
  const handleSalvarOS = (dados: {
    id?: string;
    cliente: string;
    produto: string;
    produtoId?: number;
    quantidade: number;
    valor: number;
    status: StatusOrdem;
    observacoes?: string;
  }) => {
    if (dados.id) {
      setOrdensServico((prev) =>
        prev.map((os) => (os.id === dados.id ? { ...os, ...dados } : os))
      );
      addNotificacao(`✏️ Ordem de Serviço ${dados.id} atualizada!`, 'success');
      registrarAuditoria('OS Atualizada', `${dados.id} - ${dados.cliente}`);
    } else {
      const idsNum = ordensServico.map((os) => parseInt(os.id.replace(/\D/g, '')) || 0);
      const proximoNum = Math.max(0, ...idsNum) + 1;
      const novoId = `OS-${String(proximoNum).padStart(3, '0')}`;
      const novaOS: OrdemServico = {
        id: novoId,
        cliente: dados.cliente,
        produto: dados.produto,
        produtoId: dados.produtoId,
        quantidade: dados.quantidade,
        data: new Date().toISOString().split('T')[0],
        valor: dados.valor,
        status: dados.status,
        observacoes: dados.observacoes,
      };
      setOrdensServico((prev) => [novaOS, ...prev]);
      addNotificacao(`✅ Nova OS ${novoId} gerada para ${dados.cliente}!`, 'success');
      registrarAuditoria('Nova OS Criada', `${novoId} - ${dados.cliente} (${dados.produto})`);
    }
  };

  const handleExcluirOS = (id: string) => {
    if (!confirm(`Deseja excluir a OS ${id}?`)) return;
    setOrdensServico((prev) => prev.filter((os) => os.id !== id));
    addNotificacao(`🗑️ OS ${id} excluída!`, 'warning');
    registrarAuditoria('OS Excluída', id);
  };

  // 4. Roteiro & Componentes & Operações
  const handleSalvarRoteiroProduto = (produtoId: number, produtoNome: string) => {
    const novoRoteiro: RoteiroProduto = {
      id: Date.now(),
      produtoId,
      produtoNome,
      componentes: [
        {
          id: Date.now() + 1,
          nome: 'Componente Principal',
          operacoes: [
            { id: Date.now() + 2, titulo: 'Corte e Preparação', centro: 'Corte', tempo: 15 },
          ],
        },
      ],
    };
    setRoteiros((prev) => [...prev, novoRoteiro]);
    addNotificacao(`✅ Roteiro criado para "${produtoNome}"!`, 'success');
    registrarAuditoria('Roteiro Criado', produtoNome);
  };

  const handleSalvarComponente = (roteiroId: number, nomeComponente: string) => {
    setRoteiros((prev) =>
      prev.map((r) => {
        if (r.id === roteiroId) {
          const novoComp = {
            id: Date.now(),
            nome: nomeComponente,
            operacoes: [],
          };
          return { ...r, componentes: [...r.componentes, novoComp] };
        }
        return r;
      })
    );
    addNotificacao(`✅ Componente "${nomeComponente}" adicionado ao roteiro!`, 'success');
    registrarAuditoria('Componente Roteiro Criado', nomeComponente);
  };

  const handleSalvarOperacao = (dados: {
    roteiroId: number;
    componenteId: number;
    operacaoId?: number;
    titulo: string;
    descricao: string;
    centro: string;
    tempo: number;
  }) => {
    setRoteiros((prev) =>
      prev.map((r) => {
        if (r.id === dados.roteiroId) {
          const comps = r.componentes.map((c) => {
            if (c.id === dados.componenteId) {
              if (dados.operacaoId) {
                // Editar operação existente
                const ops = c.operacoes.map((op) =>
                  op.id === dados.operacaoId
                    ? { ...op, titulo: dados.titulo, descricao: dados.descricao, centro: dados.centro, tempo: dados.tempo }
                    : op
                );
                return { ...c, operacoes: ops };
              } else {
                // Nova operação
                const novaOp = {
                  id: Date.now(),
                  titulo: dados.titulo,
                  descricao: dados.descricao,
                  centro: dados.centro,
                  tempo: dados.tempo,
                };
                return { ...c, operacoes: [...c.operacoes, novaOp] };
              }
            }
            return c;
          });
          return { ...r, componentes: comps };
        }
        return r;
      })
    );
    addNotificacao(`⚙️ Operação "${dados.titulo}" salva no roteiro!`, 'success');
    registrarAuditoria('Operação Roteiro Salva', `${dados.titulo} (${dados.centro})`);
  };

  const handleExcluirOperacao = (roteiroId: number, componenteId: number, operacaoId: number) => {
    if (!confirm('Deseja excluir esta operação do roteiro?')) return;
    setRoteiros((prev) =>
      prev.map((r) => {
        if (r.id === roteiroId) {
          const comps = r.componentes.map((c) => {
            if (c.id === componenteId) {
              return { ...c, operacoes: c.operacoes.filter((op) => op.id !== operacaoId) };
            }
            return c;
          });
          return { ...r, componentes: comps };
        }
        return r;
      })
    );
    addNotificacao('🗑️ Operação excluída do roteiro!', 'warning');
  };

  const handleExcluirComponente = (roteiroId: number, componenteId: number) => {
    if (!confirm('Deseja excluir este componente e todas as suas operações?')) return;
    setRoteiros((prev) =>
      prev.map((r) => {
        if (r.id === roteiroId) {
          return { ...r, componentes: r.componentes.filter((c) => c.id !== componenteId) };
        }
        return r;
      })
    );
    addNotificacao('🗑️ Componente excluído do roteiro!', 'warning');
  };

  const handleExcluirRoteiro = (roteiroId: number) => {
    if (!confirm('Deseja excluir este roteiro de fabricação completo?')) return;
    setRoteiros((prev) => prev.filter((r) => r.id !== roteiroId));
    addNotificacao('🗑️ Roteiro do produto excluído!', 'warning');
  };

  // 5. BoMs
  const handleSalvarBom = (dados: { id?: number; nome: string; componentes: string[] }) => {
    if (dados.id) {
      setBoms((prev) => prev.map((b) => (b.id === dados.id ? { ...b, ...dados } : b)));
      addNotificacao(`✏️ Estrutura BoM de "${dados.nome}" atualizada!`, 'success');
    } else {
      const novaBom: BoM = {
        id: Date.now(),
        nome: dados.nome,
        componentes: dados.componentes,
      };
      setBoms((prev) => [...prev, novaBom]);
      addNotificacao(`✅ BoM criada para "${dados.nome}"!`, 'success');
    }
  };

  // 6. Centros de Trabalho
  const handleSalvarCentro = (dados: { id?: number; nome: string; capacidade: number; eficiencia: number; operador: string }) => {
    if (dados.id) {
      setCentros((prev) => prev.map((c) => (c.id === dados.id ? { ...c, ...dados } : c)));
      addNotificacao(`✏️ Centro "${dados.nome}" atualizado!`, 'success');
    } else {
      const novoCentro: CentroTrabalho = {
        id: Date.now(),
        nome: dados.nome,
        capacidade: dados.capacidade,
        eficiencia: dados.eficiencia,
        operador: dados.operador,
        status: 'ativo',
      };
      setCentros((prev) => [...prev, novoCentro]);
      addNotificacao(`✅ Novo centro "${dados.nome}" cadastrado!`, 'success');
    }
  };

  // 7. Qualidade
  const handleSalvarInspecao = (dados: {
    id?: number;
    produto: string;
    tipo: any;
    resultado: any;
    observacoes: string;
  }) => {
    if (dados.id) {
      setInspecoes((prev) => prev.map((i) => (i.id === dados.id ? { ...i, ...dados } : i)));
      addNotificacao('✏️ Laudo de inspeção atualizado!', 'success');
    } else {
      const novaInsp: InspecaoQualidade = {
        id: Date.now(),
        produto: dados.produto,
        tipo: dados.tipo,
        resultado: dados.resultado,
        observacoes: dados.observacoes,
        data: new Date().toISOString().split('T')[0],
        inspetor: usuario.name,
      };
      setInspecoes((prev) => [novaInsp, ...prev]);
      addNotificacao(`✅ Nova inspeção registrada (${dados.resultado})!`, 'success');
    }
  };

  // 8. Estoque
  const handleSalvarMaterial = (dados: {
    id?: number;
    nome: string;
    categoria: any;
    quantidade: number;
    minimo: number;
    localizacao: string;
    unidade?: string;
  }) => {
    if (dados.id) {
      setMateriais((prev) => prev.map((m) => (m.id === dados.id ? { ...m, ...dados } : m)));
      addNotificacao(`✏️ Item "${dados.nome}" atualizado no estoque!`, 'success');
    } else {
      const novoMat: MaterialEstoque = {
        id: Date.now(),
        nome: dados.nome,
        categoria: dados.categoria,
        quantidade: dados.quantidade,
        minimo: dados.minimo,
        localizacao: dados.localizacao,
        unidade: dados.unidade,
      };
      setMateriais((prev) => [...prev, novoMat]);
      addNotificacao(`✅ Material "${dados.nome}" adicionado ao almoxarifado!`, 'success');
    }
  };

  const handleMovimentarEstoque = (materialId: number, tipo: 'entrada' | 'saida', quantidade: number) => {
    setMateriais((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const saldo = tipo === 'entrada' ? m.quantidade + quantidade : Math.max(0, m.quantidade - quantidade);
          addNotificacao(
            `📊 ${tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${quantidade} ${m.unidade || 'un'} de "${m.nome}" registrada!`,
            'success'
          );
          registrarAuditoria('Movimentação Estoque', `${tipo.toUpperCase()}: ${quantidade} ${m.unidade} de ${m.nome}`);
          return { ...m, quantidade: saldo };
        }
        return m;
      })
    );
  };

  // Backup & Reset
  const handleBackup = () => {
    try {
      const backupDados = {
        versao: '5.1',
        dataExportacao: new Date().toISOString(),
        produtos,
        ordens,
        ordensServico,
        roteiros,
        boms,
        centros,
        inspecoes,
        materiais,
        auditLog,
      };
      const blob = new Blob([JSON.stringify(backupDados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_fabrica_pro_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addNotificacao('💾 Backup do banco de dados exportado com sucesso!', 'success');
    } catch (e) {
      addNotificacao('Erro ao exportar backup', 'error');
    }
  };

  const handleRestaurarBackup = (dadosJson: string) => {
    try {
      const parsed = JSON.parse(dadosJson);
      if (parsed.produtos) setProdutos(parsed.produtos);
      if (parsed.ordens) setOrdens(parsed.ordens);
      if (parsed.ordensServico) setOrdensServico(parsed.ordensServico);
      if (parsed.roteiros) setRoteiros(parsed.roteiros);
      if (parsed.boms) setBoms(parsed.boms);
      if (parsed.centros) setCentros(parsed.centros);
      if (parsed.inspecoes) setInspecoes(parsed.inspecoes);
      if (parsed.materiais) setMateriais(parsed.materiais);
      if (parsed.auditLog) setAuditLog(parsed.auditLog);
      addNotificacao('🎉 Backup importado com sucesso!', 'success');
      registrarAuditoria('Restauração de Backup', 'Dados carregados de arquivo JSON');
    } catch (e) {
      addNotificacao('❌ Arquivo de backup inválido ou corrompido!', 'error');
    }
  };

  const handleResetarPadrao = () => {
    if (!confirm('⚠️ Deseja restaurar a base de dados padrão da fábrica? As alterações feitas serão resetadas.')) return;
    safeStorage.removeItem(STORAGE_KEY);
    setProdutos(PRODUTOS_INICIAIS);
    setOrdens(ORDENS_INICIAIS);
    setOrdensServico(ORDENS_SERVICO_INICIAIS);
    setRoteiros(ROTEIROS_INICIAIS);
    setBoms(BOMS_INICIAIS);
    setCentros(CENTROS_INICIAIS);
    setInspecoes(INSPECOES_INICIAIS);
    setMateriais(MATERIAIS_INICIAIS);
    setAuditLog(AUDIT_INICIAL);
    addNotificacao('🔄 Dados restaurados para os valores padrão de fábrica!', 'warning');
    registrarAuditoria('Reset de Dados', 'Padrões de fábrica restabelecidos');
  };

  // Contadores para as badges da sidebar
  const totalOperacoes = roteiros.reduce(
    (acc, r) => acc + r.componentes.reduce((acc2, c) => acc2 + c.operacoes.length, 0),
    0
  );

  const contadoresSidebar = {
    kanban: ordens.length,
    producao: ordens.filter((o) => o.status !== 'concluido').length,
    os: ordensServico.length,
    roteiro: totalOperacoes,
    bom: boms.length,
    centros: centros.length,
    produtos: produtos.length,
    qualidade: inspecoes.length,
    estoque: materiais.length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Notificações Toasts Flutuantes */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {notificacoes.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2.5 pointer-events-auto border animate-in slide-in-from-top-2 duration-200 ${
              n.tipo === 'success'
                ? 'bg-slate-900 text-white border-emerald-500'
                : n.tipo === 'warning'
                ? 'bg-amber-900 text-white border-amber-500'
                : 'bg-red-900 text-white border-red-500'
            }`}
          >
            {n.tipo === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {n.tipo === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {n.tipo === 'error' && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
            <span className="flex-1 leading-snug">{n.mensagem}</span>
          </div>
        ))}
      </div>

      {/* Topbar Fixa */}
      <Topbar
        usuario={usuario}
        temaEscuro={temaEscuro}
        onAlternarTema={() => setTemaEscuro(!temaEscuro)}
        onAbrirSidebar={() => setSidebarMobileOpen(true)}
        busca={buscaGlobal}
        onMudarBusca={setBuscaGlobal}
        totalNotificacoes={notificacoes.length}
        onAbrirNotificacoes={() => {
          if (notificacoes.length === 0) {
            addNotificacao('Sem notificações pendentes no momento.', 'warning');
          }
        }}
        onAbrirAjuda={() => setModalAjudaOpen(true)}
        onNavegar={setPaginaAtiva}
      />

      {/* Corpo Principal com Sidebar + Área de Conteúdo */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          paginaAtiva={paginaAtiva}
          onNavegar={setPaginaAtiva}
          isOpenMobile={sidebarMobileOpen}
          onCloseMobile={() => setSidebarMobileOpen(false)}
          usuario={usuario}
          onLogout={() => {
            addNotificacao('Sessão encerrada com sucesso.', 'warning');
            setPaginaAtiva('config');
          }}
          contadores={contadoresSidebar}
        />

        {/* Área Central da Página */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {paginaAtiva === 'dashboard' && (
              <DashboardView
                ordens={ordens}
                centros={centros}
                materiais={materiais}
                auditLog={auditLog}
                onAbrirNovaOrdem={() => {
                  setOrdemParaEditar(null);
                  setModalNovaOrdemOpen(true);
                }}
                onExportarPDF={() => exportProducaoPDF(ordens)}
                onAtualizar={() => addNotificacao('🔄 Dados sincronizados em tempo real!', 'success')}
                onNavegar={setPaginaAtiva}
              />
            )}

            {paginaAtiva === 'kanban' && (
              <KanbanView
                ordens={ordens}
                onAbrirNovaOrdem={() => {
                  setOrdemParaEditar(null);
                  setModalNovaOrdemOpen(true);
                }}
                onAvancarEtapa={handleAvancarEtapa}
                onFinalizarOrdem={handleFinalizarOrdem}
                onEditarOrdem={(o) => {
                  setOrdemParaEditar(o);
                  setModalNovaOrdemOpen(true);
                }}
                onExcluirOrdem={handleExcluirOrdem}
                onMudarStatus={handleMudarStatusOrdem}
              />
            )}

            {paginaAtiva === 'producao' && (
              <ProducaoView
                ordens={ordens}
                produtos={produtos}
                onAbrirNovaOrdem={() => {
                  setOrdemParaEditar(null);
                  setModalNovaOrdemOpen(true);
                }}
                onAvancarEtapa={handleAvancarEtapa}
                onFinalizarOrdem={handleFinalizarOrdem}
                onEditarOrdem={(o) => {
                  setOrdemParaEditar(o);
                  setModalNovaOrdemOpen(true);
                }}
                onExcluirOrdem={handleExcluirOrdem}
                onVerRoteiroProduto={() => {
                  setPaginaAtiva('roteiro');
                }}
              />
            )}

            {paginaAtiva === 'ordens' && (
              <OrdensServicoView
                ordensServico={ordensServico}
                onAbrirNovaOS={() => {
                  setOsParaEditar(null);
                  setModalNovaOSOpen(true);
                }}
                onEditarOS={(os) => {
                  setOsParaEditar(os);
                  setModalNovaOSOpen(true);
                }}
                onExcluirOS={handleExcluirOS}
                onExportarPDF={() => exportOSPDF(ordensServico)}
              />
            )}

            {paginaAtiva === 'roteiro' && (
              <RoteiroView
                roteiros={roteiros}
                onAbrirNovoRoteiroProduto={() => setModalNovoRoteiroOpen(true)}
                onAbrirNovoComponente={(rId) => {
                  setRoteiroPreSelecionadoId(rId);
                  setModalNovoComponenteOpen(true);
                }}
                onAbrirNovaOperacao={(rId, cId) => {
                  setOperacaoPreSelected(rId && cId ? { roteiroId: rId, componenteId: cId } : null);
                  setModalNovaOperacaoOpen(true);
                }}
                onEditarOperacao={(rId, cId, opId) => {
                  setOperacaoPreSelected({ roteiroId: rId, componenteId: cId, operacaoId: opId });
                  setModalNovaOperacaoOpen(true);
                }}
                onExcluirOperacao={handleExcluirOperacao}
                onExcluirComponente={handleExcluirComponente}
                onExcluirRoteiro={handleExcluirRoteiro}
                onExportarPDF={() => exportRoteiroPDF(roteiros)}
              />
            )}

            {paginaAtiva === 'produtos' && (
              <ProdutosView
                produtos={produtos}
                onAbrirNovoProduto={() => {
                  setProdutoParaEditar(null);
                  setModalNovoProdutoOpen(true);
                }}
                onEditarProduto={(p) => {
                  setProdutoParaEditar(p);
                  setModalNovoProdutoOpen(true);
                }}
                onExcluirProduto={handleExcluirProduto}
                onCriarOpDoProduto={(prodNome) => {
                  setOrdemParaEditar(null);
                  setModalNovaOrdemOpen(true);
                }}
              />
            )}

            {paginaAtiva === 'bom' && (
              <BomView
                boms={boms}
                onAbrirNovaBom={() => {
                  setBomParaEditar(null);
                  setModalNovaBomOpen(true);
                }}
                onEditarBom={(b) => {
                  setBomParaEditar(b);
                  setModalNovaBomOpen(true);
                }}
                onExcluirBom={(id) => {
                  if (confirm('Deseja excluir esta BoM?')) {
                    setBoms((prev) => prev.filter((b) => b.id !== id));
                    addNotificacao('🗑️ BoM excluída!', 'warning');
                  }
                }}
              />
            )}

            {paginaAtiva === 'workcenters' && (
              <WorkcentersView
                centros={centros}
                onAbrirNovoCentro={() => {
                  setCentroParaEditar(null);
                  setModalNovoCentroOpen(true);
                }}
                onEditarCentro={(c) => {
                  setCentroParaEditar(c);
                  setModalNovoCentroOpen(true);
                }}
                onExcluirCentro={(id) => {
                  if (confirm('Deseja excluir este centro de usinagem?')) {
                    setCentros((prev) => prev.filter((c) => c.id !== id));
                    addNotificacao('🗑️ Centro excluído!', 'warning');
                  }
                }}
              />
            )}

            {paginaAtiva === 'qualidade' && (
              <QualidadeView
                inspecoes={inspecoes}
                onAbrirNovaInspecao={() => {
                  setInspecaoParaEditar(null);
                  setModalNovaInspecaoOpen(true);
                }}
                onEditarInspecao={(i) => {
                  setInspecaoParaEditar(i);
                  setModalNovaInspecaoOpen(true);
                }}
                onExcluirInspecao={(id) => {
                  if (confirm('Deseja excluir esta inspeção?')) {
                    setInspecoes((prev) => prev.filter((i) => i.id !== id));
                    addNotificacao('🗑️ Inspeção excluída!', 'warning');
                  }
                }}
              />
            )}

            {paginaAtiva === 'estoque' && (
              <EstoqueView
                materiais={materiais}
                onAbrirNovoMaterial={() => {
                  setMaterialParaEditar(null);
                  setModalNovoMaterialOpen(true);
                }}
                onAbrirMovimentacao={() => setModalMovimentacaoOpen(true)}
                onEditarMaterial={(m) => {
                  setMaterialParaEditar(m);
                  setModalNovoMaterialOpen(true);
                }}
                onExcluirMaterial={(id) => {
                  if (confirm('Deseja excluir este item do estoque?')) {
                    setMateriais((prev) => prev.filter((m) => m.id !== id));
                    addNotificacao('🗑️ Material excluído!', 'warning');
                  }
                }}
              />
            )}

            {paginaAtiva === 'historico' && (
              <HistoricoView
                auditLog={auditLog}
                onLimparHistorico={() => {
                  if (confirm('Deseja limpar todo o histórico de auditoria?')) {
                    setAuditLog([]);
                    addNotificacao('🗑️ Histórico de auditoria limpo!', 'warning');
                  }
                }}
                onExportarPDF={() => exportHistoricoPDF(auditLog)}
              />
            )}

            {paginaAtiva === 'config' && (
              <ConfigView
                usuario={usuario}
                onMudarUsuario={(novo) => {
                  setUsuario(novo);
                  addNotificacao(`Sessão alterada para perfil: ${novo.name} (${novo.role})`, 'success');
                }}
                totalOrdens={ordens.length}
                totalProdutos={produtos.length}
                onBackup={handleBackup}
                onResetar={handleResetarPadrao}
                onRestaurarBackup={handleRestaurarBackup}
              />
            )}
          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAIS DO SISTEMA */}
      {/* ======================================================== */}

      {/* 1. Modal Nova Ordem de Produção (com seletor dinâmico de produtos) */}
      <ModalNovaOrdem
        isOpen={modalNovaOrdemOpen}
        onClose={() => setModalNovaOrdemOpen(false)}
        produtos={produtos}
        ordemParaEditar={ordemParaEditar}
        onSalvar={handleSalvarOrdem}
        onAbrirCadastroProduto={() => {
          setProdutoParaEditar(null);
          setModalNovoProdutoOpen(true);
        }}
      />

      {/* 2. Modal Novo Produto */}
      <ModalNovoProduto
        isOpen={modalNovoProdutoOpen}
        onClose={() => setModalNovoProdutoOpen(false)}
        produtoParaEditar={produtoParaEditar}
        onSalvar={handleSalvarProduto}
      />

      {/* 3. Modal Nova OS */}
      <ModalNovaOS
        isOpen={modalNovaOSOpen}
        onClose={() => setModalNovaOSOpen(false)}
        produtos={produtos}
        osParaEditar={osParaEditar}
        onSalvar={handleSalvarOS}
        onAbrirCadastroProduto={() => {
          setProdutoParaEditar(null);
          setModalNovoProdutoOpen(true);
        }}
      />

      {/* 4. Modais de Roteiro */}
      <ModalNovoRoteiroProduto
        isOpen={modalNovoRoteiroOpen}
        onClose={() => setModalNovoRoteiroOpen(false)}
        produtos={produtos}
        roteiros={roteiros}
        onSalvar={handleSalvarRoteiroProduto}
      />

      <ModalNovoComponente
        isOpen={modalNovoComponenteOpen}
        onClose={() => setModalNovoComponenteOpen(false)}
        roteiros={roteiros}
        roteiroPreSelecionadoId={roteiroPreSelecionadoId}
        onSalvar={handleSalvarComponente}
      />

      <ModalNovaOperacao
        isOpen={modalNovaOperacaoOpen}
        onClose={() => setModalNovaOperacaoOpen(false)}
        roteiros={roteiros}
        centros={centros}
        preSelected={operacaoPreSelected}
        onSalvar={handleSalvarOperacao}
      />

      {/* 5. Modais de BoM, Centros, Qualidade, Estoque */}
      <ModalNovaBom
        isOpen={modalNovaBomOpen}
        onClose={() => setModalNovaBomOpen(false)}
        produtos={produtos}
        bomParaEditar={bomParaEditar}
        onSalvar={handleSalvarBom}
      />

      <ModalNovoCentro
        isOpen={modalNovoCentroOpen}
        onClose={() => setModalNovoCentroOpen(false)}
        centroParaEditar={centroParaEditar}
        onSalvar={handleSalvarCentro}
      />

      <ModalNovaInspecao
        isOpen={modalNovaInspecaoOpen}
        onClose={() => setModalNovaInspecaoOpen(false)}
        produtos={produtos}
        inspecaoParaEditar={inspecaoParaEditar}
        onSalvar={handleSalvarInspecao}
      />

      <ModalNovoMaterial
        isOpen={modalNovoMaterialOpen}
        onClose={() => setModalNovoMaterialOpen(false)}
        materialParaEditar={materialParaEditar}
        onSalvar={handleSalvarMaterial}
      />

      <ModalMovimentacao
        isOpen={modalMovimentacaoOpen}
        onClose={() => setModalMovimentacaoOpen(false)}
        materiais={materiais}
        onMovimentar={handleMovimentarEstoque}
      />

      {/* Modal Ajuda do Sistema */}
      {modalAjudaOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setModalAjudaOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                Guia Rápido - Sistema Fábrica PRO v5.1
              </h2>
              <button
                onClick={() => setModalAjudaOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                <strong>1. Criar OPs com novos produtos:</strong> Agora o seletor de produtos nas telas de <em>Nova Ordem de Produção (OP)</em> e <em>Nova Ordem de Serviço (OS)</em> sincroniza automaticamente todos os produtos cadastrados na aba <strong>Produtos</strong> (como <em>Guindaste</em>, <em>Filetadora 100</em>, etc.), além de permitir cadastrar um produto novo diretamente pelo botão rápido <em>+ Cadastrar Novo Produto</em> dentro do modal.
              </p>
              <p>
                <strong>2. Kanban & Produção:</strong> Arraste cartões entre as colunas ou use o botão <em>Avançar Etapa (+15%)</em> para apontar a fabricação em tempo real.
              </p>
              <p>
                <strong>3. Engenharia de Roteiro:</strong> Vincule operações específicas (Corte, Torno CNC, Mandrilamento, Solda) aos produtos e componentes cadastrados.
              </p>
              <p>
                <strong>4. Relatórios PDF:</strong> Exporte relatórios formais da produção, ordens de serviço e auditoria com um clique.
              </p>
              <p>
                <strong>5. Licença Vitalícia PRO:</strong> O bloqueio temporário de 7 dias foi desativado e o sistema opera com licença completa e irrestrita.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setModalAjudaOpen(false)}
                className="px-4 py-1.5 bg-slate-800 dark:bg-amber-600 text-white rounded-lg text-xs font-bold"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
