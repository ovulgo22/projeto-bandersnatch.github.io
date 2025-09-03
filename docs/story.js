/*
 * STORY.JS v3.2 - O Roteiro de Direção (Estável)
 * Nenhuma anomalia de codificação ou estrutural foi encontrada nesta versão.
 * A estrutura de dados suporta completamente o motor de jogo v3.1+.
 *
 * ESTRUTURA DE UM NÓ (NODE):
 *
 * [nodeId]: {
 * text: "O texto da cena.",
 * presentation: {
 * background: {
 * image: 'img/nome_da_imagem.jpg',
 * video: 'video/nome_do_video.mp4'
 * },
 * music: 'audio/trilha_sonora.mp3',
 * vfx: 'scanlines'
 * },
 * onLoad: { setStats: { sanidade: -10 } },
 * effects: { glitch: true, sound: 'nomeDoAudio' },
 * timer: 15,
 * timeoutNode: 'idDoNoDeTimeout',
 * choices: [
 * {
 * text: "Texto da escolha.",
 * nextNode: "idDoProximoNo",
 * requires: { sanidade: { lessThan: 50 } },
 * setStats: { sanidade: 5 }
 * }
 * ]
 * }
 */

const storyNodes = {
    start: {
        text: "O zumbido baixo de um CRT preenche o silêncio. Você está em uma sala sem janelas. O monitor à sua frente pisca: > ACORDE.",
        presentation: {
            background: { image: 'img/sala-escura.jpg' },
            music: 'audio/ambient-hum.mp3',
            vfx: 'scanlines'
        },
        choices: [
            { text: "Obedecer.", nextNode: "obey" },
            { text: "Ignorar e examinar a sala.", nextNode: "examineRoom" }
        ]
    },
    examineRoom: {
        text: "As paredes são de um concreto liso e frio. Não há portas. A única saída parece ser através da tela. O monitor agora exibe: > NÃO HÁ ESCAPATÓRIA. APENAS ESCOLHAS.",
        presentation: {
            music: 'audio/ambient-hum.mp3'
        },
        onLoad: { setStats: { suspeita: 10 } },
        choices: [
            { text: "Voltar-se para o monitor.", nextNode: "obey" }
        ]
    },
    obey: {
        text: "Você foca na tela. O texto muda. > O sistema está instável. Uma anomalia foi detectada. Deseja iniciar a depuração ou forçar a execução?",
        presentation: {
            music: 'audio/tensao-crescente.mp3'
        },
        timer: 15,
        timeoutNode: 'hesitation',
        effects: { sound: 'sfx-tension' },
        choices: [
            { text: "Iniciar depuração.", nextNode: "debug" },
            { text: "Forçar execução.", nextNode: "forceExecute" }
        ]
    },
    debug: {
        text: "Você entra no modo de depuração. Linhas de código fluem pela tela, a maioria indecifrável, mas uma variável chama sua atenção: 'userSanity'. Seu valor atual é 100.",
        presentation: {
            background: { video: 'video/codigo-fluindo.mp4' }
        },
        onLoad: { setStats: { conhecimento: 1 } },
        choices: [
            { text: "Alterar o valor para 0.", nextNode: "sanityZero" },
            { text: "Sair da depuração.", nextNode: "debugExit" }
        ]
    },
    forceExecute: {
        text: "Você força a execução. A tela racha em um mosaico de pixels mortos. Um som agudo preenche a sala e sua cabeça dói. A realidade parece... fina.",
        presentation: {
            background: { video: 'video/estatica-digital.mp4' },
            music: 'audio/ruido-agudo.mp3'
        },
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
        presentation: {
            music: 'fadeout'
        },
        onLoad: { setStats: { sanidade: -50 } },
        effects: { glitch: true, sound: 'sfx-long_glitch' },
        choices: []
    },
    embraceStatic: {
        text: "Você relaxa e encara a estática. A dor de cabeça some. No ruído branco, você começa a ver padrões, verdades, um código subjacente ao universo. Você não precisa mais de um corpo.",
        presentation: {
            music: 'audio/som-etereo.mp3'
        },
        onLoad: { setStats: { sanidade: -100, conhecimento: 10 } },
        choices: []
    },
    sanityZero: {
        text: "Você altera o valor para 0 e pressiona Enter. A sala desaparece. Você é código. Você é a anomalia. Você está livre do hardware.",
        presentation: {
            background: { image: 'img/vazio-digital.jpg' },
            music: 'fadeout'
        },
        choices: []
    },
    debugExit: {
        text: "Você sai da depuração. Tudo parece normal, mas agora você sabe que está sendo observado. Que cada escolha sua está sendo registrada.",
        choices: [
            { text: "Continuar, com cautela.", nextNode: "forceExecute", setStats: { sanidade: -5 } }
        ]
    },
    hesitation: {
        text: "Você hesita por tempo demais. A anomalia no sistema interpreta sua inação como uma ameaça. O código se autoprotege, ejetando sua consciência do loop. A tela se apaga. Fim da linha.",
        presentation: {
            music: 'fadeout'
        },
        effects: { sound: 'sfx-fail' },
        choices: []
    }
};
