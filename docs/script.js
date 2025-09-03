/*
 * SCRIPT.JS v3.2 - Motor de Jogo e Orquestração (Código Completo e Otimizado)
 * Otimiza o módulo de áudio com requestAnimationFrame e refina a lógica de reinício.
 */
document.addEventListener('DOMContentLoaded', () => {

    const Game = {
        state: {
            currentNodeKey: null,
            playerState: {},
        },
        
        config: {
            saveKey: 'projectBandersnatch_v3_save',
            debug: true, // v3.2: Flag para controlar o modo de depuração.
        },

        /**
         * v3.2: Módulo de Áudio Otimizado com requestAnimationFrame
         */
        audio: {
            elements: {},
            currentMusic: null,
            isUnlocked: false,
            pendingMusic: null,
            animationFrameId: null,

            init() {
                this.elements.bgm = document.getElementById('bgm-main');
                if (!this.elements.bgm) console.error("Elemento de áudio BGM não encontrado!");
            },

            setVolume(level) {
                if(this.elements.bgm) this.elements.bgm.volume = level;
            },

            playSound(soundName) { /* ... (lógica da v3.1 inalterada) ... */ },

            playMusic(track, onComplete = null) {
                if (!this.isUnlocked) {
                    this.pendingMusic = { track, onComplete };
                    return;
                }
                if (track === this.currentMusic) {
                    if (onComplete) onComplete();
                    return;
                }

                cancelAnimationFrame(this.animationFrameId);

                const fadeDuration = 1500; // Duração do fade em milissegundos
                const targetVolume = UI.state.volume;

                // Fade out da música atual
                if (this.currentMusic && this.elements.bgm.src && !this.elements.bgm.paused) {
                    const startVolume = this.elements.bgm.volume;
                    let startTime = null;

                    const fadeOutStep = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const newVolume = Math.max(0, startVolume - (startVolume * (progress / fadeDuration)));
                        this.elements.bgm.volume = newVolume;

                        if (progress < fadeDuration) {
                            this.animationFrameId = requestAnimationFrame(fadeOutStep);
                        } else {
                            this.elements.bgm.pause();
                            if (track !== 'fadeout') this.startNewTrack(track, targetVolume, fadeDuration, onComplete);
                            else if(onComplete) onComplete();
                        }
                    };
                    this.animationFrameId = requestAnimationFrame(fadeOutStep);
                } else if (track !== 'fadeout') {
                    this.startNewTrack(track, targetVolume, fadeDuration, onComplete);
                } else {
                    if(onComplete) onComplete();
                }

                this.currentMusic = track === 'fadeout' ? null : track;
            },

            startNewTrack(track, targetVolume, fadeDuration, onComplete) {
                this.elements.bgm.src = track;
                this.elements.bgm.volume = 0;
                this.elements.bgm.play().catch(e => console.warn("Autoplay de áudio bloqueado."));
                
                let startTime = null;
                const fadeInStep = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const newVolume = Math.min(targetVolume, targetVolume * (progress / fadeDuration));
                    this.elements.bgm.volume = newVolume;

                    if (progress < fadeDuration) {
                        this.animationFrameId = requestAnimationFrame(fadeInStep);
                    } else {
                         if(onComplete) onComplete();
                    }
                };
                this.animationFrameId = requestAnimationFrame(fadeInStep);
            },
            
            unlock() {
                if (this.isUnlocked) return;
                this.isUnlocked = true;
                console.log("Contexto de áudio desbloqueado.");
                if (this.pendingMusic) {
                    this.playMusic(this.pendingMusic.track, this.pendingMusic.onComplete);
                    this.pendingMusic = null;
                }
            }
        },

        init() {
            console.log("Game Engine v3.2 Initializing...");
            UI.init();
            this.audio.init();
            UI.elements.restartButton.onclick = () => this.clearSaveAndRestart();
            if (this.config.debug) {
                window.Game = this; // v3.2: Exposição global apenas em modo debug.
            }
            this.start();
        },

        start() {
            const onGameReady = () => UI.hideLoadingScreen();
            if (!this.loadState(onGameReady)) {
                this.newGame(onGameReady);
            }
        },

        newGame(onReadyCallback) {
            this.state.currentNodeKey = 'start';
            this.state.playerState = { sanidade: 100, suspeita: 0, conhecimento: 0 };
            this.showNode(this.state.currentNodeKey, onReadyCallback);
        },

        saveState() { /* ... (código da v3.1 inalterado) ... */ },
        loadState(onReadyCallback) { /* ... (código da v3.1 inalterado) ... */ },

        clearSaveAndRestart() {
            localStorage.removeItem(this.config.saveKey);
            UI.prepareForNextNode();
            // v3.2 REFINAMENTO: Usa um callback para um reinício preciso após o fadeout.
            this.audio.playMusic('fadeout', () => this.newGame(null));
        },

        makeChoice(choice) {
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
                UI.elements.storyTextVisual.textContent = `ERRO 404: A sua escolha levou a um caminho que não existe. A realidade se desfaz.`;
                UI.elements.storyTextAccessible.textContent = UI.elements.storyTextVisual.textContent;
                UI.elements.choicesContainer.innerHTML = '';
                UI.showRestartButton();
                if (onReadyCallback) onReadyCallback();
                return;
            }
            this.state.currentNodeKey = nodeKey;
            if (node.onLoad && node.onLoad.setStats) {
                this.updateState(node.onLoad.setStats);
            }
            this.saveState();
            UI.renderNode(node, this.state.playerState, onReadyCallback);
        },

        updateState(statsToUpdate) { /* ... (código da v3.1 inalterado) ... */ },
        handleTimeout(timeoutNodeKey) { /* ... (código da v3.1 inalterado) ... */ }
    };

    Game.init();
});
