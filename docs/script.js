const Game = {
    currentNodeKey: null,

    start() {
        this.currentNodeKey = 'start';
        const startNode = storyNodes[this.currentNodeKey];
        UI.renderNode(startNode);
    },

    makeChoice(nextNodeKey) {
        if (storyNodes[nextNodeKey]) {
            this.currentNodeKey = nextNodeKey;
            const nextNode = storyNodes[this.currentNodeKey];
            UI.renderNode(nextNode);
        } else {
            console.error(`Erro: O nó "${nextNodeKey}" não foi encontrado na história.`);
        }
    }
};

// Inicia o jogo quando a página carregar
window.onload = () => Game.start();
