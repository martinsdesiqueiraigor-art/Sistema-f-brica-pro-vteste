export type StatusOrdem = 'planejado' | 'producao' | 'teste' | 'concluido' | 'pendente';
export type PrioridadeOrdem = 'baixa' | 'media' | 'alta' | 'urgente';

export interface Produto {
  id: number;
  nome: string;
  codigo: string;
  categoria?: string;
  spec?: string;
  ativo?: boolean;
}

export interface OperacaoRoteiro {
  id: number;
  titulo: string;
  descricao?: string;
  centro: string;
  tempo: number; // minutos
  concluida?: boolean;
}

export interface ComponenteRoteiro {
  id: number;
  nome: string;
  operacoes: OperacaoRoteiro[];
}

export interface RoteiroProduto {
  id: number;
  produtoId: number;
  produtoNome: string;
  componentes: ComponenteRoteiro[];
}

export interface OrdemProducao {
  id: string; // Ex: CH-001
  produto: string;
  produtoId?: number;
  serie: string;
  quantidade: number;
  dataInicio: string;
  previsaoEntrega?: string;
  status: StatusOrdem;
  progresso: number;
  operador: string;
  prioridade?: PrioridadeOrdem;
  observacoes?: string;
  etapaAtual?: string;
}

export interface OrdemServico {
  id: string; // Ex: OS-001
  cliente: string;
  produto: string;
  produtoId?: number;
  quantidade: number;
  data: string;
  valor: number;
  status: StatusOrdem;
  observacoes?: string;
}

export interface BoM {
  id: number;
  nome: string;
  produtoId?: number;
  componentes: string[];
}

export interface CentroTrabalho {
  id: number;
  nome: string;
  capacidade: number; // pecas/dia
  eficiencia: number; // %
  operador: string;
  status?: 'ativo' | 'manutencao' | 'parado';
}

export interface InspecaoQualidade {
  id: number;
  produto: string;
  tipo: 'Hidráulico' | 'Dimensional' | 'Visual' | 'Funcional';
  resultado: 'aprovado' | 'reprovado' | 'pendente';
  observacoes?: string;
  data?: string;
  inspetor?: string;
}

export interface MaterialEstoque {
  id: number;
  nome: string;
  categoria: 'Matéria-prima' | 'Produtos Acabados' | 'Insumos' | 'Componentes';
  quantidade: number;
  minimo: number;
  localizacao: string;
  unidade?: string;
}

export interface LogAuditoria {
  id: number;
  usuario: string;
  acao: string;
  detalhes: string;
  data: string;
}

export interface UsuarioApp {
  username: string;
  name: string;
  role: 'admin' | 'engenheiro' | 'producao';
}
