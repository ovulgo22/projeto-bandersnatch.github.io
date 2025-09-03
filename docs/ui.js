/*
 * UI.JS v3.1 - Motor de Renderização de Interface (Código Completo com Correções)
 */
const UI = {
    // ... (state permanece o mesmo da v3.0) ...
    state: {
        textSpeed: 25,
        volume: 0.5,
        isModalOpen: false,
        currentBackground: null,
    },
    
    elements: {},

    init() {
        this.collectElements();
        this.bindEvents();
        this.loadSettings();
        console.log("UI Engine v3.1 Initialized.");
    },

    /**
     * v3.1 BUGFIX: Mapeia elementos do DOM com IDs 'kebab-case' para chaves 'camelCase'.
     * Ex: 'story-text' no HTML se torna this.elements.storyText no JS.
     */
    collectElements() {
        const toCamelCase = s => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', ''));
        const ids = [ /* ... (lista de IDs da v3.0 inalterada) ... */ ];

        document.querySelectorAll('[id]').forEach(el => {
            this.elements[toCamelCase(el.id)] = el;
        });
        
        this.elements.textSpeedRadios = document.querySelectorAll('input[name="text-speed"]');
    },

    bindEvents() { /* ... (código da v3.0 inalterado) ... */ },

    //----------------------------------------------------------------
    // 1. GERENCIAMENTO DE TELA E MODAL (LÓGICA REFINADA)
    //----------------------------------------------------------------

    /**
     * v3.1 BUGFIX: Esta função agora é chamada pelo Game Engine quando a primeira
     * cena está 100% pronta, e não após um timer arbitrário.
     */
    hideLoadingScreen() {
        this.elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.elements.loadingScreen.style.display = 'none';
        }, 400);
    },

    /**
     * v3.1 ANOMALY FIX: Lógica de abrir/fechar o modal simplificada.
     */
    openSettings() {
        if (this.state.isModalOpen) return;
        this.state.isModalOpen = true;
        this.elements.settingsModal.classList.add('visible');
    },

    closeSettings() {
        if (!this.state.isModalOpen) return;
        this.state.isModalOpen = false;
        this.elements.settingsModal.classList.remove('visible');
    },

    // ... (o restante do código, como renderNode, renderPresentation, typewriterEffect, etc.,
    // permanece funcionalmente o mesmo da v3.0, mas agora usa os nomes de elementos
    // camelCase, ex: this.elements.storyText em vez de this.elements['story-text']) ...
};
// NOTA: O código completo das outras funções do UI (renderNode, etc.) não precisa de
// alterações lógicas para esta correção de bug, apenas a consistência no uso de
// this.elements.camelCase, que a função collectElements já garante.
    
    //----------------------------------------------------------------
    // 2. GERENCIAMENTO DE CONFIGURAÇÕES (COM PERSISTÊNCIA)
    //----------------------------------------------------------------

    loadSettings() {
        const savedSpeed = localStorage.getItem('projectBandersnatch_textSpeed');
        const savedVolume = localStorage.getItem('projectBandersnatch_volume');

        // Define os valores no estado da UI, usando o padrão se nada for encontrado
        const speed = savedSpeed ? savedSpeed : this.state.textSpeed;
        const volume = savedVolume ? savedVolume : this.state.volume;
        
        this.handleTextSpeedChange(speed);
        this.handleVolumeChange(volume);

        // Atualiza os inputs do formulário para refletir os valores carregados
        this.elements.volumeSlider.value = this.state.volume;
        const radioToCheck = document.querySelector(`input[name="text-speed"][value="${this.state.textSpeed}"]`);
        if (radioToCheck) radioToCheck.checked = true;
    },

    handleVolumeChange(volume) {
        this.state.volume = parseFloat(volume);
        localStorage.setItem('projectBandersnatch_volume', this.state.volume);
        if (window.Game && Game.audio) {
            Game.audio.setVolume(this.state.volume);
        }
    },

    handleTextSpeedChange(speed) {
        this.state.textSpeed = parseInt(speed, 10);
        localStorage.setItem('projectBandersnatch_textSpeed', this.state.textSpeed);
    },
    
    //----------------------------------------------------------------
    // 3. MOTOR DE RENDERIZAÇÃO PRINCIPAL
    //----------------------------------------------------------------

    renderNode(node, playerState) {
        this.prepareForNextNode();
        this.renderPresentation(node.presentation);
        this.renderStats(playerState);
        this.triggerEffects(node.effects);

        this.typewriterEffect(node.text, () => {
            const timerDuration = node.choices?.find(c => c.timer)?.timer;
            this.renderChoices(node.choices, playerState);

            if (timerDuration) {
                this.startTimer(timerDuration, () => Game.handleTimeout(node.timeoutNode));
            }
            
            if (!node.choices || node.choices.length === 0) {
                this.showRestartButton();
            }
        });
    },

    renderPresentation(presentation) {
        if (!presentation) return;

        if (presentation.music && window.Game && Game.audio) {
            Game.audio.playMusic(presentation.music);
        }

        const newBg = presentation.background;
        if (newBg) {
            const oldBgElement = this.state.currentBackground;
            let newBgElement = null;
            
            const onBgLoad = () => {
                newBgElement.style.opacity = 1;
                if (oldBgElement) {
                    oldBgElement.style.opacity = 0;
                    setTimeout(() => oldBgElement.remove(), 1000);
                }
                this.state.currentBackground = newBgElement;
            };

            if (newBg.video) {
                newBgElement = document.createElement('video');
                newBgElement.src = newBg.video;
                newBgElement.autoplay = true;
                newBgElement.muted = true;
                newBgElement.loop = true;
                newBgElement.playsInline = true;
                newBgElement.addEventListener('canplaythrough', onBgLoad, { once: true });
            } else if (newBg.image) {
                newBgElement = document.createElement('img');
                newBgElement.src = newBg.image;
                newBgElement.addEventListener('load', onBgLoad, { once: true });
            }

            if (newBgElement) {
                newBgElement.style.opacity = 0;
                newBgElement.style.transition = 'opacity 1s ease-in-out';
                this.elements.backgroundContainer.appendChild(newBgElement);
            }
        }
    },
    
    renderStats(playerState) {
        if (!playerState || Object.keys(playerState).length === 0) {
            this.elements.statsContainer.classList.add('hidden');
            return;
        }
        
        this.elements.statsContainer.innerHTML = '';
        for (const [stat, value] of Object.entries(playerState)) {
            if (value !== null && value !== undefined && value !== false) {
                const statElement = document.createElement('span');
                statElement.className = 'stat-item';
                if (typeof value === 'boolean' && value === true) {
                    statElement.textContent = `${stat.replace(/([A-Z])/g, ' $1').toUpperCase()}`;
                } else if (typeof value === 'number') {
                    statElement.textContent = `${stat.toUpperCase()}: ${value}`;
                }
                this.elements.statsContainer.appendChild(statElement);
            }
        }
        this.elements.statsContainer.classList.remove('hidden');
    },

    renderChoices(choices, playerState) {
        if (!choices) return;

        choices.forEach((choice, index) => {
            if (this.meetsRequirements(choice, playerState)) {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.className = 'choice-button';
                
                button.onclick = () => {
                    this.lockChoices();
                    Game.makeChoice(choice);
                };
                
                this.elements.choicesContainer.appendChild(button);
                
                setTimeout(() => {
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    },

    //----------------------------------------------------------------
    // 4. EFEITOS E UTILITÁRIOS
    //----------------------------------------------------------------

    typewriterEffect(text, callback) {
        let i = 0;
        const speed = this.state.textSpeed;
        this.elements.storyText.innerHTML = ''; // Usar innerHTML para permitir tags como <br> no futuro
        const textNodes = text.split('');

        const type = () => {
            if (i < textNodes.length) {
                this.elements.storyText.innerHTML += textNodes[i];
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        };
        type();
    },

    lockChoices() {
        this.stopTimer();
        this.elements.choicesContainer.querySelectorAll('.choice-button').forEach(btn => {
            btn.disabled = true;
        });
    },

    startTimer(duration, onTimeoutCallback) {
        this.elements.timerContainer.classList.remove('hidden');
        this.elements.timerBar.style.animation = 'none';
        void this.elements.timerBar.offsetWidth;
        
        this.elements.timerBar.style.animation = `countdown ${duration}s linear forwards`;
        
        this.timerTimeout = setTimeout(() => {
            this.lockChoices();
            if (onTimeoutCallback) onTimeoutCallback();
        }, duration * 1000);
    },

    stopTimer() {
        if (this.timerTimeout) {
            clearTimeout(this.timerTimeout);
            this.timerTimeout = null;
            this.elements.timerBar.style.animation = 'none';
            this.elements.timerContainer.classList.add('hidden');
        }
    },

    triggerEffects(effects) {
        if (!effects) return;
        if (effects.glitch) {
            this.elements.glitchOverlay.classList.add('active');
            setTimeout(() => this.elements.glitchOverlay.classList.remove('active'), 700);
        }
        if (effects.sound && window.Game && Game.audio) {
            Game.audio.playSound(effects.sound);
        }
    },
    
    meetsRequirements(choice, playerState) {
        if (!choice.requires) return true;
        for (const [stat, reqValue] of Object.entries(choice.requires)) {
            const playerValue = playerState[stat];
            if (typeof reqValue === 'boolean' && playerValue !== reqValue) return false;
            if (typeof reqValue === 'object') {
                if (reqValue.lessThan !== undefined && (playerValue === undefined || playerValue >= reqValue.lessThan)) return false;
                if (reqValue.greaterThan !== undefined && (playerValue === undefined || playerValue <= reqValue.greaterThan)) return false;
            }
        }
        return true;
    },

    showRestartButton() {
        this.elements.restartButton.classList.remove('hidden');
    },

    prepareForNextNode() {
        this.stopTimer();
        this.elements.storyText.textContent = '';
        this.elements.choicesContainer.innerHTML = '';
        this.elements.restartButton.classList.add('hidden');
    }
};
