const UI = {
    storyTextElement: document.getElementById('story-text'),
    choicesContainer: document.getElementById('choices-container'),
    restartButton: document.getElementById('restart-button'),

    renderNode(node) {
        // Limpa o conteúdo anterior
        this.storyTextElement.textContent = '';
        this.choicesContainer.innerHTML = '';
        
        // Efeito de digitação para o texto
        this.typewriterEffect(node.text);

        // Cria os botões de escolha com um pequeno atraso
        setTimeout(() => {
            if (node.choices && node.choices.length > 0) {
                node.choices.forEach(choice => {
                    const button = document.createElement('button');
                    button.textContent = choice.text;
                    button.className = 'choice-button';
                    button.addEventListener('click', () => Game.makeChoice(choice.nextNode));
                    this.choicesContainer.appendChild(button);
                });
                this.restartButton.classList.add('hidden');
            } else {
                // É um nó final
                this.showRestartButton();
            }
        }, node.text.length * 25 + 500); // Atraso baseado no tamanho do texto
    },
    
    typewriterEffect(text) {
        let i = 0;
        const speed = 25; // Milissegundos por caractere
        
        const type = () => {
            if (i < text.length) {
                this.storyTextElement.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        type();
    },

    showRestartButton() {
        this.restartButton.classList.remove('hidden');
        this.restartButton.addEventListener('click', () => Game.start());
    }
};
