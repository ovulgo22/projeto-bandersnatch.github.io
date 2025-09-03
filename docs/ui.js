/*
 * UI.JS v3.2 - Motor de Renderização de Interface (Código Completo com Foco em Acessibilidade)
 * Implementa a correção crítica para leitores de tela e gerenciamento de foco profissional.
 */
const UI = {
    // Estado interno da UI para configurações e controle
    state: {
        textSpeed: 25,
        volume: 0.5,
        isModalOpen: false,
        currentBackground: null,
        elementToFocusOnClose: null, // v3.2: Armazena o elemento que abriu o modal
    },

    // Centraliza todas as referências de elementos do DOM
    elements: {},

    /**
     * Ponto de entrada principal para a UI. Orquestra a configuração inicial.
     */
    init() {
        this.collectElements();
        this.bindEvents();
        this.loadSettings();
        console.log("UI Engine v3.2 Initialized.");
    },

    /**
     * v3.2: Mapeia elementos do DOM com IDs 'kebab-case' para chaves 'camelCase' no JS.
     */
    collectElements() {
        const toCamelCase = s => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', ''));
        document.querySelectorAll('[id]').forEach(el => {
            this.elements[toCamelCase(el.id)] = el;
        });
        this.elements.textSpeedRadios = document.querySelectorAll('input[name="text-speed"]');
    },

    /**
     * Vincula todos os eventos de interação do usuário.
     */
    bindEvents() {
        this.elements.openSettingsButton.addEventListener('click', () => this.openSettings());
        this.elements.closeSettingsButton.addEventListener('click', () => this.closeSettings());
        this.elements.volumeSlider.addEventListener('input', e => this.handleVolumeChange(e.target.value));
        this.elements.textSpeedRadios.forEach(radio => {
            radio.addEventListener('change', e => this.handleTextSpeedChange(e.target.value));
        });
        
        this.elements.settingsModal.addEventListener('click', e => {
            if (e.target === this.elements.settingsModal) this.closeSettings();
        });

        // v3.2 ACESSIBILIDADE: Adiciona listener para a armadilha de foco e para fechar com "Esc".
        this.elements.settingsModal.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.closeSettings();
            if (e.key === 'Tab') this._handleFocusTrap(e);
        });
    },
    
    //----------------------------------------------------------------
    // 1. GERENCIAMENTO DE TELA E MODAL (COM ACESSIBILIDADE)
    //----------------------------------------------------------------

    hideLoadingScreen() {
        this.elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.elements.loadingScreen.style.display = 'none';
        }, 400);
    },

    openSettings() {
        if (this.state.isModalOpen) return;
        this.state.isModalOpen = true;
        this.state.elementToFocusOnClose = document.activeElement; // Salva o foco atual
        this.elements.settingsModal.classList.add('visible');
        this.elements.closeSettingsButton.focus(); // Move o foco para dentro do modal
    },

    closeSettings() {
        if (!this.state.isModalOpen) return;
        this.state.isModalOpen = false;
        this.elements.settingsModal.classList.remove('visible');
        if (this.state.elementToFocusOnClose) { // Restaura o foco
            this.state.elementToFocusOnClose.focus();
        }
    },

    // v3.2 ACESSIBILIDADE: Função privada para a "armadilha de foco" (focus trap).
    _handleFocusTrap(e) {
        const focusableElements = this.elements.modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Se Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Se Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    },
    
    //----------------------------------------------------------------
    // 2. GERENCIAMENTO DE CONFIGURAÇÕES (COM PERSISTÊNCIA)
    //----------------------------------------------------------------
    
    loadSettings() {
        const savedSpeed = localStorage.getItem('projectBandersnatch_textSpeed');
        const savedVolume = localStorage.getItem('projectBandersnatch_volume');
        const speed = savedSpeed ? savedSpeed : this.state.textSpeed;
        const volume = savedVolume ? savedVolume : this.state.volume;
        this.handleTextSpeedChange(speed);
        this.handleVolumeChange(volume);
        this.elements.volumeSlider.value = this.state.volume;
        const radioToCheck = document.querySelector(`input[name="text-speed"][value="${this.state.textSpeed}"]`);
        if (radioToCheck) radioToCheck.checked = true;
    },

    handleVolumeChange(volume) {
        this.state.volume = parseFloat(volume);
        localStorage.setItem('projectBandersnatch_volume', this.state.volume);
        if (window.Game && Game.audio) Game.audio.setVolume(this.state.volume);
    },

    handleTextSpeedChange(speed) {
        this.state.textSpeed = parseInt(speed, 10);
        localStorage.setItem('projectBandersnatch_textSpeed', this.state.textSpeed);
    },
    
    //----------------------------------------------------------------
    // 3. MOTOR DE RENDERIZAÇÃO PRINCIPAL
    //----------------------------------------------------------------

    renderNode(node, playerState, onReadyCallback) {
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
            if (onReadyCallback) onReadyCallback();
        });
    },

    renderPresentation(presentation) {
        if (!presentation) return;
        if (presentation.music && window.Game && Game.audio) Game.audio.playMusic(presentation.music);
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
                newBgElement.autoplay = true; newBgElement.muted = true; newBgElement.loop = true; newBgElement.playsInline = true;
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
    // 4. EFEITOS E UTILITÁRIOS (COM ACESSIBILIDADE)
    //----------------------------------------------------------------

    typewriterEffect(text, callback) {
        this.elements.storyTextAccessible.textContent = text;
        let i = 0;
        const speed = this.state.textSpeed;
        this.elements.storyTextVisual.innerHTML = '';
        const type = () => {
            if (i < text.length) {
                this.elements.storyTextVisual.innerHTML += text.charAt(i);
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
        this.elements.storyTextVisual.innerHTML = '';
        this.elements.storyTextAccessible.textContent = '';
        this.elements.choicesContainer.innerHTML = '';
        this.elements.restartButton.classList.add('hidden');
    }
};
