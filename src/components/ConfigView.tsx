import React, { useRef } from 'react';
import {
  Settings,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  User,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  FileCode,
  Share2,
} from 'lucide-react';
import { UsuarioApp } from '../types';

interface Props {
  usuario: UsuarioApp;
  onMudarUsuario: (novo: UsuarioApp) => void;
  totalOrdens: number;
  totalProdutos: number;
  onBackup: () => void;
  onResetar: () => void;
  onRestaurarBackup: (dadosJson: string) => void;
}

export const ConfigView: React.FC<Props> = ({
  usuario,
  onMudarUsuario,
  totalOrdens,
  totalProdutos,
  onBackup,
  onResetar,
  onRestaurarBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const perfisDemo: UsuarioApp[] = [
    { username: 'admin', name: 'Administrador PCP', role: 'admin' },
    { username: 'eng', name: 'Engenheiro de Produção', role: 'engenheiro' },
    { username: 'prod', name: 'Operador Chão de Fábrica', role: 'producao' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onRestaurarBackup(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadHtml = async () => {
    try {
      const res = await fetch('/sistema_fabrica_pro.html');
      const text = await res.text();
      const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sistema_fabrica_pro.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      window.location.href = '/sistema_fabrica_pro.html';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>⚙️</span> Configurações do Sistema & Licença
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Parâmetros operacionais, gerenciamento de dados locais e controle de acessos
        </p>
      </div>

      {/* Card da Licença PRO Vitalícia */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Sistema Fábrica PRO v5.1 - Licença Vitalícia Ativa</h2>
          </div>
          <p className="text-xs text-slate-300">
            Acesso liberado sem bloqueios ou restrições temporais de teste. Todos os módulos de PCP e Engenharia habilitados.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Vitalício
          </span>
        </div>
      </div>

      {/* Grid de Informações do Sistema */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Building className="w-4 h-4 text-amber-600" />
            <span>Empresa / Fábrica</span>
          </div>
          <strong className="text-slate-800 dark:text-slate-200 text-sm block">Cilindros Hidráulicos PRO</strong>
          <span className="text-[11px] text-slate-400">Rua da Indústria, 456 - Polo Metalúrgico</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Suporte Técnico</span>
          </div>
          <strong className="text-slate-800 dark:text-slate-200 text-sm block">martinsdesiqueiraigor@gmail.com</strong>
          <span className="text-[11px] text-slate-400">(19) 99681-6755</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <User className="w-4 h-4 text-amber-600" />
            <span>Sessão Atual</span>
          </div>
          <strong className="text-slate-800 dark:text-slate-200 text-sm block">{usuario.name}</strong>
          <span className="text-[11px] text-amber-600 font-mono uppercase font-bold">Nível: {usuario.role}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
            <Settings className="w-4 h-4 text-amber-600" />
            <span>Estatísticas de Banco</span>
          </div>
          <strong className="text-slate-800 dark:text-slate-200 text-sm block">{totalOrdens} Ordens • {totalProdutos} Produtos</strong>
          <span className="text-[11px] text-slate-400">Armazenamento Local Storage v5.1</span>
        </div>
      </div>

      {/* Alternar Perfil de Acesso */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          👤 Alternar Perfil de Acesso (Simulação de Níveis de Permissão)
        </h3>
        <p className="text-xs text-slate-500">
          Permite testar as visões da fábrica com diferentes níveis de acesso (Admin, Engenharia ou Operador de Produção).
        </p>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {perfisDemo.map((p) => {
            const isAtivo = usuario.username === p.username;
            return (
              <button
                key={p.username}
                type="button"
                onClick={() => onMudarUsuario(p)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                  isAtivo
                    ? 'bg-slate-800 dark:bg-amber-600 text-white border-slate-800 dark:border-amber-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{p.name}</span>
                <span className="text-[10px] uppercase font-mono text-slate-400">({p.role})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exportar como Arquivo Único HTML (Offline & Compartilhamento Fácil) */}
      <div className="p-5 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/50 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            📦 Exportar Sistema em Arquivo Único (.HTML)
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Baixe o aplicativo completo em um único arquivo <strong>.HTML</strong> autônomo. Você pode compartilhá-lo diretamente pelo WhatsApp ou e-mail, abri-lo offline com dois cliques em qualquer celular ou computador, e inspecionar todo o código fonte.
        </p>

        <div className="pt-1 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Arquivo .HTML Autônomo (Offline / WhatsApp)</span>
          </button>
        </div>
      </div>

      {/* Gestão de Dados e Backup */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          💾 Gestão de Dados, Backup & Restauração
        </h3>
        <p className="text-xs text-slate-500">
          Exporte um arquivo JSON completo com todas as suas OPs, produtos cadastrados, roteiros e estoques para guardar ou transferir entre dispositivos.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onBackup}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Fazer Backup (Exportar JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Restaurar Backup (Importar JSON)</span>
          </button>

          <button
            type="button"
            onClick={onResetar}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Padrões de Fábrica</span>
          </button>
        </div>
      </div>
    </div>
  );
};
