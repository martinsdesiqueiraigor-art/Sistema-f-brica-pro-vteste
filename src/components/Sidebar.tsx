import React from 'react';
import {
  LayoutDashboard,
  Trello,
  Factory,
  ClipboardList,
  GitBranch,
  Layers,
  Wrench,
  Package,
  CheckCircle,
  Boxes,
  History,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { UsuarioApp } from '../types';

interface Props {
  paginaAtiva: string;
  onNavegar: (pagina: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  usuario: UsuarioApp;
  onLogout: () => void;
  contadores: {
    kanban: number;
    producao: number;
    os: number;
    roteiro: number;
    bom: number;
    centros: number;
    produtos: number;
    qualidade: number;
    estoque: number;
  };
}

export const Sidebar: React.FC<Props> = ({
  paginaAtiva,
  onNavegar,
  isOpenMobile,
  onCloseMobile,
  usuario,
  onLogout,
  contadores,
}) => {
  const isOperador = usuario.role === 'producao';

  const handleClickItem = (pagina: string) => {
    onNavegar(pagina);
    onCloseMobile();
  };

  const menuSections = [
    {
      titulo: 'Menu Principal',
      itens: [
        { id: 'dashboard', rotulo: 'Dashboard', icone: LayoutDashboard, count: null },
        { id: 'kanban', rotulo: 'Kanban', icone: Trello, count: contadores.kanban },
        { id: 'producao', rotulo: 'Produção (OP)', icone: Factory, count: contadores.producao },
        { id: 'ordens', rotulo: 'Ordens de Serviço', icone: ClipboardList, count: contadores.os, hidden: isOperador },
      ],
    },
    {
      titulo: 'Engenharia',
      hidden: isOperador,
      itens: [
        { id: 'roteiro', rotulo: 'Roteiro Fabricação', icone: GitBranch, count: contadores.roteiro },
        { id: 'bom', rotulo: 'Estruturas (BoM)', icone: Layers, count: contadores.bom },
        { id: 'workcenters', rotulo: 'Centros de Trabalho', icone: Wrench, count: contadores.centros },
        { id: 'produtos', rotulo: 'Catálogo Produtos', icone: Package, count: contadores.produtos },
      ],
    },
    {
      titulo: 'Qualidade & Estoque',
      hidden: isOperador,
      itens: [
        { id: 'qualidade', rotulo: 'Controle Qualidade', icone: CheckCircle, count: contadores.qualidade },
        { id: 'estoque', rotulo: 'Estoque / Almoxarifado', icone: Boxes, count: contadores.estoque },
      ],
    },
    {
      titulo: 'Sistema',
      itens: [
        { id: 'historico', rotulo: 'Histórico & Auditoria', icone: History, count: null },
        { id: 'config', rotulo: 'Configurações', icone: Settings, count: null },
      ],
    },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpenMobile && (
        <div
          id="sidebarMobileOverlay"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="appSidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Topo no mobile para fechar */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏭</span>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Sistema Fábrica PRO</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Navegação */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {menuSections.map((sec, idx) => {
            if (sec.hidden) return null;
            return (
              <div key={idx} className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {sec.titulo}
                </div>
                {sec.itens.map((item) => {
                  if (item.hidden) return null;
                  const Icon = item.icone;
                  const ativo = paginaAtiva === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`menuItem-${item.id}`}
                      type="button"
                      onClick={() => handleClickItem(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        ativo
                          ? 'bg-slate-800 text-white dark:bg-amber-600 dark:text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${ativo ? 'text-amber-400 dark:text-white' : 'text-slate-400'}`} />
                        <span>{item.rotulo}</span>
                      </div>
                      {item.count !== null && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                            ativo
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Rodapé da Sidebar: Info do usuário + Botão Sair */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            id="btnSidebarLogout"
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Encerrar Sessão</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-mono">{usuario.role}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
