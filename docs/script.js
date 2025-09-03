/*
 * SCRIPT.JS v3.0 - Motor de Jogo e Orquestração
 * O cérebro central que gerencia o estado, a lógica, o áudio, a persistência
 * e comanda o motor de renderização da UI.
 */
document.addEventListener('DOMContentLoaded', () => {

    const Game = {
        // --- Estado do Jogo (Dados Salvos) ---
        state: {
            currentNodeKey: null,
            playerState: {},
        },
        
        // --- Configuração do Motor ---
        config: {
            saveKey: 'projectBandersnatch_v3_save',
        },

        /**
         * Módulo de Áudio Dedicado
         */
        audio: {
            elements: {},
            currentMusic: null,
            fadeInterval: null,

            init() {
                this.elements.sfx = {
                    hover: document.getElementById('sfx-hover'),
                    click: document.getElementById('sfx-click'),
                    glitch: document.getElementById('sfx-glitch'),
                };
                this.elements.bgm = document.getElementById('bgm-main');
            },

            setVolume(level) {
                for (const key in this.elements.sfx) {
                    if(this.elements.sfx[key]) this.elements.sfx[key].volume = level;
                }
                if(this.elements.bgm) this.elements.bgm.volume = level;
            },

            playSound(soundName) {
                // Futuramente, poderia carregar sons de um mapa de áudios
                // Por enquanto, é um placeholder para uma lógica mais complexa.
                console.log(`Placeholder: Play sound ${soundName}`);
            },

            playMusic(track) {
                if (track === this.currentMusic) return; // Já está tocando
                
                clearInterval(this.fadeInterval); // Cancela qualquer fade anterior

                const fadeDuration = 2000; // 2 segundos para o fade
                const steps = 40;
                const stepDuration = fadeDuration / steps;
                const volumeStep = UI.state.volume / steps;
                
                // Fade out da música atual
                if (this.currentMusic && this.elements.bgm.src) {
                    let currentVolume = this.elements.bgm.volume;
                    this.fadeInterval = setInterval(() => {
                        currentVolume -= volumeStep;
                        if (currentVolume <= 0) {
                            clearInterval(this.fadeInterval);
                            this.elements.bgm.pause();
                            if (track !== 'fadeout') this.startNewTrack(track, volumeStep, stepDuration);
                        } else {
                            this.elements.bgm.volume = currentVolume;
                        }
                    }, stepDuration);
                } else if (track !== 'fadeout') {
                    // Nenhuma música tocando, apenas inicia a nova
                    this.startNewTrack(track, volumeStep, stepDuration);
                }

                this.currentMusic = track === 'fadeout' ? null : track;
            },

            startNewTrack(track, volumeStep, stepDuration) {
                this.elements.bgm.src = track;
                this.elements.bgm.volume = 0;
                this.elements.bgm.play().catch(e => console.warn("Autoplay de áudio bloqueado pelo navegador. Interação do usuário necessária."));
                
                let newVolume = 0;
                this.fadeInterval = setInterval(() => {
                    newVolume += volumeStep;
                    if (newVolume >= UI.state.volume) {
                        clearInterval(this.fadeInterval);
                        this.elements.bgm.volume = UI.state.volume;
                    } else {
                        this.elements.bgm.volume = newVolume;
                    }
                }, stepDuration);
            }
        },

        /**
         * Ponto de entrada da aplicação.
         */
        init() {
            console.log("Game Engine v3.0 Initializing...");
            UI.init();
            this.audio.init();
            UI.elements.restartButton.onclick = () => this.clearSaveAndRestart();
            this.start();
        },

        /**
         * Orquestra o início da experiência do jogador.
         */
        start() {
            // Carrega ou cria um novo jogo. A renderização do primeiro nó ocorre aqui,
            // mas permanece oculta pela tela de carregamento.
            if (!this.loadState()) {
                this.newGame();
            }
            // Após o estado estar pronto e renderizado, remove a tela de carregamento.
            setTimeout(() => UI.hideLoadingScreen(), 500); // Pequeno delay para garantir que tudo carregou
        },

        newGame() {
            this.state.currentNodeKey = 'start';
            this.state.playerState = { sanidade: 100, suspeita: 0, conhecimento: 0 };
            this.showNode(this.state.currentNodeKey);
        },

        saveState() {
            try {
                const saveData = {
                    currentNodeKey: this.state.currentNodeKey,
                    playerState: this.state.playerState
                };
                localStorage.setItem(this.config.saveKey, JSON.stringify(saveData));
            } catch (error) {
                console.warn("Não foi possível salvar o progresso. O armazenamento local pode estar desabilitado ou cheio.", error);
            }
        },

        loadState() {
            try {
                const savedData = localStorage.getItem(this.config.saveKey);
                if (savedData) {
                    const { currentNodeKey, playerState } = JSON.parse(savedData);
                    this.state.currentNodeKey = currentNodeKey;
                    this.state.playerState = playerState;
                    this.showNode(this.state.currentNodeKey);
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Falha ao carregar o save. Começando novo jogo.", error);
                localStorage.removeItem(this.config.saveKey);
                return false;
            }
        },

        clearSaveAndRestart() {
            localStorage.removeItem(this.config.saveKey);
            // Faz um fadeout da música antes de reiniciar
            this.audio.playMusic('fadeout');
            setTimeout(() => window.location.reload(), 1500); // Recarrega a página para um reinício limpo
        },

        makeChoice(choice) {
            if (choice.setStats) {
                this.updateState(choice.setStats);
            }
            this.showNode(choice.nextNode);
        },
        
        showNode(nodeKey) {
            const node = storyNodes[nodeKey];
            if (!node) {
                console.error(`FALHA CRÍTICA: O nó da história "${nodeKey}" não foi encontrado.`);
                UI.elements.storyText.textContent = `ERRO 404: A sua escolha levou a um caminho que não existe. A realidade se desfaz.`;
                UI.elements.choicesContainer.innerHTML = '';
                UI.showRestartButton();
                return;
            }
            
            this.state.currentNodeKey = nodeKey;
            
            if (node.onLoad && node.onLoad.setStats) {
                this.updateState(node.onLoad.setStats);
            }
            
            this.saveState();
            UI.renderNode(node, this.state.playerState);
        },

        updateState(statsToUpdate) {
            for (const [stat, value] of Object.entries(statsToUpdate)) {
                if (typeof value === 'number') {
                    this.state.playerState[stat] = (this.state.playerState[stat] || 0) + value;
                } else {
                    this.state.playerState[stat] = value;
                }
            }
        },
        
        handleTimeout(timeoutNodeKey) {
            UI.elements.storyText.textContent = "O tempo se esgotou...";
            setTimeout(() => this.showNode(timeoutNodeKey), 1500); 
        }
    };

    // Inicia o motor do jogo.
    Game.init();

    // Disponibiliza o objeto Game globalmente para depuração fácil no console do navegador
    window.Game = Game;
});
