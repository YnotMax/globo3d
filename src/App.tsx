import React, { useEffect, useRef, useState } from 'react';
import {
  Anchor,
  ArrowDownToLine,
  ArrowUpFromLine,
  Bird,
  Bug,
  Castle,
  Cloud,
  CloudSnow,
  Compass,
  Eraser,
  Fan,
  Flame,
  Flower2,
  Home,
  LampFloor,
  Minus,
  Moon,
  Mountain,
  Pencil,
  Play,
  Plus,
  Rainbow,
  RotateCw,
  Sailboat,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Sun,
  Sunset,
  TowerControl,
  Trees,
  Users,
  Waves,
  Wind,
  X,
  Zap,
} from 'lucide-react';
import { PocketWorldController } from './three/PocketWorldScene';
import {
  CameraViewId,
  TimeMode,
  TOOL_DEFINITIONS,
  ToolCategory,
  ToolId,
  WorldState,
} from './types/world';

const TOOL_GROUPS: { category: Exclude<ToolCategory, 'all'>; title: string }[] = [
  { category: 'village', title: 'Vila & Monumentos' },
  { category: 'water', title: 'Água & Vida Costeira' },
  { category: 'nature', title: 'Natureza & Vida' },
  { category: 'weather', title: 'Clima & Céu' },
  { category: 'sculpt', title: 'Esculpir & Limpar' },
];

const CATEGORY_TABS: { id: ToolCategory; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'village', label: 'Vila' },
  { id: 'water', label: 'Água' },
  { id: 'nature', label: 'Natureza' },
  { id: 'weather', label: 'Clima' },
  { id: 'sculpt', label: 'Esculpir' },
];

function renderToolIcon(id: ToolId) {
  const cls = 'w-4 h-4 shrink-0';
  switch (id) {
    case 'tree':
      return <Trees className={cls} />;
    case 'house':
      return <Home className={cls} />;
    case 'windmill':
      return <Fan className={cls} />;
    case 'lighthouse':
      return <TowerControl className={cls} />;
    case 'watchtower':
      return <Castle className={cls} />;
    case 'campfire':
      return <Flame className={cls} />;
    case 'lantern':
      return <LampFloor className={cls} />;
    case 'balloon':
      return <Wind className={cls} />;
    case 'sailboat':
      return <Sailboat className={cls} />;
    case 'dock':
      return <Anchor className={cls} />;
    case 'duck':
      return <Bird className={cls} />;
    case 'mountain':
      return <Mountain className={cls} />;
    case 'lake':
      return <Waves className={cls} />;
    case 'flower':
      return <Flower2 className={cls} />;
    case 'beehive':
      return <Bug className={cls} />;
    case 'cloud':
      return <Cloud className={cls} />;
    case 'snowcloud':
      return <CloudSnow className={cls} />;
    case 'rainbow':
      return <Rainbow className={cls} />;
    case 'shootingstar':
      return <Sparkles className={cls} />;
    case 'villager':
      return <Users className={cls} />;
    case 'sheep':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cls}
          aria-hidden="true"
        >
          <path d="M8 15a4 4 0 0 1-2-7.5 4.5 4.5 0 0 1 8.5-1A3.5 3.5 0 0 1 18 10a3.5 3.5 0 0 1-1 6.8H8Z" />
          <path d="M9 17v3" />
          <path d="M15 17v3" />
        </svg>
      );
    case 'raise':
      return <ArrowUpFromLine className={cls} />;
    case 'lower':
      return <ArrowDownToLine className={cls} />;
    case 'remove':
      return <Eraser className={cls} />;
  }
}

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<PocketWorldController | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [worldState, setWorldState] = useState<WorldState>({
    planetName: 'Pequeno Prado',
    population: 12,
    happiness: 96,
    dayCount: 1,
    activeTool: 'tree',
    activeView: 'orb',
    timeMode: 'auto',
    targetFps: 60,
    timeOfDay: 0.24,
    tourActive: false,
    tourElapsed: 0,
    tourPhase: '',
    objectCounts: {
      houses: 4,
      trees: 22,
      windmills: 1,
      lighthouses: 2,
      villagers: 12,
      sheep: 8,
      clouds: 3,
      flowers: 5,
      boats: 3,
    },
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [webglLost, setWebglLost] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const controller = new PocketWorldController(container, setWorldState);
    controllerRef.current = controller;

    const canvas = container.querySelector('canvas');
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglLost(true);
    };
    const onContextRestored = () => {
      setWebglLost(false);
    };

    if (canvas) {
      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);
      }
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFiltersOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filtersOpen]);

  const handleSelectTool = (tool: ToolId) => {
    controllerRef.current?.setTool(tool);
  };

  const handleSelectView = (view: CameraViewId) => {
    controllerRef.current?.stopTour();
    controllerRef.current?.applyCameraPreset(view);
  };

  const handleSelectTimeMode = (mode: TimeMode) => {
    controllerRef.current?.setTimeMode(mode);
  };

  const handleGrow = () => {
    controllerRef.current?.triggerGrowVillage();
  };

  const handleToggleTour = () => {
    setFiltersOpen(false);
    if (worldState.tourActive) {
      controllerRef.current?.stopTour();
    } else {
      controllerRef.current?.startTour();
    }
  };

  const handleZoomIn = () => {
    controllerRef.current?.zoomCamera(-0.35);
  };

  const handleZoomOut = () => {
    controllerRef.current?.zoomCamera(0.35);
  };

  const handleRotateStep = () => {
    controllerRef.current?.rotatePlanetBy(0.28);
  };

  const handleToggleFps = () => {
    const nextFps = worldState.targetFps === 30 ? 60 : 30;
    controllerRef.current?.setTargetFps(nextFps);
  };

  const orderedTools = TOOL_GROUPS.flatMap((group) =>
    TOOL_DEFINITIONS.filter((t) => t.category === group.category),
  );

  const mobileVisibleTools =
    selectedCategory === 'all'
      ? orderedTools
      : orderedTools.filter((t) => t.category === selectedCategory);

  const currentToolDef = TOOL_DEFINITIONS.find(
    (t) => t.id === worldState.activeTool,
  );

  return (
    <div className="flex w-screen h-screen overflow-hidden select-none bg-[#221d2b]">
      {/* Coluna Esquerda: Viewport 3D Three.js */}
      <div className="relative flex-1 min-w-0 h-full">
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label="Terrário Planetário 3D Interativo"
        />

        {/* Indicador de Tour Guiado Ativo */}
        {worldState.tourActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 bg-[#231d2b]/90 text-[#faf6ee] rounded-full border border-white/15 shadow-2xl backdrop-blur-md text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f4a261] animate-ping" />
              <span>Tour Panorâmico</span>
              <span className="font-mono-tabular text-[#edd9bf] font-semibold">
                ({Math.max(1, Math.ceil(30 - worldState.tourElapsed))}s)
              </span>
            </div>
            <div className="w-px h-3.5 bg-white/20" />
            <button
              type="button"
              onClick={handleToggleTour}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              Sair do Tour (Esc)
            </button>
          </div>
        )}

        {/* Botão rápido flutuante de FPS no topo direito */}
        {!worldState.tourActive && (
          <button
            type="button"
            onClick={handleToggleFps}
            title={`Taxa atual: ${worldState.targetFps} FPS. Clique para alternar.`}
            aria-label="Alternar modo de 30 FPS ou 60 FPS"
            className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf5ec]/90 backdrop-blur-md border border-[#e2d7c5] text-[#382f27] text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {worldState.targetFps === 30 ? (
              <>
                <Zap className="w-3.5 h-3.5 text-[#d97706]" />
                <span className="font-mono-tabular">30 FPS</span>
                <span className="text-[10px] text-[#8c7d6b] hidden sm:inline">(Bateria)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#2e5926]" />
                <span className="font-mono-tabular">60 FPS</span>
              </>
            )}
          </button>
        )}

        {/* Controles Flutuantes de Toque Mobile (Zoom +/- e Rotação) */}
        {!worldState.tourActive && (
          <div
            className="md:hidden absolute right-3 bottom-36 z-30 flex flex-col gap-2"
            aria-label="Controles rápidos de câmera touch"
          >
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Aproximar câmera"
              title="Aproximar"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#faf5ec]/90 backdrop-blur-md border border-[#e2d7c5] text-[#382f27] shadow-md active:scale-90 transition-transform cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Afastar câmera"
              title="Afastar"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#faf5ec]/90 backdrop-blur-md border border-[#e2d7c5] text-[#382f27] shadow-md active:scale-90 transition-transform cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleRotateStep}
              aria-label="Girar Planeta"
              title="Girar"
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#faf5ec]/90 backdrop-blur-md border border-[#e2d7c5] text-[#382f27] shadow-md active:scale-90 transition-transform cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dica da Ferramenta Ativa no canto inferior */}
        {!worldState.tourActive && currentToolDef && (
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#faf5ec]/90 backdrop-blur-md border border-[#e2d7c5] shadow-md text-xs text-[#382f27] max-w-md">
            <div className="w-2 h-2 rounded-full bg-[#4e6e3a] shrink-0" />
            <span className="text-[#7d6c5b]">Ferramenta:</span>
            <strong className="font-semibold text-[#271f18] shrink-0">
              {currentToolDef.label}
            </strong>
            <span className="text-[#b5a796] hidden md:inline">·</span>
            <span className="text-[#5c4e40] truncate hidden md:inline">
              {currentToolDef.description}
            </span>
          </div>
        )}

        {/* Fallback de perda de contexto WebGL */}
        {webglLost && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#231e2d]/90 text-[#faf6ee]">
            <div className="max-w-md p-6 text-center bg-[#322b3f] rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-2">
                Visualização 3D Interrompida
              </h2>
              <p className="text-sm text-[#d6cee2]">
                O contexto WebGL 3D foi interrompido. Recarregue ou restaure a aba
                para continuar construindo {worldState.planetName}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Coluna Direita: Painel Lateral Desktop de Ícones (Oculto em mobile e durante o Tour) */}
      {!worldState.tourActive && (
        <aside
          aria-label="Controles do terrário e barra de ferramentas"
          className="hidden md:flex w-16 shrink-0 h-full bg-[#faf5ec] border-l border-[#e2d7c5] text-[#382f27] flex-col items-center py-3 gap-2.5 z-20"
        >
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            title="Abrir Filtros e Opções"
            aria-label="Abrir Filtros"
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-[#382f27] text-[#fcf8f0] border border-[#261f19] hover:bg-[#4d4136] active:scale-95 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
          </button>

          <div className="w-8 h-px bg-[#e2d7c5] shrink-0" aria-hidden="true" />

          <div
            className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto no-scrollbar py-0.5"
            role="toolbar"
            aria-orientation="vertical"
            aria-label="Ferramentas de construção do mundo"
          >
            {orderedTools.map((tool) => {
              const isSelected = worldState.activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleSelectTool(tool.id)}
                  title={`${tool.label} — ${tool.description}`}
                  aria-label={tool.label}
                  className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? `${tool.accentBg} ${tool.accentBorder} ${tool.accentText} shadow-xs`
                      : 'bg-[#f3ede2] border-[#e2d7c5] text-[#54483c] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                  }`}
                >
                  {renderToolIcon(tool.id)}
                </button>
              );
            })}
          </div>
        </aside>
      )}

      {/* Modal Desktop para Filtros e Opções (Identidade, Crescer, Tour, Câmera, Iluminação) */}
      {!worldState.tourActive && filtersOpen && (
        <div className="hidden md:flex fixed inset-0 z-40 items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros e Opções"
            className="relative z-10 w-full max-w-sm max-h-[85vh] bg-[#faf5ec] text-[#382f27] rounded-2xl border border-[#e2d7c5] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#e6dccb] shrink-0">
              <h2 className="text-sm font-semibold text-[#2b221b]">Filtros & Opções</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fechar Filtros"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#594d40] hover:bg-[#eae1d3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-5 overflow-y-auto">
              {/* 1. Identidade do Planeta & Estatísticas Vivas */}
              <section className="flex flex-col gap-1.5 pb-3 border-b border-[#e6dccb]">
                <div className="flex items-center justify-between gap-2">
                  {isEditingName ? (
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={worldState.planetName}
                      maxLength={28}
                      onChange={(e) =>
                        setWorldState((prev) => ({
                          ...prev,
                          planetName: e.target.value,
                        }))
                      }
                      onBlur={() => {
                        if (!worldState.planetName.trim()) {
                          setWorldState((prev) => ({
                            ...prev,
                            planetName: 'Pequeno Prado',
                          }));
                        }
                        setIsEditingName(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          nameInputRef.current?.blur();
                        }
                      }}
                      aria-label="Nome do Planeta"
                      className="w-full px-2 py-0.5 text-lg font-semibold bg-[#fffdf9] border border-[#cbbba3] rounded text-[#2b221b] focus:outline-none focus:ring-2 focus:ring-[#a6cfa0]"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="group flex items-center gap-1.5 text-left cursor-pointer focus:outline-none"
                      title="Clique para renomear o planeta"
                    >
                      <h3 className="text-lg font-semibold tracking-tight text-[#2b221b] group-hover:text-[#4e6e3a] transition-colors">
                        {worldState.planetName}
                      </h3>
                      <Pencil className="w-3.5 h-3.5 text-[#8c7d6b] opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#594d40] font-mono-tabular">
                  <span>
                    Pop.{' '}
                    <strong className="font-semibold text-[#2b221b]">
                      {worldState.population}
                    </strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Feliz{' '}
                    <strong className="font-semibold text-[#2e5926]">
                      {worldState.happiness}%
                    </strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Dia{' '}
                    <strong className="font-semibold text-[#2b221b]">
                      {worldState.dayCount}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-[#695b4c] font-mono-tabular pt-0.5">
                  <span>{worldState.objectCounts.houses} Casas</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.trees} Árvores</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.boats} Barcos</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.sheep} Ovelhas</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.clouds} Nuvens</span>
                </div>
              </section>

              {/* 2. Ações Principais: Evoluir & Tour 30s */}
              <section className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGrow}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#23451e] bg-[#d4ebc8] hover:bg-[#c5e3b5] border border-[#a3cf8e] rounded-xl transition-colors cursor-pointer"
                  title="Acelera o desenvolvimento da vila adicionando novos chalés, caminhos e árvores"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Evoluir</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleTour}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border bg-[#382f27] text-[#fcf8f0] border-[#261f19] hover:bg-[#4d4136] transition-colors cursor-pointer"
                  title="Apresentação cinematográfica de 30 segundos ao redor do planeta"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Tour 30s</span>
                </button>
              </section>

              {/* 3. Visão da Câmera */}
              <section className="flex flex-col gap-1.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#7a6b5a]">
                  Visão da Câmera
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'orb', label: 'Redoma' },
                      { id: 'surface', label: 'Superfície' },
                      { id: 'orbit', label: 'Órbita' },
                      { id: 'village', label: 'Vila' },
                    ] as { id: CameraViewId; label: string }[]
                  ).map((v) => {
                    const active =
                      worldState.activeView === v.id && !worldState.tourActive;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectView(v.id)}
                        className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#e3eedc] text-[#23451e] border-[#a6cfa0] shadow-xs'
                            : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 4. Iluminação & Céu */}
              <section className="flex flex-col gap-1.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#7a6b5a]">
                  Iluminação & Céu
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      {
                        id: 'auto',
                        label: 'Ciclo',
                        icon: <Compass className="w-3.5 h-3.5" />,
                      },
                      {
                        id: 'day',
                        label: 'Dia',
                        icon: <Sun className="w-3.5 h-3.5" />,
                      },
                      {
                        id: 'twilight',
                        label: 'Crepúsculo',
                        icon: <Sunset className="w-3.5 h-3.5" />,
                      },
                      {
                        id: 'night',
                        label: 'Noite',
                        icon: <Moon className="w-3.5 h-3.5" />,
                      },
                    ] as { id: TimeMode; label: string; icon: React.ReactNode }[]
                  ).map((m) => {
                    const active = worldState.timeMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectTimeMode(m.id)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#e1ecf7] text-[#264669] border-[#a4c2e3] shadow-xs'
                            : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                        }`}
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 5. Desempenho & Bateria (FPS) */}
              <section className="flex flex-col gap-1.5 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#7a6b5a]">
                    Desempenho & Bateria
                  </h3>
                  <span className="text-[11px] font-mono-tabular text-[#8c7d6b]">
                    {worldState.targetFps === 30 ? 'Econômico (30 FPS)' : 'Fluidez Total (60 FPS)'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.setTargetFps(60)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                      worldState.targetFps === 60
                        ? 'bg-[#e3eedc] text-[#23451e] border-[#a6cfa0] shadow-xs'
                        : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2e5926]" />
                    <span>60 FPS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.setTargetFps(30)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                      worldState.targetFps === 30
                        ? 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d] shadow-xs'
                        : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>30 FPS (Bateria)</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#8c7d6b] leading-tight">
                  O modo de 30 FPS economiza bateria em smartphones e tablets, mantendo o dispositivo frio.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Barra Inferior Mobile: Seletor de Categorias + Carrossel de Ferramentas + Botão Filtros */}
      {!worldState.tourActive && (
        <div
          aria-label="Barra de ferramentas móvel"
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#faf5ec]/95 backdrop-blur-md border-t border-[#e2d7c5] px-3 pt-2 pb-3 flex flex-col gap-1.5 shadow-lg"
        >
          {/* Linha superior de abas de categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORY_TABS.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#382f27] text-[#fcf8f0]'
                      : 'bg-[#ede5d8] text-[#5c4e40] hover:bg-[#e2d8c7]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Linha inferior: Botão de Filtros + Ferramentas da Categoria Selecionada */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="h-11 px-3 shrink-0 flex items-center justify-center gap-1 rounded-xl bg-[#382f27] text-[#fcf8f0] border border-[#261f19] text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
              aria-label="Abrir Filtros"
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              <span>Filtros</span>
            </button>

            <div
              className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 pr-1"
              role="toolbar"
              aria-label="Ferramentas de construção do mundo"
            >
              {mobileVisibleTools.map((tool) => {
                const isSelected = worldState.activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTool(tool.id)}
                    title={tool.label}
                    aria-label={tool.label}
                    className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? `${tool.accentBg} ${tool.accentBorder} ${tool.accentText} shadow-xs ring-2 ring-[#4e6e3a]/40`
                        : 'bg-[#f3ede2] border-[#e2d7c5] text-[#54483c] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                    }`}
                  >
                    {renderToolIcon(tool.id)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Painel Inferior Deslizante Mobile (Bottom Sheet) para Filtros */}
      {!worldState.tourActive && filtersOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros e Opções"
            className="relative z-10 w-full max-h-[80vh] bg-[#faf5ec] text-[#382f27] rounded-t-3xl border-t border-[#e2d7c5] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="w-10 h-1.5 bg-[#d6c8b4] rounded-full mx-auto mt-3 mb-1 shrink-0" />
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#e6dccb] shrink-0">
              <h2 className="text-sm font-semibold text-[#2b221b]">Filtros & Opções</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fechar Filtros"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#594d40] hover:bg-[#eae1d3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-5 overflow-y-auto">
              {/* Identidade do Planeta & Estatísticas */}
              <section className="flex flex-col gap-1.5 pb-3 border-b border-[#e6dccb]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-semibold text-[#2b221b]">
                    {worldState.planetName}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-[#594d40] font-mono-tabular">
                    <span>
                      Pop.{' '}
                      <strong className="font-semibold text-[#2b221b]">
                        {worldState.population}
                      </strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Feliz{' '}
                      <strong className="font-semibold text-[#2e5926]">
                        {worldState.happiness}%
                      </strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Dia{' '}
                      <strong className="font-semibold text-[#2b221b]">
                        {worldState.dayCount}
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-[#695b4c] font-mono-tabular">
                  <span>{worldState.objectCounts.houses} Casas</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.trees} Árvores</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.boats} Barcos</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.sheep} Ovelhas</span>
                  <span aria-hidden="true">·</span>
                  <span>{worldState.objectCounts.clouds} Nuvens</span>
                </div>
              </section>

              {/* Ações Principais: Evoluir & Tour 30s */}
              <section className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGrow}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-[#23451e] bg-[#d4ebc8] hover:bg-[#c5e3b5] border border-[#a3cf8e] rounded-xl transition-colors cursor-pointer"
                  title="Acelera o desenvolvimento da vila adicionando novos chalés, caminhos e árvores"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Evoluir</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleTour}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border bg-[#382f27] text-[#fcf8f0] border-[#261f19] hover:bg-[#4d4136] transition-colors cursor-pointer"
                  title="Apresentação cinematográfica de 30 segundos ao redor do planeta"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Tour 30s</span>
                </button>
              </section>

              {/* Visão da Câmera */}
              <section className="flex flex-col gap-1.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#7a6b5a]">
                  Visão da Câmera
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'orb', label: 'Redoma' },
                      { id: 'surface', label: 'Superfície' },
                      { id: 'orbit', label: 'Órbita' },
                      { id: 'village', label: 'Vila' },
                    ] as { id: CameraViewId; label: string }[]
                  ).map((v) => {
                    const active =
                      worldState.activeView === v.id && !worldState.tourActive;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectView(v.id)}
                        className={`px-3 py-2.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#e3eedc] text-[#23451e] border-[#a6cfa0] shadow-xs'
                            : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Iluminação & Céu */}
              <section className="flex flex-col gap-1.5 pb-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#7a6b5a]">
                  Iluminação & Céu
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      {
                        id: 'auto',
                        label: 'Ciclo',
                        icon: <Compass className="w-3.5 h-3.5" />,
                      },
                      {
                        id: 'day',
                        label: 'Dia',
                        icon: <Sun className="w-3.5 h-3.5" />,
                      },
                      {
                        id: 'twilight',
                        label: 'Crepúsculo',
                        icon: <Sunset className="w-3.5 h-3.5" />,
                      },
                      {
                        id: 'night',
                        label: 'Noite',
                        icon: <Moon className="w-3.5 h-3.5" />,
                      },
                    ] as { id: TimeMode; label: string; icon: React.ReactNode }[]
                  ).map((m) => {
                    const active = worldState.timeMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectTimeMode(m.id)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#e1ecf7] text-[#264669] border-[#a4c2e3] shadow-xs'
                            : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                        }`}
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 5. Desempenho & Bateria (FPS) */}
              <section className="flex flex-col gap-1.5 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#7a6b5a]">
                    Desempenho & Bateria
                  </h3>
                  <span className="text-[11px] font-mono-tabular text-[#8c7d6b]">
                    {worldState.targetFps === 30 ? 'Econômico (30 FPS)' : 'Fluidez Total (60 FPS)'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.setTargetFps(60)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                      worldState.targetFps === 60
                        ? 'bg-[#e3eedc] text-[#23451e] border-[#a6cfa0] shadow-xs'
                        : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2e5926]" />
                    <span>60 FPS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => controllerRef.current?.setTargetFps(30)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                      worldState.targetFps === 30
                        ? 'bg-[#fef3c7] text-[#92400e] border-[#fcd34d] shadow-xs'
                        : 'bg-[#f3ede2] border-transparent text-[#594d40] hover:bg-[#eae1d3] hover:text-[#2b221b]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>30 FPS (Bateria)</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#8c7d6b] leading-tight">
                  O modo de 30 FPS economiza bateria em smartphones e tablets, mantendo o dispositivo frio.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
