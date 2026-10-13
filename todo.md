# Lista de Tarefas (TODO) - Mundo de Bolso // Terrário Planetário

## ✅ Concluído
- [x] Estruturação inicial dos arquivos de planejamento (`planejamento.md`) e controle de tarefas (`todo.md`).
- [x] Mapeamento de todos os textos, descrições de ferramentas, indicadores de status e elementos de UI em inglês.
- [x] Tradução de todas as 22 ferramentas e 5 categorias em `src/types/world.ts` para o Português do Brasil (pt-BR).
- [x] Tradução completa da interface do usuário em `src/App.tsx` (estatísticas, renomear planeta, botões de ação, câmeras, iluminação, modais e tooltips).
- [x] Adição de indicador flutuante elegante durante o Tour de 30s em `src/App.tsx` com contagem regressiva e botão de saída.
- [x] Adição de painel flutuante inferior com o nome e descrição da ferramenta ativa em português.
- [x] Atualização de fases do Tour em `src/three/PocketWorldScene.ts` para Português do Brasil.
- [x] Atualização de títulos, metadados e tags OpenGraph/Twitter em `index.html` e `metadata.json`.
- [x] Verificação da compilação e validação de linter com sucesso total.

## 🔄 Em Progresso
- [ ] Implementar limitador de renderização a 30 FPS com controle de economia de bateria na cena Three.js (`PocketWorldScene.ts`).
- [ ] Adicionar suporte a gestos touch avançados para mobile: pinça de 2 dedos (pinch-to-zoom), toque de precisão para posicionamento e rotação com inércia.
- [ ] Adicionar botões táteis flutuantes de zoom (+ / -) e recentralização no mobile para uso fácil com apenas um polegar.
- [ ] Criar abas de categorias no carrossel de ferramentas inferior para navegação ágil em telas de celular.
- [ ] Adicionar seletor de 30 FPS / 60 FPS na aba de Filtros e no rodapé mobile.
- [ ] Otimizar viewport e `touch-action: none` em `index.html` e no container para evitar rolagem e recarregamento acidentais.

## 💡 Ideias Novas
- [ ] **Modo Tela Cheia (Fullscreen)**: Botão no celular para expandir o terrário ocupando 100% da tela do aparelho sem barras de navegação.
- [ ] **Efeitos Sonoros & Música Relaxante (Lofi/Ambiente)**: Adicionar áudio ambiente generativo (vento suave, pássaros, crepitar de fogueira, ondas) com controle de volume e botão de mudo.
- [ ] **Modo Foto / Cartão Postal**: Permitir baixar uma foto panorâmica em alta definição do planeta com moldura personalizada e o nome do planeta.
- [ ] **Gerador de Nomes Aleatórios Aconchegantes**: Um pequeno botão de dado para sortear nomes poéticos em português para o planeta (ex: *Vale da Neblina*, *Ilha do Vento Manso*, *Colina das Amoras*, *Recanto das Flores*).
- [ ] **Salvamento Local (LocalStorage)**: Salvar o estado do mundo criado pelo usuário para não perder suas construções ao recarregar a página.
- [ ] **Estatísticas Detalhadas & Modo Zen**: Painel com gráfico de felicidade da vila e botão para esconder todos os menus para apreciação contemplativa.
- [ ] **Detecção Automática de Dispositivo**: Ativar o modo de 30 FPS por padrão em dispositivos móveis caso detecte tela de toque / bateria reduzida.
