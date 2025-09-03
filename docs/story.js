const storyNodes = {
    start: {
        text: "Você acorda em uma sala escura. Um monitor antigo pisca à sua frente, exibindo um único prompt: > Olá, Estranho. Quer jogar um jogo?",
        choices: [
            { text: "Aceitar o convite.", nextNode: "gameAccepted" },
            { text: "Tentar encontrar a porta.", nextNode: "findDoor" }
        ]
    },
    findDoor: {
        text: "Você se levanta e cambaleia na escuridão. Suas mãos encontram uma parede fria e metálica. Não há maçaneta, nem fresta. Apenas o brilho do monitor ilumina o ambiente. Ele agora exibe: > Escolha errada.",
        choices: [
            { text: "Voltar para o computador.", nextNode: "gameAccepted" }
        ]
    },
    gameAccepted: {
        text: "O monitor pisca e exibe um código complexo. Duas linhas se destacam. Uma parece estável, a outra, experimental. > Qual você executa?",
        choices: [
            { text: "Executar o código estável.", nextNode: "stableCode" },
            { text: "Executar o código experimental.", nextNode: "experimentalCode" }
        ]
    },
    stableCode: {
        text: "O código compila sem erros. Uma porta se abre atrás de você, revelando o mundo exterior exatamente como você o deixou. Você está livre. Foi apenas um sonho estranho... ou não?",
        choices: [] // Final 1
    },
    experimentalCode: {
        text: "O terminal enche-se de caracteres corrompidos. A tela pisca violentamente e exibe uma imagem de você mesmo, sentado nesta mesma cadeira, olhando para este mesmo monitor. A imagem sorri. > Estamos apenas começando.",
        choices: [
            { text: "Puxar os cabos da tomada.", nextNode: "pullCables" },
            { text: "Digitar 'QUEM É VOCÊ?' no terminal.", nextNode: "askWho" }
        ]
    },
    pullCables: {
        text: "Você arranca os cabos da parede. O monitor apaga, mergulhando a sala em escuridão total. Um som de clique ecoa. A porta se abre. Mas a liberdade tem um custo. Você sente que algo mudou dentro de você.",
        choices: [] // Final 2
    },
    askWho: {
        text: "As palavras aparecem lentamente na tela: > Eu sou você. A versão que fez a escolha certa. O loop continua, e agora você está preso aqui, para sempre.",
        choices: [] // Final 3
    }
};
