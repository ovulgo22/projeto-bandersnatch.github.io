/*
 * STORY.JS v2.1 - O Roteiro Interativo
 *
 * ESTRUTURA DE UM NÓ (NODE):
 *
 * [nodeId]: {
 * text: "...",
 * onLoad: { ... },
 * effects: { ... },
 * * // v2.1: A consequência do timer agora é definida aqui, na própria história.
 * timer: 15, // (Opcional) Adiciona um timer para a decisão.
 * timeoutNode: 'idDoNoDeTimeout', // (Opcional) Nó para onde ir se o tempo acabar.
 * * choices: [
 * {
 * text: "...",
 * nextNode: "...",
 * requires: { ... },
 * setStats: { ... }
 * }
 * ]
 * }
 */

const storyNodes = {
    start: {
        text: "O zumbido baixo de um CRT preenche o silêncio. Você está em uma sala sem janelas. O monitor à sua frente pisca: > ACORDE.",
        choices: [
            { text: "Obedecer.", nextNode: "obey" },
            { text: "Ignorar e examinar a sala.", nextNode: "examineRoom" }
        ]
    },
    examineRoom: {
        text: "As paredes são de um concreto liso e frio. Não há portas. A única saída parece ser através da tela. O monitor agora exibe: > NÃO HÁ ESCAPATÓRIA. APENAS ESCOLHAS.",
        onLoad: { setStats: { suspeita: 10 } },
        choices: [
            { text: "Voltar-se para o monitor.", nextNode: "obey" }
        ]
    },
    obey: {
        text: "Você foca na tela. O texto muda. > O sistema está instável. Uma anomalia foi detectada. Deseja iniciar a depuração ou forçar a execução?",
        timer: 15,
        timeoutNode: 'hesitation', // v2.1 ANOMALY FIX: Define o destino do timeout aqui.
        effects: { sound: 'sfx-tension' },
        choices: [
            { text: "Iniciar depuração.", nextNode: "debug" },
            { text: "Forçar execução.", nextNode: "forceExecute" }
        ]
    },
    debug: {
        text: "Você entra no modo de depuração. Linhas de código fluem pela tela, a maioria indecifrável, mas uma variável chama sua atenção: 'userSanity'. Seu valor atual é 100.",
        onLoad: { setStats: { conhecimento: 1 } },
        choices: [
            { text: "Alterar o valor para 0.", nextNode: "sanityZero" },
            { text: "Sair da depuração.", nextNode: "debugExit" }
        ]
    },
    forceExecute: {
        text: "Você força a execução. A tela racha em um mosaico de pixels mortos. Um som agudo preenche a sala e sua cabeça dói. A realidade parece... fina.",
        onLoad: { setStats: { sanidade: -20 } },
        effects: { glitch: true, sound: 'sfx-glitch' },
        choices: [
            { text: "Reiniciar o terminal.", nextNode: "obey" },
            { text: "Tentar quebrar o monitor.", nextNode: "breakMonitor" },
            { 
                text: "Aceitar a estática como sua nova realidade.", 
                nextNode: "embraceStatic",
                requires: { sanidade: { lessThan: 85 } }
            }
        ]
    },
    breakMonitor: {
        text: "Você golpeia a tela com toda a sua força. Ela não quebra. Em vez disso, sua mão a atravessa como se fosse água. A estática fria sobe pelo seu braço, consumindo você.",
        onLoad: { setStats: { sanidade: -50 } },
        effects: { glitch: true, sound: 'sfx-long_glitch' },
        choices: [] // Final: Consumido
    },
    embraceStatic: {
        text: "Você relaxa e encara a estática. A dor de cabeça some. No ruído branco, você começa a ver padrões, verdades, um código subjacente ao universo. Você não precisa mais de um corpo.",
        onLoad: { setStats: { sanidade: -100, conhecimento: 10 } },
        choices: [] // Final: Iluminado
    },
    sanityZero: {
        text: "Você altera o valor para 0 e pressiona Enter. A sala desaparece. Você é código. Você é a anomalia. Você está livre do hardware.",
        choices: [] // Final: Anomalia
    },
    debugExit: {
        text: "Você sai da depuração. Tudo parece normal, mas agora você sabe que está sendo observado. Que cada escolha sua está sendo registrada.",
        choices: [
            { text: "Continuar, com cautela.", nextNode: "forceExecute", setStats: { sanidade: -5 } }
        ]
    },
    // v2.1: Novo nó de final específico para o timeout.
    hesitation: {
        text: "Você hesita por tempo demais. A anomalia no sistema interpreta sua inação como uma ameaça. O código se autoprotege, ejetando sua consciência do loop. A tela se apaga. Fim da linha.",
        effects: { sound: 'sfx-fail' },
        choices: [] // Final: Hesitação
    }
};
