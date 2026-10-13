export type ToolId =
  // Original Tools
  | 'tree'
  | 'house'
  | 'windmill'
  | 'lighthouse'
  | 'mountain'
  | 'lake'
  | 'flower'
  | 'cloud'
  | 'villager'
  | 'sheep'
  | 'raise'
  | 'lower'
  | 'remove'
  // A. Water & Coastal Life
  | 'sailboat'
  | 'dock'
  | 'duck'
  // B. Cozy Village & Countryside Landmarks
  | 'campfire'
  | 'balloon'
  | 'watchtower'
  | 'beehive'
  | 'lantern'
  // C. Weather & Elemental Powers
  | 'rainbow'
  | 'snowcloud'
  | 'shootingstar';

export type ToolCategory = 'all' | 'village' | 'water' | 'nature' | 'weather' | 'sculpt';

export type CameraViewId = 'orb' | 'surface' | 'orbit' | 'village';

export type TimeMode = 'auto' | 'day' | 'twilight' | 'night';

export interface WorldState {
  planetName: string;
  population: number;
  happiness: number;
  dayCount: number;
  activeTool: ToolId;
  activeView: CameraViewId;
  timeMode: TimeMode;
  targetFps: 60 | 30;
  /** 0..1 where 0.25 = warm noon/afternoon, 0.52 = blue twilight, 0.78 = deep night */
  timeOfDay: number;
  tourActive: boolean;
  tourElapsed: number;
  tourPhase: string;
  objectCounts: {
    houses: number;
    trees: number;
    windmills: number;
    lighthouses: number;
    villagers: number;
    sheep: number;
    clouds: number;
    flowers: number;
    boats: number;
  };
}

export interface ToolDefinition {
  id: ToolId;
  label: string;
  category: Exclude<ToolCategory, 'all'>;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  description: string;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  // Vila & Monumentos
  {
    id: 'house',
    label: 'Casas',
    category: 'village',
    accentBg: 'bg-[#fce4d6]',
    accentBorder: 'border-[#ebb69b]',
    accentText: 'text-[#6e3820]',
    description: 'Construa um chalé aconchegante com telhas artesanais e janelas iluminadas',
  },
  {
    id: 'windmill',
    label: 'Moinhos',
    category: 'village',
    accentBg: 'bg-[#fdf2d0]',
    accentBorder: 'border-[#e5cc87]',
    accentText: 'text-[#665014]',
    description: 'Erga um moinho de vento branco com pás de lona giratórias',
  },
  {
    id: 'lighthouse',
    label: 'Faróis',
    category: 'village',
    accentBg: 'bg-[#fadadd]',
    accentBorder: 'border-[#e59fa6]',
    accentText: 'text-[#70232b]',
    description: 'Construa um farol costeiro listrado com feixe de luz giratório',
  },
  {
    id: 'watchtower',
    label: 'Torre de Vigia',
    category: 'village',
    accentBg: 'bg-[#e6e2f5]',
    accentBorder: 'border-[#b8b0d9]',
    accentText: 'text-[#3c345c]',
    description: 'Construa uma torre de pedra de conto de fadas com bandeira ondulante',
  },
  {
    id: 'campfire',
    label: 'Fogueira',
    category: 'village',
    accentBg: 'bg-[#fde2c8]',
    accentBorder: 'border-[#eba972]',
    accentText: 'text-[#70360f]',
    description: 'Acenda uma fogueira crepitante de pedras onde os aldeões se reúnem à noite',
  },
  {
    id: 'lantern',
    label: 'Poste & Caminho',
    category: 'village',
    accentBg: 'bg-[#fef0c9]',
    accentBorder: 'border-[#e5c777]',
    accentText: 'text-[#634b10]',
    description: 'Coloque um poste de ferro forjado e caminho de paralelepípedos que brilha ao entardecer',
  },
  {
    id: 'balloon',
    label: 'Balão de Ar Quente',
    category: 'village',
    accentBg: 'bg-[#f9d9e6]',
    accentBorder: 'border-[#e39db9]',
    accentText: 'text-[#6b2543]',
    description: 'Lance um balão de ar quente listrado em tons pastéis com queimador brilhante',
  },

  // Água & Vida Costeira
  {
    id: 'sailboat',
    label: 'Veleiros',
    category: 'water',
    accentBg: 'bg-[#d6eff7]',
    accentBorder: 'border-[#8ec9de]',
    accentText: 'text-[#1c5166]',
    description: 'Lance um veleiro de madeira com velas pastéis e lanterna noturna',
  },
  {
    id: 'dock',
    label: 'Píeres & Pontes',
    category: 'water',
    accentBg: 'bg-[#efe4d4]',
    accentBorder: 'border-[#cbb393]',
    accentText: 'text-[#543d22]',
    description: 'Construa um píer de madeira na margem ou uma ponte arqueada sobre canais',
  },
  {
    id: 'duck',
    label: 'Cisnes & Patos',
    category: 'water',
    accentBg: 'bg-[#e2f5ef]',
    accentBorder: 'border-[#9ad1c0]',
    accentText: 'text-[#1f5747]',
    description: 'Adicione cisnes e patinhos brancos que nadam deixando marolas na água',
  },

  // Natureza & Vida
  {
    id: 'tree',
    label: 'Árvores',
    category: 'nature',
    accentBg: 'bg-[#dff0d8]',
    accentBorder: 'border-[#a6cfa0]',
    accentText: 'text-[#2c5227]',
    description: 'Plante carvalhos nas colinas, pinheiros nos picos ou palmeiras nas praias',
  },
  {
    id: 'flower',
    label: 'Flores',
    category: 'nature',
    accentBg: 'bg-[#f5dff7]',
    accentBorder: 'border-[#d6a9dc]',
    accentText: 'text-[#5b2a61]',
    description: 'Espalhe flores silvestres perfumadas pelos prados',
  },
  {
    id: 'beehive',
    label: 'Colmeias',
    category: 'nature',
    accentBg: 'bg-[#fcf0c2]',
    accentBorder: 'border-[#e3c76b]',
    accentText: 'text-[#5e480d]',
    description: 'Coloque um apiário colorido com borboletas e abelhas esvoaçantes',
  },
  {
    id: 'villager',
    label: 'Aldeões',
    category: 'nature',
    accentBg: 'bg-[#fde8c8]',
    accentBorder: 'border-[#e6be83]',
    accentText: 'text-[#664414]',
    description: 'Dê boas-vindas a um morador que caminha entre casas, fogueiras e o poço',
  },
  {
    id: 'sheep',
    label: 'Ovelhas',
    category: 'nature',
    accentBg: 'bg-[#f2efe9]',
    accentBorder: 'border-[#ccc5b8]',
    accentText: 'text-[#474137]',
    description: 'Adicione uma ovelha felpuda e dócil pastando no gramado',
  },

  // Clima & Céu
  {
    id: 'cloud',
    label: 'Nuvem de Chuva',
    category: 'weather',
    accentBg: 'bg-[#e1ecf7]',
    accentBorder: 'border-[#a4c2e3]',
    accentText: 'text-[#264669]',
    description: 'Invoque uma nuvem de chuva fofa que rega o solo e faz as árvores crescerem',
  },
  {
    id: 'snowcloud',
    label: 'Nuvem de Neve',
    category: 'weather',
    accentBg: 'bg-[#e4f2fc]',
    accentBorder: 'border-[#9ec8e8]',
    accentText: 'text-[#1e4b6e]',
    description: 'Invoque uma nuvem gélida que polvilha colinas e telhados com flocos brancos de neve',
  },
  {
    id: 'rainbow',
    label: 'Arco-Íris',
    category: 'weather',
    accentBg: 'bg-[#fce3f0]',
    accentBorder: 'border-[#e3a1c4]',
    accentText: 'text-[#662247]',
    description: 'Forme um arco-íris translúcido e multicolorido cruzando o céu',
  },
  {
    id: 'shootingstar',
    label: 'Estrela Cadente',
    category: 'weather',
    accentBg: 'bg-[#e5dff7]',
    accentBorder: 'border-[#b3a3e3]',
    accentText: 'text-[#392769]',
    description: 'Faça cruzar uma estrela cadente brilhante pela cúpula do céu',
  },

  // Esculpir & Limpar
  {
    id: 'mountain',
    label: 'Montanhas',
    category: 'sculpt',
    accentBg: 'bg-[#e3e6ee]',
    accentBorder: 'border-[#b2bacf]',
    accentText: 'text-[#363e52]',
    description: 'Erga um pico rochoso facetado com cume nevado',
  },
  {
    id: 'lake',
    label: 'Lagos',
    category: 'sculpt',
    accentBg: 'bg-[#d4f1f4]',
    accentBorder: 'border-[#8fd3db]',
    accentText: 'text-[#1c5961]',
    description: 'Escave uma bacia rasa a profunda com águas cristalinas turquesas',
  },
  {
    id: 'raise',
    label: 'Elevar Terreno',
    category: 'sculpt',
    accentBg: 'bg-[#e6eed6]',
    accentBorder: 'border-[#b5c993]',
    accentText: 'text-[#3b4f1d]',
    description: 'Eleve as facetas esféricas do relevo planetário',
  },
  {
    id: 'lower',
    label: 'Rebaixar Terreno',
    category: 'sculpt',
    accentBg: 'bg-[#d8edf2]',
    accentBorder: 'border-[#96c9d6]',
    accentText: 'text-[#20515e]',
    description: 'Rebaixe as facetas de terra para permitir a entrada de água',
  },
  {
    id: 'remove',
    label: 'Remover',
    category: 'sculpt',
    accentBg: 'bg-[#f7dede]',
    accentBorder: 'border-[#dfa4a4]',
    accentText: 'text-[#692626]',
    description: 'Remova um objeto ou elemento da superfície do planeta',
  },
];
