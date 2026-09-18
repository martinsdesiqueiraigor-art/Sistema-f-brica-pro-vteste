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
} from '../types';

export const PRODUTOS_INICIAIS: Produto[] = [
  {
    id: 1,
    nome: 'Cilindro Série 150',
    codigo: 'CH-150',
    categoria: 'Cilindros',
    spec: 'Diâmetro: 150mm\nPressão: 300 bar\nCurso: 800mm\nComponentes: 7 peças',
    ativo: true,
  },
  {
    id: 2,
    nome: 'Cilindro Telescópico',
    codigo: 'CH-TEL',
    categoria: 'Cilindros',
    spec: 'Estágios: 3\nPressão: 250 bar\nCurso: 2000mm\nComponentes: 5 peças',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Cilindro Série 100',
    codigo: 'CH-100',
    categoria: 'Cilindros',
    spec: 'Diâmetro: 100mm\nPressão: 250 bar\nCurso: 600mm\nComponentes: 6 peças',
    ativo: true,
  },
  {
    id: 4,
    nome: 'Bloco de Válvulas',
    codigo: 'BV-300',
    categoria: 'Hidráulica',
    spec: 'Pressão: 350 bar\nVias: 4\nMaterial: Aço nodular GGG40',
    ativo: true,
  },
  {
    id: 5,
    nome: 'Guindaste',
    codigo: 'Gui 001',
    categoria: 'Equipamentos',
    spec: 'Capacidade: 2.5 ton\nAlcance: 4.2m\nTipo: Guindaste leve articulado',
    ativo: true,
  },
  {
    id: 6,
    nome: 'Filetadora 100',
    codigo: 'FI 100',
    categoria: 'Máquinas',
    spec: 'Potência: 5.5 CV\nCapacidade: Tubos até 4 polegadas',
    ativo: true,
  },
  {
    id: 7,
    nome: 'Kit Reparo Série 150',
    codigo: 'KR-150',
    categoria: 'Kits',
    spec: 'Composição: Anéis raspadores, gaxetas chevron, o-rings viton',
    ativo: true,
  },
];

export const ORDENS_INICIAIS: OrdemProducao[] = [
  {
    id: 'CH-001',
    produto: 'Cilindro Série 150',
    produtoId: 1,
    serie: 'Série 150',
    quantidade: 10,
    dataInicio: new Date().toISOString().split('T')[0],
    previsaoEntrega: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    status: 'producao',
    progresso: 65,
    operador: 'Carlos Silva',
    prioridade: 'alta',
    etapaAtual: 'Mandrilamento Interno',
  },
  {
    id: 'CH-002',
    produto: 'Cilindro Telescópico',
    produtoId: 2,
    serie: 'Telescópico',
    quantidade: 5,
    dataInicio: new Date().toISOString().split('T')[0],
    previsaoEntrega: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    status: 'teste',
    progresso: 85,
    operador: 'Mariana Costa',
    prioridade: 'urgente',
    etapaAtual: 'Teste de Pressão Hidráulica',
  },
  {
    id: 'CH-003',
    produto: 'Cilindro Série 100',
    produtoId: 3,
    serie: 'Série 100',
    quantidade: 15,
    dataInicio: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    previsaoEntrega: new Date().toISOString().split('T')[0],
    status: 'concluido',
    progresso: 100,
    operador: 'José Santos',
    prioridade: 'media',
    etapaAtual: 'Liberado para expedição',
  },
  {
    id: 'CH-004',
    produto: 'Bloco de Válvulas',
    produtoId: 4,
    serie: 'Bloco de Válvulas',
    quantidade: 8,
    dataInicio: new Date().toISOString().split('T')[0],
    previsaoEntrega: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    status: 'planejado',
    progresso: 0,
    operador: 'Roberto Almeida',
    prioridade: 'media',
    etapaAtual: 'Aguardando liberação de matéria-prima',
  },
  {
    id: 'CH-005',
    produto: 'Guindaste',
    produtoId: 5,
    serie: 'Equipamento',
    quantidade: 2,
    dataInicio: new Date().toISOString().split('T')[0],
    previsaoEntrega: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    status: 'pendente',
    progresso: 10,
    operador: 'Carlos Silva',
    prioridade: 'alta',
    etapaAtual: 'Corte e preparação das longarinas',
  },
];

export const ORDENS_SERVICO_INICIAIS: OrdemServico[] = [
  {
    id: 'OS-001',
    cliente: 'Hidráulica Sul',
    produto: 'Cilindro Série 150',
    produtoId: 1,
    quantidade: 10,
    data: new Date().toISOString().split('T')[0],
    valor: 32500,
    status: 'producao',
    observacoes: 'Entrega técnica solicitada',
  },
  {
    id: 'OS-002',
    cliente: 'Máquinas Norte',
    produto: 'Cilindro Telescópico',
    produtoId: 2,
    quantidade: 5,
    data: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    valor: 28800,
    status: 'teste',
    observacoes: 'Testar com fluido anti-chama',
  },
  {
    id: 'OS-003',
    cliente: 'Construção Leste',
    produto: 'Bloco de Válvulas',
    produtoId: 4,
    quantidade: 8,
    data: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    valor: 15200,
    status: 'concluido',
  },
  {
    id: 'OS-004',
    cliente: 'Agro Indústria S/A',
    produto: 'Guindaste',
    produtoId: 5,
    quantidade: 2,
    data: new Date().toISOString().split('T')[0],
    valor: 48000,
    status: 'planejado',
  },
];

export const ROTEIROS_INICIAIS: RoteiroProduto[] = [
  {
    id: 1,
    produtoId: 1,
    produtoNome: 'Cilindro Série 150',
    componentes: [
      {
        id: 1,
        nome: 'Camisa',
        operacoes: [
          { id: 1, titulo: 'Corte do Tubo', descricao: 'Corte de tubo seamless Ø120mm', centro: 'Corte', tempo: 15 },
          { id: 2, titulo: 'Faceamento', descricao: 'Faceamento das extremidades', centro: 'Torno Vertical', tempo: 12 },
          { id: 3, titulo: 'Mandrilamento Interno', descricao: 'Mandrilamento para ajuste do pistão', centro: 'Torno Vertical', tempo: 25 },
          { id: 4, titulo: 'Torneamento Externo', descricao: 'Acabamento externo e roscas', centro: 'Torno Vertical', tempo: 20 },
        ],
      },
      {
        id: 2,
        nome: 'Haste',
        operacoes: [
          { id: 5, titulo: 'Corte da Barra', descricao: 'Corte de barra Ø50mm', centro: 'Corte', tempo: 10 },
          { id: 6, titulo: 'Torneamento', descricao: 'Torneamento de desbaste e acabamento', centro: 'Torno CNC', tempo: 30 },
          { id: 7, titulo: 'Retífica', descricao: 'Retífica de precisão (±0,005mm)', centro: 'Retífica', tempo: 25 },
          { id: 8, titulo: 'Roscamento', descricao: 'Rosca para olhal', centro: 'Torno CNC', tempo: 15 },
          { id: 9, titulo: 'Polimento', descricao: 'Polimento final (Ra 0,4)', centro: 'Acabamento', tempo: 10 },
        ],
      },
      {
        id: 3,
        nome: 'Pistão',
        operacoes: [
          { id: 10, titulo: 'Corte', descricao: 'Corte de barra Ø100mm', centro: 'Corte', tempo: 12 },
          { id: 11, titulo: 'Torneamento', descricao: 'Torneamento de acabamento', centro: 'Torno CNC', tempo: 25 },
          { id: 12, titulo: 'Fresamento de Canais', descricao: 'Canais para anéis de vedação', centro: 'Centro de Usinagem', tempo: 20 },
          { id: 13, titulo: 'Furação e Roscamento', descricao: 'Furos de fixação', centro: 'Centro de Usinagem', tempo: 18 },
        ],
      },
      {
        id: 4,
        nome: 'Montagem e Teste',
        operacoes: [
          { id: 14, titulo: 'Solda Robotizada', descricao: 'Solda fundo e olhal', centro: 'Solda Robotizada', tempo: 20 },
          { id: 15, titulo: 'Montagem Geral', descricao: 'Montagem completa dos componentes', centro: 'Bancada de Montagem', tempo: 30 },
          { id: 16, titulo: 'Teste Hidráulico', descricao: 'Teste a 300 bar de pressão estática', centro: 'Banco de Testes', tempo: 25 },
          { id: 17, titulo: 'Inspeção Final', descricao: 'Inspeção dimensional e acabamento', centro: 'Controle de Qualidade', tempo: 15 },
        ],
      },
    ],
  },
  {
    id: 2,
    produtoId: 2,
    produtoNome: 'Cilindro Telescópico',
    componentes: [
      {
        id: 5,
        nome: 'Estágios 1, 2 e 3',
        operacoes: [
          { id: 18, titulo: 'Corte dos Tubos', descricao: 'Corte concêntrico dos estágios', centro: 'Corte', tempo: 25 },
          { id: 19, titulo: 'Mandrilamento Estágios', descricao: 'Mandrilamento escalonado', centro: 'Torno Vertical', tempo: 45 },
          { id: 20, titulo: 'Usinagem de Canais', descricao: 'Canais internos de vedação', centro: 'Centro de Usinagem', tempo: 35 },
        ],
      },
      {
        id: 6,
        nome: 'Montagem e Teste Telescópico',
        operacoes: [
          { id: 21, titulo: 'Montagem Sucessiva', descricao: 'Montagem dos anéis e estágios', centro: 'Bancada de Montagem', tempo: 40 },
          { id: 22, titulo: 'Teste de Extensão e Pressão', descricao: 'Teste com curso de 2000mm a 250 bar', centro: 'Banco de Testes', tempo: 35 },
        ],
      },
    ],
  },
  {
    id: 3,
    produtoId: 5,
    produtoNome: 'Guindaste',
    componentes: [
      {
        id: 7,
        nome: 'Estrutura e Lança',
        operacoes: [
          { id: 23, titulo: 'Corte Chapa Estrutural', descricao: 'Corte a plasma de chapas', centro: 'Corte', tempo: 40 },
          { id: 24, titulo: 'Soldagem da Coluna e Lança', descricao: 'Solda estrutural certificada', centro: 'Solda Robotizada', tempo: 60 },
          { id: 25, titulo: 'Usinagem dos Alojamentos', descricao: 'Usinagem dos olhais de articulação', centro: 'Centro de Usinagem', tempo: 45 },
        ],
      },
      {
        id: 8,
        nome: 'Montagem Hidráulica e Carga',
        operacoes: [
          { id: 26, titulo: 'Instalação dos Cilindros', descricao: 'Acoplamento dos cilindros de elevação', centro: 'Bancada de Montagem', tempo: 50 },
          { id: 27, titulo: 'Teste de Içamento com Carga', descricao: 'Teste estático a 125% da carga', centro: 'Banco de Testes', tempo: 45 },
        ],
      },
    ],
  },
  {
    id: 4,
    produtoId: 6,
    produtoNome: 'Filetadora 100',
    componentes: [
      {
        id: 9,
        nome: 'Base e Cabeçote',
        operacoes: [
          { id: 28, titulo: 'Usinagem do Barramento', descricao: 'Fresamento da guia prismática', centro: 'Centro de Usinagem', tempo: 50 },
          { id: 29, titulo: 'Montagem dos Mandris e Motor', descricao: 'Montagem do redutor e castanhas', centro: 'Bancada de Montagem', tempo: 45 },
          { id: 30, titulo: 'Aferição de Rosca e Teste', descricao: 'Filetamento de amostra e checagem', centro: 'Controle de Qualidade', tempo: 20 },
        ],
      },
    ],
  },
];

export const BOMS_INICIAIS: BoM[] = [
  {
    id: 1,
    nome: 'Cilindro Série 150',
    produtoId: 1,
    componentes: ['Camisa Tubular Ø120mm', 'Haste Cromada Ø50mm', 'Pistão Ø100mm', 'Guia de Bronze', 'Porca de Travamento', 'Fundo Forjado', 'Olhal de Fixação', 'Kit Vedações'],
  },
  {
    id: 2,
    nome: 'Cilindro Telescópico',
    produtoId: 2,
    componentes: ['Estágio 1 (Ø100mm)', 'Estágio 2 (Ø80mm)', 'Estágio 3 (Ø60mm)', 'Haste Final Ø40mm', 'Kit Vedações Multiestágio'],
  },
  {
    id: 3,
    nome: 'Guindaste',
    produtoId: 5,
    componentes: ['Coluna Estrutural', 'Lança Telescópica', 'Cilindro de Elevação', 'Cilindro de Extensão', 'Válvula Contra-balanço', 'Bomba Hidráulica'],
  },
  {
    id: 4,
    nome: 'Filetadora 100',
    produtoId: 6,
    componentes: ['Base de Ferro Fundido', 'Cabeçote de Roscamento', 'Motor Elétrico Trifásico', 'Mandril de Fixação', 'Bomba de Óleo Refrigerante'],
  },
];

export const CENTROS_INICIAIS: CentroTrabalho[] = [
  { id: 1, nome: 'Corte', capacidade: 50, eficiencia: 94, operador: 'Antonio Dias', status: 'ativo' },
  { id: 2, nome: 'Torno Vertical', capacidade: 40, eficiencia: 92, operador: 'Carlos Silva', status: 'ativo' },
  { id: 3, nome: 'Torno CNC', capacidade: 45, eficiencia: 95, operador: 'Alexandre Souza', status: 'ativo' },
  { id: 4, nome: 'Centro de Usinagem', capacidade: 35, eficiencia: 88, operador: 'Roberto Almeida', status: 'ativo' },
  { id: 5, nome: 'Retífica', capacidade: 30, eficiencia: 91, operador: 'Fernando Lima', status: 'ativo' },
  { id: 6, nome: 'Solda Robotizada', capacidade: 25, eficiencia: 96, operador: 'Mariana Costa', status: 'ativo' },
  { id: 7, nome: 'Bancada de Montagem', capacidade: 20, eficiencia: 90, operador: 'José Santos', status: 'ativo' },
  { id: 8, nome: 'Banco de Testes', capacidade: 15, eficiencia: 98, operador: 'Ana Paula', status: 'ativo' },
  { id: 9, nome: 'Controle de Qualidade', capacidade: 30, eficiencia: 99, operador: 'Beatriz Ramos', status: 'ativo' },
  { id: 10, nome: 'Acabamento', capacidade: 35, eficiencia: 93, operador: 'Lucas Martins', status: 'ativo' },
];

export const INSPECOES_INICIAIS: InspecaoQualidade[] = [
  {
    id: 1,
    produto: 'CH-002 - Cilindro Telescópico',
    tipo: 'Hidráulico',
    resultado: 'aprovado',
    observacoes: 'Pressão nominal 250 bar sustentada por 15min sem queda.',
    data: new Date().toISOString().split('T')[0],
    inspetor: 'Beatriz Ramos',
  },
  {
    id: 2,
    produto: 'CH-001 - Cilindro Série 150',
    tipo: 'Dimensional',
    resultado: 'aprovado',
    observacoes: 'Rugosidade da camisa Ra 0.35um e concentricidade dentro da norma ISO 6020.',
    data: new Date().toISOString().split('T')[0],
    inspetor: 'Beatriz Ramos',
  },
  {
    id: 3,
    produto: 'CH-005 - Guindaste',
    tipo: 'Visual',
    resultado: 'pendente',
    observacoes: 'Aguardando solda da base para inspeção por líquido penetrante.',
    data: new Date().toISOString().split('T')[0],
    inspetor: 'Ana Paula',
  },
];

export const MATERIAIS_INICIAIS: MaterialEstoque[] = [
  { id: 1, nome: 'Tubo Seamless DIN 2391 Ø120mm', categoria: 'Matéria-prima', quantidade: 45, minimo: 20, localizacao: 'Rua A - Prateleira 1', unidade: 'barras' },
  { id: 2, nome: 'Barra Cromada Aço SAE 1045 Ø50mm', categoria: 'Matéria-prima', quantidade: 14, minimo: 15, localizacao: 'Rua A - Prateleira 2', unidade: 'barras' },
  { id: 3, nome: 'Chapa Estrutural ASTM A36 12mm', categoria: 'Matéria-prima', quantidade: 22, minimo: 10, localizacao: 'Pátio de Chapas', unidade: 'un' },
  { id: 4, nome: 'Cilindro Série 150 (Acabado)', categoria: 'Produtos Acabados', quantidade: 8, minimo: 5, localizacao: 'Expedição Setor C', unidade: 'peças' },
  { id: 5, nome: 'Cilindro Telescópico (Acabado)', categoria: 'Produtos Acabados', quantidade: 3, minimo: 2, localizacao: 'Expedição Setor C', unidade: 'peças' },
  { id: 6, nome: 'Kit Vedação Poliuretano Ø100mm', categoria: 'Insumos', quantidade: 38, minimo: 15, localizacao: 'Almoxarifado B1', unidade: 'jogos' },
  { id: 7, nome: 'Óleo Hidráulico ISO VG 68', categoria: 'Insumos', quantidade: 280, minimo: 120, localizacao: 'Depósito Químicos', unidade: 'litros' },
  { id: 8, nome: 'Olhal Forjado com Rótula Esférica', categoria: 'Componentes', quantidade: 50, minimo: 20, localizacao: 'Almoxarifado B3', unidade: 'un' },
];

export const AUDIT_INICIAL: LogAuditoria[] = [
  {
    id: 1,
    usuario: 'Administrador',
    acao: 'Sistema inicializado',
    detalhes: 'Base de dados pronta com catálogo de produtos e roteiros ativos',
    data: new Date().toISOString(),
  },
  {
    id: 2,
    usuario: 'Administrador',
    acao: 'Produto Cadastrado',
    detalhes: 'Guindaste e Filetadora 100 sincronizados com PCP',
    data: new Date(Date.now() - 3600000).toISOString(),
  },
];
