# Planejamento do Projeto - Mundo de Bolso // Planeta Terrário

## 1. Visão Geral
O objetivo deste projeto é fornecer uma experiência imersiva e relaxante de construção de um mundo em miniatura (terrário esférico dentro de uma redoma de vidro com suporte de nogueira), construído em React, Vite, Three.js e Tailwind CSS.

Nesta etapa, o foco principal é a **completa localização e tradução para o Português do Brasil (pt-BR)** de todas as interfaces, textos, descrições de ferramentas, indicadores de status, modos de câmera, iluminação, tour guiado e metadados.

---

## 2. Escopo da Tradução (pt-BR)

### 2.1 Interface do Usuário (UI) & Painéis
- **Cabeçalho & Identidade do Planeta**:
  - Nome padrão do planeta: "Pequeno Prado" (em vez de "Little Meadow").
  - Ação de renomear: "Clique para renomear o planeta", aria-labels em português.
- **Métricas e Estatísticas em Tempo Real**:
  - População: "Pop.", Felicidade: "Feliz", Dia: "Dia".
  - Contadores de entidades: Casas, Árvores, Barcos, Ovelhas, Nuvens.
- **Botões de Ação Principal**:
  - "Evoluir" / "Crescer" (com dica: "Avançar o desenvolvimento da vila com novos chalés, caminhos e árvores").
  - "Tour 30s" (apresentação coreografada de 30 segundos pela redoma).
- **Controles de Câmera**:
  - Redoma (visão completa da esfera de vidro e do suporte).
  - Superfície (visão aproximada no relevo).
  - Órbita (visão panorâmica de altitude média).
  - Vila (foco nos chalés e habitantes).
- **Iluminação & Céu**:
  - Ciclo (transição automática de dia/tarde/crepúsculo/noite).
  - Dia (luz do sol quente e céu diurno).
  - Crepúsculo (hora azul e reflexos dourados nas janelas).
  - Noite (céu estrelado, vaga-lumes e lanternas acesas).
- **HUD & Navegação Durante o Tour**:
  - Indicador elegante de tempo restante e botão claro para encerrar a qualquer momento ("Pressione Esc ou clique para Sair").

### 2.2 Ferramentas de Construção & Descrições (`src/types/world.ts`)
- **Vila & Monumentos**:
  - Casas (Chalés em tons pastéis com telhados artesanais e janelas brilhantes)
  - Moinhos (Moinho branco com pás de lona giratórias)
  - Faróis (Farol costeiro listrado com feixe de luz)
  - Torre de Vigia (Torre de pedra de conto de fadas com bandeira ondulante)
  - Fogueira (Fogueira de pedras crepitante para reunião noturna)
  - Poste & Caminho (Poste de ferro forjado e caminho de pedras que acende ao entardecer)
  - Balão de Ar Quente (Balão listrado com queimador iluminado)
- **Água & Vida Costeira**:
  - Veleiros (Veleiro de madeira com velas suaves e lanterna noturna)
  - Píeres & Pontes (Píer de madeira em enseadas ou ponte arqueada sobre canais)
  - Cisnes & Patos (Cisnes e patos que nadam criando marolas na água)
- **Natureza & Vida**:
  - Árvores (Carvalhos nas colinas, pinheiros nos picos ou palmeiras na praia)
  - Flores (Flores silvestres espalhadas pelos campos)
  - Colmeias (Apiário com borboletas e abelhas esvoaçantes)
  - Aldeões (Habitante que passeia entre casas, fogueiras e poço)
  - Ovelhas (Ovelhinha felpuda pastando no prado)
- **Clima & Céu**:
  - Nuvem de Chuva (Nuvem fofa que rega a vegetação)
  - Nuvem de Neve (Nuvem gélida que cobre colinas e telhados de neve)
  - Arco-Íris (Arco-íris suave e translúcido cruzando o céu)
  - Estrela Cadente (Faísca estelar brilhante cruzando a redoma)
- **Esculpir & Limpar**:
  - Montanhas (Erguer pico rochoso com topo nevado)
  - Lagos (Escavar bacia para águas turquesas)
  - Elevar Terreno (Subir o relevo esférico)
  - Rebaixar Terreno (Aprofundar relevo para entrada de água)
  - Remover (Limpar objeto ou vegetação selecionada)

### 2.3 Metadados e Documento HTML
- `index.html`: Título, descrição, OpenGraph e cartões do Twitter em português.
- `metadata.json`: Descrição oficial em português.

---

## 3. Arquitetura para Dispositivos Móveis & Modo 30 FPS

### 3.1 Gestos de Toque no Canvas 3D (Mobile Touch Controls)
- **Arrastar com 1 Dedo**: Gira o planeta suavemente com inércia calibrada para telas touch.
- **Pinça com 2 Dedos (Pinch-to-zoom)**: Permite aproximar e afastar a câmera da redoma de forma natural em smartphones e tablets.
- **Toque Rápido (Tap)**: Diferenciação inteligente entre arrastar para girar e tocar para posicionar objetos ou esculpir, com raio de tolerância (threshold) de movimento.
- **touch-action: none**: Bloqueia o comportamento nativo do navegador de puxar para atualizar (pull-to-refresh) ou rolar a página sobre o canvas.
- **Botões Flutuantes de Zoom Rápido (+ / -)**: Facilitam o manuseio com apenas uma mão no celular, sem precisar de gesto de pinça.

### 3.2 Modo de Desempenho e Economia de Bateria (30 FPS)
- **Limitador de Taxa de Quadros (30 FPS vs 60 FPS)**: No Three.js, implementação de loop temporizado que pula quadros redundantes e reduz o consumo da GPU e bateria em smartphones.
- **Ajuste Dinâmico de Resolução**: Em modo 30 FPS, limitação do pixel ratio para manter o aparelho frio e com autonomia prolongada.
- **Controle no Menu de Filtros e no Rodapé**: Chave de seleção rápida entre modo 60 FPS (Máxima Fluidez) e 30 FPS (Economia de Bateria).

### 3.3 Usabilidade da Interface Mobile
- **Abas de Categorias de Ferramentas**: Filtro rápido por categoria no celular (*Vila*, *Água*, *Natureza*, *Clima*, *Esculpir* e *Todas*) para evitar rolagem excessiva entre 22 ferramentas.
- **Chip da Ferramenta Selecionada**: Visualização destacada da ferramenta ativa com sua cor e ícone para toque fácil.
- **Botões com Área de Toque Adequada (Touch Target > 44px)**: Garante ergonomia e previne toques acidentais em telas pequenas.
- **Suporte a Safe Area (Notch / Ilha Dinâmica)**: Adaptação de margens e padding para iPhone e Android modernos.

---

## 4. Próximas Ideias & Melhorias Futuras
1. **Trilhas Sonoras & Efeitos Relaxantes**: Adicionar sons ambientes suaves e opcionais (ondas leves, crepitar da fogueira, pássaros cantando) com botão de mudo.
2. **Modo Foto / Captura**: Botão para esconder a interface e capturar screenshot em alta resolução do terrário.
3. **Predefinições de Biomas**: Botão para gerar biomas temáticos (ex: Ilha Tropical, Aldeia Alpina Nevada, Bosque Encantado de Outono).
4. **Exportar/Salvar Mundo**: Salvar a composição do planeta em JSON no armazenamento local (localStorage) para permitir continuar depois.
5. **Vibração Háptica Leve (Haptic Feedback)**: Pequeno feedback tátil no celular ao posicionar itens ou colher flores.
