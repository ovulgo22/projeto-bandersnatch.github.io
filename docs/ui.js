/*
 * UI.JS v2.0 - O Módulo de Renderização da Interface
 * Responsável por toda a manipulação do DOM. Lê as regras do jogo e do estado
 * do jogador para construir a interface visual.
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

    // --- Inicialização ---
    init() {
        this.restartButton.addEventListener('click', () => Game.start());
    },

    // --- Funções Principais de Renderização ---

    /**
     * Renderiza um nó da história completo na tela.
     * @param {object} node - O objeto do nó da história de story.js.
     * @param {object} playerState - O estado atual do jogador.
     */
    renderNode(node, playerState) {
        this.clearUIForNextNode();
        this.renderStats(playerState);
        this.triggerEffects(node.effects);

        this.typewriterEffect(node.text, () => {
            this.renderChoices(node.choices, playerState);
            if (!node.choices || node.choices.length === 0) {
                this.showRestartButton();
            }
        });
    },

    /**
     * Renderiza os status do jogador na parte superior da tela.
     * @param {object} playerState - O estado atual do jogador.
     */
    renderStats(playerState) {
        if (!playerState || Object.keys(playerState).length === 0) {
            this.statsContainer.classList.add('hidden');
            return;
        }
        
        this.statsContainer.innerHTML = ''; // Limpa stats antigos
        for (const [stat, value] of Object.entries(playerState)) {
            if (value !== null && value !== undefined) {
                const statElement = document.createElement('span');
                statElement.className = 'stat-item';
                // Formatação especial para diferentes tipos de stats
                if (typeof value === 'boolean' && value === true) {
                    statElement.textContent = `${stat.replace(/([A-Z])/g, ' $1').toUpperCase()}`; // Ex: "hasKey" -> "HAS KEY"
                } else if (typeof value === 'number') {
                    statElement.textContent = `${stat.toUpperCase()}: ${value}`;
                }
                this.statsContainer.appendChild(statElement);
            }
        }
        this.statsContainer.classList.remove('hidden');
    },

    /**
     * Cria e exibe os botões de escolha, filtrando os que não cumprem os requisitos.
     * @param {Array} choices - O array de escolhas do nó.
     * @param {object} playerState - O estado atual do jogador.
     */
    renderChoices(choices, playerState) {
        if (!choices) return;

        let hasTimer = false;
        choices.forEach((choice, index) => {
            if (this.meetsRequirements(choice, playerState)) {
                if (choice.timer) hasTimer = choice.timer; // Encontrou um timer
                
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.className = 'choice-button';
                button.onclick = () => {
                    this.stopTimer();
                    Game.makeChoice(choice);
                };
                
                this.choicesContainer.appendChild(button);
                
                // Animação de entrada escalonada
                setTimeout(() => {
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
        
        if (hasTimer) {
            this.startTimer(hasTimer);
        }
    },

    // --- Funções de Efeitos e Utilitários ---

    /**
     * Inicia a barra de tempo para decisões urgentes.
     * @param {number} duration - A duração em segundos.
     */
    startTimer(duration) {
        this.timerContainer.classList.remove('hidden');
        this.timerBar.style.animation = 'none'; // Reseta a animação
        void this.timerBar.offsetWidth; // Força um reflow do DOM
        
        this.timerBar.style.animation = `countdown ${duration}s linear forwards`;
        this.timerTimeout = setTimeout(() => {
            // Ação a ser tomada se o tempo acabar (pode ser expandida)
            Game.handleTimeout();
        }, duration * 1000);
    },

    stopTimer() {
        if (this.timerTimeout) {
            clearTimeout(this.timerTimeout);
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
        // Futuramente, pode tocar sons: if (effects.sound) { playSound(effects.sound); }
    },

    typewriterEffect(text, callback) {
        let i = 0;
        const speed = 20;
        this.storyTextElement.textContent = '';

        const type = () => {
            if (i < text.length) {
                this.storyTextElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback(); // Chama a função de retorno ao terminar
            }
        };
        type();
    },

    /**
     * Verifica se o jogador cumpre os requisitos para uma escolha.
     * @param {object} choice - O objeto da escolha.
     * @param {object} playerState - O estado atual do jogador.
     * @returns {boolean} - True se os requisitos forem cumpridos.
     */
    meetsRequirements(choice, playerState) {
        if (!choice.requires) {
            return true; // Sem requisitos, sempre mostra.
        }
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

    showRestartButton() {
        this.restartButton.classList.remove('hidden');
    },

    clearUIForNextNode() {
        this.storyTextElement.textContent = '';
        this.choicesContainer.innerHTML = '';
        this.restartButton.classList.add('hidden');
        this.stopTimer();
    }
};

UI.init();
