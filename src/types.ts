export type StatusOrdem = 'planejado' | 'producao' | 'teste' | 'concluido' | 'pendente';
export type PrioridadeOrdem = 'baixa' | 'media' | 'alta' | 'urgente';

export interface Produto {
  id: number;
  nome: string;
  codigo: string;
  numeroDesenho?: string;
  categoria?: string;
  spec?: string;
  ativo?: boolean;
}

export interface OperadorMES {
  matricula: string; // Ex: '1024'
  nome: string;
  turno: 'Turno A' | 'Turno B' | 'Turno C';
  senha?: string;
  ativo: boolean;
  avatar?: string;
}

export interface OperacaoRoteiro {
  id: number;
  titulo: string;
  descricao?: string;
  centro: string;
  codigoMaquinaPadrao?: string;
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
  numeroDesenho?: string;
  componentes: ComponenteRoteiro[];
}

export interface EtapaExecucaoOP {
  id: number;
  numeroEtapa: number; // 10, 20, 30...
  descricaoEtapa: string;
  codigoMaquinaPadrao: string;
  tempoCicloMinutos: number;
  saldoResidual: number;
  statusExecucao: 'Pendente' | 'Em Execução' | 'Concluída';
}

export interface ApontamentoMES {
  id: number;
  numOp: string;
  numeroEtapa: number;
  descricaoEtapa: string;
  operadorMatricula: string;
  operadorNome: string;
  codigoMaquina: string;
  qtdBoas: number | null; // null enquanto estiver em andamento (Ativo)
  refugo: number;
  motivoRefugo?: string;
  dataHoraInicio: string; // ISO string
  dataHoraFim?: string;
  status: 'Ativo' | 'Concluido';
}

export interface ParadaMaquina {
  id: number;
  codigoMaquina: string;
  operadorMatricula: string;
  operadorNome: string;
  motivo:
    | 'Falta de Matéria-Prima'
    | 'Quebra de Ferramenta / Componente'
    | 'Setup / Troca de Dispositivo'
    | 'Manutenção Preventiva'
    | 'Aguardando Inspeção de Qualidade'
    | 'Outro';
  status: 'Ativa' | 'Encerrada';
  dataHoraInicio: string;
  dataHoraFim?: string;
  observacoes?: string;
}

export interface OrdemProducao {
  id: string; // Ex: CH-001 ou OP-001
  produto: string;
  produtoId?: number;
  numeroDesenho?: string;
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
  etapas?: EtapaExecucaoOP[];
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
  codigo: string; // Ex: TR-01, CNC-01, SR-01
  nome: string;
  capacidade: number; // pecas/dia
  eficiencia: number; // %
  operador: string;
  status: 'ativo' | 'manutencao' | 'parado';
  statusOperacional?: 'Ativa' | 'Parada' | 'Manutenção';
}

export interface InspecaoQualidade {
  id: number;
  produto: string;
  numOp?: string;
  tipo: 'Hidráulico' | 'Dimensional' | 'Visual' | 'Funcional';
  resultado: 'aprovado' | 'reprovado' | 'pendente';
  pressaoEnsaioBar?: number;
  tempoSustentacaoMin?: number;
  estanqueidade?: 'Sem vazamento' | 'Gotejamento' | 'Falha de vedação';
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
  matricula?: string;
  role: 'admin' | 'engenheiro' | 'producao' | 'operador';
  turno?: string;
}
