# Diretrizes de Contribuição para o Guia de Carreiras Web

Primeiramente, obrigado pelo seu interesse em contribuir! 🎉

Este projeto é um esforço da comunidade para criar um recurso educacional de alta qualidade. A sua ajuda é essencial para mantê-lo preciso, atualizado e útil para todos.

Ao contribuir, você concorda em seguir nosso [Código de Conduta](CODE_OF_CONDUCT.md) (a ser adicionado).

## 🚀 Como Você Pode Contribuir

Existem várias maneiras de contribuir, e todas são valiosas:

* **🔎 Relatando Bugs:** Encontrou algo que não funciona como esperado?
* **💡 Sugerindo Melhorias:** Tem uma ideia para uma nova funcionalidade ou para melhorar uma existente?
* **✍️ Melhorando a Documentação:** Encontrou um erro de digitação ou uma frase que poderia ser mais clara?
* **💻 Escrevendo Código:** Quer adicionar conteúdo, corrigir um bug ou implementar uma nova funcionalidade?

## 🐛 Guia para Relatar Bugs (Issues)

Antes de criar um novo "Issue", por favor, verifique se já não existe um relatório semelhante.

Ao criar um "Issue" de bug, inclua o máximo de detalhes possível:

* **Título Claro e Descritivo:** Ex: "O botão de tema não funciona no Firefox Mobile".
* **Passos para Reproduzir:** Descreva exatamente como podemos encontrar o mesmo erro.
* **Comportamento Esperado:** O que deveria ter acontecido?
* **Comportamento Atual:** O que de fato aconteceu? (Inclua screenshots, se aplicável).
* **Seu Ambiente:** Qual navegador e sistema operacional você está usando?

## ✨ Guia para Sugerir Melhorias

Use o "Issue" para sugerir melhorias, explicando sua ideia:

* **Qual problema sua sugestão resolve?** ("É difícil encontrar X", "O site seria mais acessível se Y").
* **Descreva a solução que você imagina.** Como ela funcionaria do ponto de vista do usuário?
* **Existem alternativas?** Você considerou outras formas de resolver o problema?

## Pull Requests (PRs)

Se você está pronto para contribuir com código, siga estes passos para garantir que seu PR seja aceito rapidamente.

### 1. Preparando o Ambiente

1.  **Faça um Fork** do repositório clicando no botão "Fork" no canto superior direito.
2.  **Clone o seu fork** para a sua máquina local:
    ```bash
    git clone [https://github.com/SEU-USUARIO/nome-do-repositorio.git](https://github.com/SEU-USUARIO/nome-do-repositorio.git)
    ```
3.  **Crie uma nova Branch** para suas alterações. Use um nome descritivo (em inglês, por convenção):
    ```bash
    git checkout -b feature/adiciona-secao-de-recursos
    ```
    ou para um bugfix:
    ```bash
    git checkout -b fix/corrige-bug-no-header
    ```

### 2. Fazendo as Alterações e Commits

1.  Faça as alterações desejadas no código.
2.  Siga nosso Guia de Estilo (veja abaixo).
3.  **Faça o commit** das suas alterações com uma mensagem clara e seguindo o padrão de *Conventional Commits*:

    * `feat:` para uma nova funcionalidade.
    * `fix:` para uma correção de bug.
    * `docs:` para alterações na documentação.
    * `style:` para formatação de código, sem alteração de lógica.
    * `refactor:` para refatoração de código.
    * `chore:` para tarefas de manutenção do repositório.

    **Exemplo de commit:** `feat: Adiciona ícones SVG ao lado dos títulos dos cargos`

### 3. Enviando o Pull Request

1.  **Envie sua branch** para o seu fork no GitHub:
    ```bash
    git push origin feature/adiciona-secao-de-recursos
    ```
2.  Vá para a página do repositório original no GitHub e você verá um botão para **"Compare & pull request"**.
3.  **Preencha o template do PR** com um título claro e uma descrição detalhada do que você fez e por quê.
4.  Aguarde a revisão. Faremos o nosso melhor para revisar seu PR o mais rápido possível.

## 🎨 Guia de Estilo de Código

Para manter a consistência em todo o projeto, por favor, siga estas regras:

* **HTML:** Escreva HTML5 semântico e válido. Garanta que todas as novas seções sigam os padrões de acessibilidade (A11y) estabelecidos no `index.html`.
* **CSS:** Siga a metodologia BEM (`bloco__elemento--modificador`) para novas classes. Use as variáveis CSS existentes em `:root` para cores, fontes e espaçamentos. Mantenha a abordagem *mobile-first*.
* **JavaScript:** Mantenha o código limpo, modular e bem comentado. Evite adicionar bibliotecas ou frameworks externos sem antes discutir em um "Issue".

Obrigado novamente por sua contribuição! Juntos, podemos construir um recurso incrível.
