/*
    PROJETO: Documentação de Cargos em Desenvolvimento Web
    ARQUIVO: script.js
    VERSÃO: 1.0
    DATA: 03/09/2025
    DESCRIÇÃO: Script para funcionalidades interativas do site, como a alternância de tema.
               O código é escrito com foco em performance, acessibilidade e experiência do usuário.
*/

// QA & Front-End: Envolvemos todo o código em um evento 'DOMContentLoaded'.
// Isso garante que o script só execute após o HTML ser completamente carregado e analisado,
// evitando erros de "elemento não encontrado". É uma prática de programação defensiva.
document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO DE ALTERNÂNCIA DE TEMA ---

    // 1. SELEÇÃO DOS ELEMENTOS DO DOM
    // Selecionamos os elementos com os quais vamos interagir.
    const themeToggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Acessa a tag <html>

    // QA: Verificação para garantir que o botão existe na página antes de tentar adicionar um evento.
    // Se, por algum motivo, o botão for removido do HTML, o script não quebrará.
    if (!themeToggleButton) {
        console.warn('Botão de alternância de tema não encontrado no DOM.');
        return; // Encerra a execução deste módulo se o botão não existir.
    }

    // 2. CONSTANTES E ÍCONES
    // Creative Dev: Usar emojis ou SVGs como ícones é uma forma leve de adicionar apelo visual.
    const ICONS = {
        light: '☀️', // Sol para tema claro
        dark: '🌙'  // Lua para tema escuro
    };

    // 3. FUNÇÃO PRINCIPAL PARA APLICAR O TEMA
    /**
     * Aplica um tema (claro ou escuro) ao site, atualizando a classe do HTML,
     * o ícone do botão, o aria-label para acessibilidade e salvando a preferência.
     * @param {string} theme - O tema a ser aplicado ('light' or 'dark').
     */
    const applyTheme = (theme) => {
        // Front-End: Adiciona ou remove a classe que ativa as variáveis CSS do tema escuro.
        htmlElement.classList.toggle('dark-theme', theme === 'dark');

        // A11y: Atualiza o aria-label para que leitores de tela informem a ação correta do botão.
        const newLabel = `Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`;
        themeToggleButton.setAttribute('aria-label', newLabel);

        // UI/UX: Atualiza o ícone do botão para refletir o estado atual.
        themeToggleButton.innerHTML = theme === 'dark' ? ICONS.light : ICONS.dark;

        // UX: Salva a escolha do usuário no localStorage para persistência entre visitas.
        localStorage.setItem('theme', theme);
    };

    // 4. LÓGICA DE INICIALIZAÇÃO DO TEMA
    // UX: Esta é a lógica "inteligente". Ela decide qual tema carregar na primeira visita.
    // A prioridade é:
    // 1. Preferência salva pelo usuário (localStorage).
    // 2. Preferência do sistema operacional do usuário (prefers-color-scheme).
    // 3. Padrão: tema claro.
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determina o tema inicial com base na hierarquia de prioridades.
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Aplica o tema determinado assim que o script carrega.
    applyTheme(initialTheme);


    // 5. EVENT LISTENER PARA O CLIQUE
    // Adiciona o evento de clique ao botão para permitir a alternância manual.
    themeToggleButton.addEventListener('click', () => {
        // Verifica qual é o tema atual checando a presença da classe '.dark-theme'.
        const currentTheme = htmlElement.classList.contains('dark-theme') ? 'dark' : 'light';
        
        // Calcula o novo tema. Se o atual for 'dark', o novo será 'light', e vice-versa.
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Aplica o novo tema.
        applyTheme(newTheme);
    });

    // --- OUTROS MÓDULOS PODEM SER ADICIONADOS AQUI NO FUTURO ---
    // Ex: Funcionalidade de busca, animações de scroll, etc.

});
