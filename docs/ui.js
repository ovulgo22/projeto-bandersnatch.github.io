/*
 * UI.JS v2.1 - O Módulo de Renderização da Interface
 * Correções de bugs de interação e melhoria da comunicação com o motor do jogo.
 */
const UI = {
    // --- Referências aos Elementos do DOM ---
    storyTextElement: document.getElementById('story-text'),
    choicesContainer: document.getElementById('choices-container'),
    restartButton: document.getElementById('restart-button'),
    statsContainer: document.getElementById('stats-container'),
    timerContainer: document.getElementById('timer-container'),
    timerBar: document.getElementById('timer-bar'),
    glitchOverlay: document.getElementById('glitch-overlay'),
    timerTimeout: null, // v2.1: Centralizado o controle do timeout

    // --- Inicialização ---
    init() {
        // O listener do botão de restart é agora definido no script.js para ter acesso ao Game engine.
    },

    // --- Funções Principais de Renderização ---

    renderNode(node, playerState) {
        this.prepareForNextNode();
        this.renderStats(playerState);
        this.triggerEffects(node.effects);

        this.typewriterEffect(node.text, () => {
            const hasTimer = this.findTimerInChoices(node.choices);
            this.renderChoices(node.choices, playerState);

            if (hasTimer) {
                this.startTimer(hasTimer, () => Game.handleTimeout(node.timeoutNode));
            }
            
            if (!node.choices || node.choices.length === 0) {
                this.showRestartButton();
            }
        });
    },

    renderStats(playerState) {
        if (!playerState || Object.keys(playerState).length === 0) {
            this.statsContainer.classList.add('hidden');
            return;
        }
        
        this.statsContainer.innerHTML = '';
        for (const [stat, value] of Object.entries(playerState)) {
            if (value !== null && value !== undefined) {
                const statElement = document.createElement('span');
                statElement.className = 'stat-item';
                if (typeof value === 'boolean' && value === true) {
                    statElement.textContent = `${stat.replace(/([A-Z])/g, ' $1').toUpperCase()}`;
                } else if (typeof value === 'number') {
                    statElement.textContent = `${stat.toUpperCase()}: ${value}`;
                }
                this.statsContainer.appendChild(statElement);
            }
        }
        this.statsContainer.classList.remove('hidden');
    },

    renderChoices(choices, playerState) {
        if (!choices) return;

        choices.forEach((choice, index) => {
            if (this.meetsRequirements(choice, playerState)) {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.className = 'choice-button';
                
                button.onclick = () => {
                    this.lockChoices(); // v2.1 BUGFIX: Trava outras escolhas imediatamente.
                    Game.makeChoice(choice);
                };
                
                this.choicesContainer.appendChild(button);
                
                setTimeout(() => {
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    },

    // --- Funções de Efeitos e Utilitários ---

    /**
     * Inicia a barra de tempo.
     * @param {number} duration - A duração em segundos.
     * @param {function} onTimeoutCallback - v2.1: Função a ser chamada quando o tempo acabar.
     */
    startTimer(duration, onTimeoutCallback) {
        this.timerContainer.classList.remove('hidden');
        this.timerBar.style.animation = 'none';
        void this.timerBar.offsetWidth;
        
        this.timerBar.style.animation = `countdown ${duration}s linear forwards`;
        
        this.timerTimeout = setTimeout(() => {
            this.lockChoices(); // v2.1 BUGFIX: Trava a UI ao fim do tempo.
            if (onTimeoutCallback) onTimeoutCallback();
        }, duration * 1000);
    },

    stopTimer() {
        if (this.timerTimeout) {
            clearTimeout(this.timerTimeout);
            this.timerTimeout = null;
            this.timerBar.style.animation = 'none';
            this.timerContainer.classList.add('hidden');
        }
    },

    triggerEffects(effects) {
        if (!effects) return;
        if (effects.glitch) {
            this.glitchOverlay.classList.add('active');
            setTimeout(() => this.glitchOverlay.classList.remove('active'), 700);
        }
    },
    
    // v2.1 BUGFIX: Previne cliques múltiplos e race conditions.
    lockChoices() {
        this.stopTimer();
        this.choicesContainer.classList.add('locked'); // Adiciona classe para desabilitar pointer-events via CSS
        
        // Adiciona um feedback visual aos botões não escolhidos
        const buttons = this.choicesContainer.querySelectorAll('.choice-button');
        buttons.forEach(btn => btn.disabled = true);
    },
    
    typewriterEffect(text, callback) {
        // ... (código inalterado)
        let i = 0;
        const speed = 20;
        this.storyTextElement.textContent = '';

        const type = () => {
            if (i < text.length) {
                this.storyTextElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        };
        type();
    },

    meetsRequirements(choice, playerState) {
        // ... (código inalterado)
        if (!choice.requires) return true;
        for (const [stat, reqValue] of Object.entries(choice.requires)) {
            const playerValue = playerState[stat];
            if (typeof reqValue === 'boolean' && playerValue !== reqValue) return false;
            if (typeof reqValue === 'object') {
                if (reqValue.lessThan && (playerValue === undefined || playerValue >= reqValue.lessThan)) return false;
                if (reqValue.greaterThan && (playerValue === undefined || playerValue <= reqValue.greaterThan)) return false;
            }
        }
        return true;
    },
    
    findTimerInChoices(choices) {
        if (!choices) return null;
        const choiceWithTimer = choices.find(c => c.timer);
        return choiceWithTimer ? choiceWithTimer.timer : null;
    },

    showRestartButton() {
        this.restartButton.classList.remove('hidden');
    },

    prepareForNextNode() {
        this.stopTimer(); // Garante que qualquer timer anterior seja limpo
        this.storyTextElement.textContent = '';
        this.choicesContainer.innerHTML = '';
        this.choicesContainer.classList.remove('locked'); // v2.1: Destrava o container para a nova cena
        this.restartButton.classList.add('hidden');
    }
};

UI.init();
