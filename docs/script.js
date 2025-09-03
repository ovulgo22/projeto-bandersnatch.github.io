/*
 * SCRIPT.JS v2.0 - O Motor do Jogo (Game Engine)
 * Orquestra a lógica, o estado do jogador e a persistência,
 * conectando a narrativa (story.js) com a interface (ui.js).
 */
document.addEventListener('DOMContentLoaded', () => {

    const Game = {
        currentNodeKey: null,
        playerState: {},
        saveKey: 'projectBandersnatch_v2_save',

        /**
         * Inicia o jogo. Tenta carregar um estado salvo,
         * caso contrário, inicia um novo jogo.
         */
        start() {
            if (!this.loadState()) {
                this.newGame();
            }
        },

        /**
         * Inicia um novo jogo do zero, limpando o estado anterior.
         */
        newGame() {
            this.currentNodeKey = 'start';
            this.playerState = { sanidade: 100, suspeita: 0, conhecimento: 0 };
            this.showNode(this.currentNodeKey);
        },

        /**
         * Salva o estado atual do jogo no localStorage.
         */
        saveState() {
            const saveData = {
                currentNodeKey: this.currentNodeKey,
                playerState: this.playerState
            };
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
        },

        /**
         * Carrega o estado do jogo do localStorage.
         * @returns {boolean} - True se um estado foi carregado com sucesso, false caso contrário.
         */
        loadState() {
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                const { currentNodeKey, playerState } = JSON.parse(savedData);
                this.currentNodeKey = currentNodeKey;
                this.playerState = playerState;
                this.showNode(this.currentNodeKey);
                return true;
            }
            return false;
        },

        /**
         * Limpa o jogo salvo e reinicia.
         */
        clearSaveAndRestart() {
            localStorage.removeItem(this.saveKey);
            this.newGame();
        },

        /**
         * Processa a escolha do jogador e avança na história.
         * @param {object} choice - O objeto de escolha selecionado de story.js.
         */
        makeChoice(choice) {
            // Aplica qualquer modificador de estado da própria escolha
            if (choice.setStats) {
                this.updateState(choice.setStats);
            }

            // Avança para o próximo nó
            const nextNodeKey = choice.nextNode;
            if (storyNodes[nextNodeKey]) {
                this.showNode(nextNodeKey);
            } else {
                console.error(`Erro: O nó "${nextNodeKey}" não foi encontrado na história.`);
            }
        },

        /**
         * Função central para exibir um nó da história.
         * @param {string} nodeKey - A chave do nó a ser exibido.
         */
        showNode(nodeKey) {
            const node = storyNodes[nodeKey];
            if (!node) {
                console.error(`Nó "${nodeKey}" inválido.`);
                return;
            }
            
            this.currentNodeKey = nodeKey;
            
            // Aplica modificadores de estado ao carregar o nó
            if (node.onLoad && node.onLoad.setStats) {
                this.updateState(node.onLoad.setStats);
            }
            
            // Salva o estado atual após todas as modificações
            this.saveState();
            
            // Comanda a UI para renderizar o nó com o estado atualizado
            UI.renderNode(node, this.playerState);
        },

        /**
         * Atualiza o estado do jogador com base em um objeto de modificadores.
         * @param {object} statsToUpdate - Objeto com as chaves e valores a serem atualizados.
         */
        updateState(statsToUpdate) {
            for (const [stat, value] of Object.entries(statsToUpdate)) {
                if (typeof this.playerState[stat] === 'number') {
                    this.playerState[stat] += value; // Assume que se o stat existe e é número, o valor é aditivo
                } else {
                    this.playerState[stat] = value; // Caso contrário, define o valor (para booleanos ou novos stats)
                }
            }
        },
        
        /**
         * Lida com o esgotamento do tempo em uma decisão.
         */
        handleTimeout() {
            UI.clearUIForNextNode();
            UI.storyTextElement.textContent = "A indecisão consome você. A realidade se desfaz por sua hesitação...";
            
            // A penalidade é ser jogado em um final ruim
            setTimeout(() => this.showNode('breakMonitor'), 2000); 
        }
    };
    
    // Sobrescreve o listener do botão de restart para usar a função que limpa o save.
    UI.restartButton.onclick = () => Game.clearSaveAndRestart();

    // Inicia o Jogo!
    Game.start();
});
