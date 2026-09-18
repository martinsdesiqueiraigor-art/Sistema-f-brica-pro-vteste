import React from 'react';
import { FileDown, Trash2, History } from 'lucide-react';
import { LogAuditoria } from '../types';

interface Props {
  auditLog: LogAuditoria[];
  onLimparHistorico: () => void;
  onExportarPDF: () => void;
}

export const HistoricoView: React.FC<Props> = ({
  auditLog,
  onLimparHistorico,
  onExportarPDF,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>📜</span> Histórico de Alterações & Auditoria
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Rastreabilidade de todas as ações de usuários, apontamentos de OPs e cadastros
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onExportarPDF}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Exportar PDF</span>
          </button>
          <button
            type="button"
            onClick={onLimparHistorico}
            className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Histórico</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 p-2">
        {auditLog.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Nenhum registro de histórico no momento.
          </div>
        ) : (
          auditLog.map((log) => (
            <div key={log.id} className="p-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{log.acao}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    {log.usuario}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{log.detalhes}</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">
                {new Date(log.data).toLocaleString('pt-BR')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
