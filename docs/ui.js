/*
 * UI.JS v3.2 - Motor de Renderização de Interface (Foco em Acessibilidade)
 * Implementa a correção crítica para leitores de tela e gerenciamento de foco profissional.
 */
const UI = {
    state: {
        textSpeed: 25,
        volume: 0.5,
        isModalOpen: false,
        currentBackground: null,
        elementToFocusOnClose: null, // v3.2: Armazena o elemento que abriu o modal
    },

    elements: {},

    init() {
        this.collectElements();
        this.bindEvents();
        this.loadSettings();
        console.log("UI Engine v3.2 Initialized.");
    },
    
    collectElements() {
        const toCamelCase = s => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase().replace('-', ''));
        document.querySelectorAll('[id]').forEach(el => {
            this.elements[toCamelCase(el.id)] = el;
        });
        this.elements.textSpeedRadios = document.querySelectorAll('input[name="text-speed"]');
    },

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

    hideLoadingScreen() { /* ... (código da v3.1 inalterado) ... */ },

    openSettings() {
        if (this.state.isModalOpen) return;
        this.state.isModalOpen = true;
        // v3.2 ACESSIBILIDADE: Salva o elemento focado atualmente
        this.state.elementToFocusOnClose = document.activeElement;

        this.elements.settingsModal.classList.add('visible');
        
        // v3.2 ACESSIBILIDADE: Move o foco para dentro do modal
        this.elements.closeSettingsButton.focus();
    },

    closeSettings() {
        if (!this.state.isModalOpen) return;
        this.state.isModalOpen = false;
        this.elements.settingsModal.classList.remove('visible');

        // v3.2 ACESSIBILIDADE: Restaura o foco para o elemento original
        if (this.state.elementToFocusOnClose) {
            this.state.elementToFocusOnClose.focus();
        }
    },

    // v3.2 ACESSIBILIDADE: Função privada para a "armadilha de foco"
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
    
    loadSettings() { /* ... (código da v3.1 inalterado) ... */ },
    handleVolumeChange(volume) { /* ... (código da v3.1 inalterado) ... */ },
    handleTextSpeedChange(speed) { /* ... (código da v3.1 inalterado) ... */ },
    
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
            
            // v3.1: Sinaliza que a renderização inicial está completa.
            if (onReadyCallback) onReadyCallback();
        });
    },

    // ... (renderPresentation, renderStats, renderChoices da v3.1 permanecem os mesmos) ...
    renderPresentation(presentation) { /* ... */ },
    renderStats(playerState) { /* ... */ },
    renderChoices(choices, playerState) { /* ... */ },
    
    //----------------------------------------------------------------
    // 4. EFEITOS E UTILITÁRIOS (COM ACESSIBILIDADE)
    //----------------------------------------------------------------

    /**
     * v3.2 CORREÇÃO CRÍTICA DE ACESSIBILIDADE:
     * Atualiza um elemento para leitores de tela e outro para o efeito visual.
     */
    typewriterEffect(text, callback) {
        // 1. Atualiza o elemento acessível de uma só vez para uma leitura limpa.
        this.elements.storyTextAccessible.textContent = text;
        
        // 2. Anima o elemento visual.
        let i = 0;
        const speed = this.state.textSpeed;
        this.elements.storyTextVisual.innerHTML = '';
        
        const type = () => {
            if (i < text.length) {
                this.elements.storyTextVisual.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback(); // Sinaliza que a animação terminou.
            }
        };
        type();
    },

    // ... (O restante das funções utilitárias da v3.1 - lockChoices, startTimer,
    // stopTimer, triggerEffects, meetsRequirements, showRestartButton, prepareForNextNode
    // permanecem as mesmas).
    lockChoices() { /* ... */ },
    startTimer(duration, onTimeoutCallback) { /* ... */ },
    stopTimer() { /* ... */ },
    triggerEffects(effects) { /* ... */ },
    meetsRequirements(choice, playerState) { /* ... */ },
    showRestartButton() { /* ... */ },
    prepareForNextNode() { /* ... */ }
};
