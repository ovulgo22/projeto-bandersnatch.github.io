/*
 * SCRIPT.JS v3.1 - Motor de Jogo e Orquestração (Código Completo com Correções)
 * Corrige o bug de loading infinito, o autoplay de áudio e melhora a fluidez do reinício.
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
            saveKey: 'projectBandersnatch_v3_save', // Chave para o localStorage
        },

        /**
         * Módulo de Áudio Dedicado
         */
        audio: {
            elements: {},
            currentMusic: null,
            fadeInterval: null,
            isUnlocked: false, // v3.1: Flag para controlar o bloqueio de autoplay do navegador.
            pendingMusic: null, // v3.1: Armazena a música que deve tocar após o desbloqueio.

            init() {
                this.elements.sfx = {}; // Pode ser populado com mais sons no futuro
                this.elements.bgm = document.getElementById('bgm-main');
                if (!this.elements.bgm) {
                    console.error("Elemento de áudio BGM não encontrado!");
                }
            },

            setVolume(level) {
                if(this.elements.bgm) this.elements.bgm.volume = level;
                // Itera sobre futuros SFX
                for (const key in this.elements.sfx) {
                    if(this.elements.sfx[key]) this.elements.sfx[key].volume = level;
                }
            },

            playSound(soundName) {
                if (!this.isUnlocked) return;
                console.log(`Placeholder: Tocar efeito sonoro ${soundName}`);
            },

            playMusic(track) {
                if (!this.isUnlocked) {
                    this.pendingMusic = track;
                    return;
                }
                if (track === this.currentMusic) return;

                clearInterval(this.fadeInterval);

                const fadeDuration = 2000;
                const steps = 40;
                const stepDuration = fadeDuration / steps;
                const targetVolume = UI.state.volume;
                const volumeStep = targetVolume / steps;

                if (this.currentMusic && this.elements.bgm.src && !this.elements.bgm.paused) {
                    let currentVolume = this.elements.bgm.volume;
                    this.fadeInterval = setInterval(() => {
                        currentVolume = Math.max(0, currentVolume - volumeStep);
                        this.elements.bgm.volume = currentVolume;
                        if (currentVolume <= 0) {
                            clearInterval(this.fadeInterval);
                            this.elements.bgm.pause();
                            if (track !== 'fadeout') this.startNewTrack(track, targetVolume, volumeStep, stepDuration);
                        }
                    }, stepDuration);
                } else if (track !== 'fadeout') {
                    this.startNewTrack(track, targetVolume, volumeStep, stepDuration);
                }

                this.currentMusic = track === 'fadeout' ? null : track;
            },

            startNewTrack(track, targetVolume, volumeStep, stepDuration) {
                this.elements.bgm.src = track;
                this.elements.bgm.volume = 0;
                this.elements.bgm.play().catch(e => console.warn("Autoplay de áudio bloqueado. Esperando interação do usuário."));
                
                let newVolume = 0;
                this.fadeInterval = setInterval(() => {
                    newVolume = Math.min(targetVolume, newVolume + volumeStep);
                    this.elements.bgm.volume = newVolume;
                    if (newVolume >= targetVolume) {
                        clearInterval(this.fadeInterval);
                    }
                }, stepDuration);
            },
            
            unlock() {
                if (this.isUnlocked) return;
                this.isUnlocked = true;
                console.log("Contexto de áudio desbloqueado pela interação do usuário.");
                // Tenta tocar qualquer música que estava pendente
                if (this.pendingMusic) {
                    this.playMusic(this.pendingMusic);
                    this.pendingMusic = null;
                }
            }
        },

        init() {
            console.log("Game Engine v3.1 Initializing...");
            UI.init();
            this.audio.init();
            UI.elements.restartButton.onclick = () => this.clearSaveAndRestart();
            this.start();
        },

        start() {
            // v3.1 BUGFIX: Passa um callback para ser executado quando o jogo estiver
            // 100% pronto para ser exibido, eliminando o loading infinito.
            const onGameReady = () => {
                UI.hideLoadingScreen();
            };

            if (!this.loadState(onGameReady)) {
                this.newGame(onGameReady);
            }
        },

        newGame(onReadyCallback) {
            this.state.currentNodeKey = 'start';
            this.state.playerState = { sanidade: 100, suspeita: 0, conhecimento: 0 };
            this.showNode(this.state.currentNodeKey, onReadyCallback);
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

        loadState(onReadyCallback) {
            try {
                const savedData = localStorage.getItem(this.config.saveKey);
                if (savedData) {
                    const { currentNodeKey, playerState } = JSON.parse(savedData);
                    this.state.currentNodeKey = currentNodeKey;
                    this.state.playerState = playerState;
                    this.showNode(this.state.currentNodeKey, onReadyCallback);
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
            this.audio.playMusic('fadeout');
            // v3.1 ANOMALY FIX: Reinício "suave" sem recarregar a página.
            UI.prepareForNextNode(); // Limpa a UI
            setTimeout(() => this.newGame(null), 1500); // Inicia um novo jogo após o fadeout da música
        },

        makeChoice(choice) {
            // v3.1 BUGFIX: Desbloqueia o áudio na primeira interação do jogador.
            this.audio.unlock();
            
            if (choice.setStats) {
                this.updateState(choice.setStats);
            }
            this.showNode(choice.nextNode);
        },
        
        showNode(nodeKey, onReadyCallback = null) {
            const node = storyNodes[nodeKey];
            if (!node) {
                console.error(`FALHA CRÍTICA: O nó da história "${nodeKey}" não foi encontrado.`);
                UI.elements.storyText.textContent = `ERRO 404: A sua escolha levou a um caminho que não existe. A realidade se desfaz.`;
                UI.elements.choicesContainer.innerHTML = '';
                UI.showRestartButton();
                if (onReadyCallback) onReadyCallback(); // Garante que o loading suma mesmo em caso de erro.
                return;
            }
            
            this.state.currentNodeKey = nodeKey;
            
            if (node.onLoad && node.onLoad.setStats) {
                this.updateState(node.onLoad.setStats);
            }
            
            this.saveState();
            // Passa o callback de prontidão para a UI, que o executará quando a animação de texto terminar.
            UI.renderNode(node, this.state.playerState, onReadyCallback);
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
