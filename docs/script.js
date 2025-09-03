/*
 * SCRIPT.JS v2.1 - O Motor do Jogo (Game Engine)
 * Versão final com correções de bugs críticos, prevenção de corrupção de estado
 * e implementação de falha graciosa.
 */
document.addEventListener('DOMContentLoaded', () => {

    const Game = {
        currentNodeKey: null,
        playerState: {},
        saveKey: 'projectBandersnatch_v2_save',

        start() {
            if (!this.loadState()) {
                this.newGame();
            }
        },

        newGame() {
            this.currentNodeKey = 'start';
            this.playerState = { sanidade: 100, suspeita: 0, conhecimento: 0 };
            this.showNode(this.currentNodeKey);
        },

        saveState() {
            const saveData = {
                currentNodeKey: this.currentNodeKey,
                playerState: this.playerState
            };
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
        },

        loadState() {
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                try {
                    const { currentNodeKey, playerState } = JSON.parse(savedData);
                    this.currentNodeKey = currentNodeKey;
                    this.playerState = playerState;
                    this.showNode(this.currentNodeKey);
                    return true;
                } catch (error) {
                    // Se os dados salvos estiverem corrompidos, limpa e começa um novo jogo.
                    console.error("Falha ao carregar o save. Começando novo jogo.", error);
                    localStorage.removeItem(this.saveKey);
                    return false;
                }
            }
            return false;
        },

        clearSaveAndRestart() {
            localStorage.removeItem(this.saveKey);
            this.newGame();
        },

        makeChoice(choice) {
            if (choice.setStats) {
                this.updateState(choice.setStats);
            }
            this.showNode(choice.nextNode);
        },
        
        showNode(nodeKey) {
            // v2.1 BUGFIX: Mecanismo de falha graciosa.
            const node = storyNodes[nodeKey];
            if (!node) {
                console.error(`FALHA CRÍTICA: O nó da história "${nodeKey}" não foi encontrado.`);
                UI.storyTextElement.textContent = `ERRO 404: A sua escolha levou a um caminho que não existe. A realidade se desfaz.`;
                UI.choicesContainer.innerHTML = '';
                UI.showRestartButton();
                return;
            }
            
            this.currentNodeKey = nodeKey;
            
            if (node.onLoad && node.onLoad.setStats) {
                this.updateState(node.onLoad.setStats);
            }
            
            this.saveState();
            UI.renderNode(node, this.playerState);
        },

        /**
         * v2.1 BUGFIX: Previne a corrupção de estado (NaN) ao modificar stats.
         */
        updateState(statsToUpdate) {
            for (const [stat, value] of Object.entries(statsToUpdate)) {
                if (typeof value === 'number') {
                    // Garante que o stat seja inicializado como 0 se não existir, antes de somar.
                    this.playerState[stat] = (this.playerState[stat] || 0) + value;
                } else {
                    this.playerState[stat] = value;
                }
            }
        },
        
        /**
         * v2.1 ANOMALY FIX: A lógica agora é flexível e controlada pela história.
         */
        handleTimeout(timeoutNodeKey) {
            UI.storyTextElement.textContent = "O tempo se esgotou...";
            
            // Vai para o nó de timeout definido na história.
            setTimeout(() => this.showNode(timeoutNodeKey), 1500); 
        }
    };
    
    // Configura o listener do botão de restart aqui para garantir que o objeto Game exista.
    UI.restartButton.onclick = () => Game.clearSaveAndRestart();

    // Inicia o Jogo!
    Game.start();
});
