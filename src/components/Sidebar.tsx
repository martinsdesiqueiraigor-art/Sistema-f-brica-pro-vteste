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
  Play,
  Search,
  AlertTriangle,
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
    atividadesAtivas?: number;
    paradasAtivas?: number;
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
  const isOperador = usuario.role === 'producao' || usuario.role === 'operador';

  const handleClickItem = (pagina: string) => {
    onNavegar(pagina);
    onCloseMobile();
  };

  const menuSections = [
    {
      titulo: 'Chão de Fábrica (MES)',
      itens: [
        {
          id: 'terminal-operador',
          rotulo: 'Terminal Operador',
          icone: Play,
          count: contadores.atividadesAtivas !== undefined ? contadores.atividadesAtivas : null,
          badgeColor: 'bg-emerald-500 text-white',
        },
        {
          id: 'consulta-op',
          rotulo: 'Consulta & Ficha OP',
          icone: Search,
          count: null,
        },
      ],
    },
    {
      titulo: 'PCP & Planejamento',
      itens: [
        { id: 'dashboard', rotulo: 'Dashboard Geral', icone: LayoutDashboard, count: null },
        { id: 'kanban', rotulo: 'Quadro Kanban', icone: Trello, count: contadores.kanban },
        { id: 'producao', rotulo: 'Ordens de Produção (OP)', icone: Factory, count: contadores.producao },
        { id: 'ordens', rotulo: 'Ordens de Serviço (OS)', icone: ClipboardList, count: contadores.os, hidden: isOperador },
      ],
    },
    {
      titulo: 'Engenharia',
      hidden: isOperador,
      itens: [
        { id: 'roteiro', rotulo: 'Roteiros de Fabricação', icone: GitBranch, count: contadores.roteiro },
        { id: 'bom', rotulo: 'Estruturas (BoM)', icone: Layers, count: contadores.bom },
        {
          id: 'workcenters',
          rotulo: 'Postos & Máquinas',
          icone: Wrench,
          count: contadores.centros,
          alertCount: contadores.paradasAtivas,
        },
        { id: 'produtos', rotulo: 'Desenhos & Produtos', icone: Package, count: contadores.produtos },
      ],
    },
    {
      titulo: 'Qualidade & Almoxarifado',
      hidden: isOperador,
      itens: [
        { id: 'qualidade', rotulo: 'Controle de Qualidade', icone: CheckCircle, count: contadores.qualidade },
        { id: 'estoque', rotulo: 'Estoque de Materiais', icone: Boxes, count: contadores.estoque },
      ],
    },
    {
      titulo: 'Sistema & Auditoria',
      itens: [
        { id: 'historico', rotulo: 'Histórico & Logs', icone: History, count: null },
        { id: 'config', rotulo: 'Configurações & Backup', icone: Settings, count: null },
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
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Fábrica PRO • MES/PCP</span>
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
                  if ((item as any).hidden) return null;
                  const Icon = item.icone;
                  const ativo = paginaAtiva === item.id;
                  const alertCount = (item as any).alertCount;

                  return (
                    <button
                      key={item.id}
                      id={`menuItem-${item.id}`}
                      type="button"
                      onClick={() => handleClickItem(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        ativo
                          ? 'bg-slate-800 text-white dark:bg-amber-600 dark:text-white shadow-xs'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${ativo ? 'text-amber-400 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{item.rotulo}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {alertCount && alertCount > 0 ? (
                          <span
                            className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500 text-white flex items-center gap-0.5 animate-pulse"
                            title={`${alertCount} máquina(s) parada(s)`}
                          >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {alertCount}
                          </span>
                        ) : null}

                        {item.count !== null && item.count !== undefined ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              (item as any).badgeColor
                                ? (item as any).badgeColor
                                : ativo
                                ? 'bg-slate-700 dark:bg-amber-700 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {item.count}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Rodapé com Usuário & Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {usuario.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {usuario.name}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  {usuario.role === 'admin' ? 'Supervisor / PCP' : usuario.role}
                </div>
              </div>
            </div>

            <button
              id="sidebarBtnLogout"
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Trocar usuário / Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
