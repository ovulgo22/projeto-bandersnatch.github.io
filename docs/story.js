/*
 * STORY.JS v2.0 - O Roteiro Interativo
 *
 * ESTRUTURA DE UM NÓ (NODE):
 *
 * [nodeId]: {
 * text: "O texto que será exibido para o jogador.",
 * * onLoad: { (Opcional) Ações a serem executadas quando este nó carregar.
 * setStats: { sanidade: -10, item: true } // Modifica os stats do jogador.
 * },
 *
 * effects: { (Opcional) Efeitos visuais ou sonoros a serem acionados.
 * glitch: true, // Ativa o overlay de glitch.
 * sound: 'nomeDoAudio' // Toca um som específico.
 * },
 *
 * choices: [
 * {
 * text: "Texto da escolha.",
 * nextNode: "idDoProximoNo",
 *
 * timer: 10, // (Opcional) Adiciona um timer de 10 segundos para a decisão.
 *
 * requires: { (Opcional) Condições para esta escolha aparecer.
 * sanidade: { lessThan: 50 }, // Requer que a sanidade seja MENOR que 50.
 * item: true // Requer que o jogador possua o 'item'.
 * },
 *
 * setStats: { sanidade: 5 } // (Opcional) Modifica stats ao escolher esta opção.
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
                requires: { sanidade: { lessThan: 85 } } // Só aparece se a sanidade já foi afetada.
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
        onload: { setStats: { sanidade: -100, conhecimento: 10 } },
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
    }
};
