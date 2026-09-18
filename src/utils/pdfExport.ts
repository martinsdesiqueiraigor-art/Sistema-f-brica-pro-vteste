import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrdemProducao, OrdemServico, RoteiroProduto, LogAuditoria } from '../types';

export function exportProducaoPDF(ordens: OrdemProducao[]) {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Cabeçalho
  doc.setFillColor(26, 58, 74);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('SISTEMA FÁBRICA PRO - PCP & PRODUÇÃO', 14, 15);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.text(`Relatório Geral de Ordens de Produção (OP)`, 14, 32);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')} | Total de ordens: ${ordens.length}`, 14, 38);

  const tableData = ordens.map((o) => [
    o.id,
    o.produto,
    o.serie || '-',
    `${o.quantidade} un`,
    o.dataInicio,
    o.operador,
    o.status.toUpperCase(),
    `${o.progresso}%`,
  ]);

  autoTable(doc, {
    startY: 44,
    head: [['OP', 'Produto', 'Série', 'Qtd', 'Início', 'Operador', 'Status', 'Progresso']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [26, 58, 74], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  doc.save(`relatorio_producao_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportOSPDF(ordensServico: OrdemServico[]) {
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFillColor(26, 58, 74);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('SISTEMA FÁBRICA PRO - ORDENS DE SERVIÇO', 14, 15);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.text(`Relatório Comercial e Ordens de Serviço (OS)`, 14, 32);
  doc.setFontSize(9);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')} | Total de OS: ${ordensServico.length}`, 14, 38);

  const tableData = ordensServico.map((os) => [
    os.id,
    os.cliente,
    os.produto,
    `${os.quantidade} un`,
    os.data,
    `R$ ${os.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    os.status.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: 44,
    head: [['OS', 'Cliente', 'Produto', 'Qtd', 'Data', 'Valor (R$)', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [230, 126, 34], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  doc.save(`relatorio_os_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportRoteiroPDF(roteiros: RoteiroProduto[]) {
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFillColor(26, 58, 74);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('ROTEIRO DE FABRICAÇÃO E ENGENHARIA', 14, 15);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 32);

  let startY = 38;

  roteiros.forEach((roteiro) => {
    doc.setFontSize(12);
    doc.setTextColor(26, 58, 74);
    doc.text(`Produto: ${roteiro.produtoNome}`, 14, startY);
    startY += 6;

    const rows: string[][] = [];
    roteiro.componentes.forEach((comp) => {
      comp.operacoes.forEach((op) => {
        rows.push([comp.nome, `#${op.id} ${op.titulo}`, op.centro, `${op.tempo} min`, op.descricao || '-']);
      });
    });

    if (rows.length > 0) {
      autoTable(doc, {
        startY: startY,
        head: [['Componente', 'Operação', 'Centro de Trabalho', 'Tempo Padrão', 'Instruções']],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [52, 73, 94], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2 },
      });
      // @ts-expect-error lastAutoTable injected by plugin
      startY = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('(Nenhuma operação cadastrada para este produto)', 20, startY);
      startY += 10;
    }

    if (startY > 260) {
      doc.addPage();
      startY = 20;
    }
  });

  doc.save(`roteiro_fabricacao_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportHistoricoPDF(logs: LogAuditoria[]) {
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFillColor(26, 58, 74);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('AUDITORIA E HISTÓRICO DE PRODUÇÃO', 14, 15);

  const tableData = logs.map((l) => [
    new Date(l.data).toLocaleString('pt-BR'),
    l.usuario,
    l.acao,
    l.detalhes,
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['Data / Hora', 'Usuário', 'Ação', 'Detalhes']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [44, 62, 80], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  doc.save(`historico_auditoria_${new Date().toISOString().split('T')[0]}.pdf`);
}
