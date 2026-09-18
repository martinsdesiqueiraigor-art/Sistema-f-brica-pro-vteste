import React from 'react';
import { Menu, Search, Sun, Moon, Bell, HelpCircle, ShieldCheck } from 'lucide-react';
import { UsuarioApp } from '../types';

interface Props {
  usuario: UsuarioApp;
  temaEscuro: boolean;
  onAlternarTema: () => void;
  onAbrirSidebar: () => void;
  busca: string;
  onMudarBusca: (termo: string) => void;
  totalNotificacoes: number;
  onAbrirNotificacoes: () => void;
  onAbrirAjuda: () => void;
  onNavegar: (pagina: string) => void;
}

export const Topbar: React.FC<Props> = ({
  usuario,
  temaEscuro,
  onAlternarTema,
  onAbrirSidebar,
  busca,
  onMudarBusca,
  totalNotificacoes,
  onAbrirNotificacoes,
  onAbrirAjuda,
  onNavegar,
}) => {
  return (
    <header
      id="appTopbar"
      className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3"
    >
      {/* Esquerda: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          id="btnToggleSidebarMobile"
          type="button"
          onClick={onAbrirSidebar}
          aria-label="Abrir menu de navegação"
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          id="logoMarca"
          onClick={() => onNavegar('dashboard')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <span className="text-xl">🏭</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base tracking-tight text-white">Sistema Fábrica</span>
            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm tracking-wider uppercase shadow-xs">
              PRO
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">v5.1</span>
          </div>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative hidden md:block ml-4">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="inputBuscaGlobal"
            type="text"
            value={busca}
            onChange={(e) => onMudarBusca(e.target.value)}
            placeholder="Buscar OP, produto ou cliente..."
            className="w-56 lg:w-64 pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700/80 rounded-full text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:w-72 transition-all"
          />
        </div>
      </div>

      {/* Direita: Status de Licença + Tema + Notificações + Usuário */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Badge Licença PRO Permanente (sem trava de trial) */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 rounded-full text-[11px] font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Licença PRO Ativa</span>
        </div>

        {/* Alternar Tema */}
        <button
          id="btnToggleTema"
          type="button"
          onClick={onAlternarTema}
          title={temaEscuro ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {temaEscuro ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notificações */}
        <button
          id="btnNotificacoes"
          type="button"
          onClick={onAbrirNotificacoes}
          title="Notificações do Sistema"
          className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {totalNotificacoes > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Ajuda */}
        <button
          id="btnAjuda"
          type="button"
          onClick={onAbrirAjuda}
          title="Guia do Sistema"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Perfil do Usuário */}
        <div
          id="usuarioBadge"
          className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-700/80 cursor-pointer"
          onClick={() => onNavegar('config')}
        >
          <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
            {usuario.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-left text-xs leading-tight">
            <div className="font-semibold text-slate-200">{usuario.name}</div>
            <div className="text-[10px] text-amber-400 font-mono uppercase">{usuario.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
