# Diretrizes de Contribuição para o Guia de Carreiras Web

Primeiramente, obrigado pelo seu interesse em contribuir! 🎉

Este projeto é um esforço da comunidade para criar um recurso educacional de alta qualidade. A sua ajuda é essencial para mantê-lo preciso, atualizado e útil para todos.

Ao contribuir, você concorda em seguir nosso Código de Conduta.

## 🚀 Como Você Pode Contribuir

Existem várias maneiras de contribuir, e todas são valiosas:

* **🔎 Relatando Bugs:** Encontrou algo que não funciona como esperado?
* **💡 Sugerindo Melhorias:** Tem uma ideia para um novo recurso ou para melhorar o conteúdo?
* **✍️ Melhorando o Conteúdo:** Encontrou um erro de digitação, uma informação desatualizada ou uma frase que poderia ser mais clara em uma das páginas de detalhe?
* **➕ Adicionando um Novo Cargo:** Quer adicionar um cargo que ainda não foi documentado?

## 🐛 Guia para Relatar Bugs e Sugerir Melhorias (Issues)

Antes de criar um novo "Issue", por favor, verifique se já não existe um relatório semelhante. Ao criar um, seja o mais detalhado possível, explicando o problema ou a sua ideia.

## 💻 Guia para Contribuir com Conteúdo (Pull Requests)

Com a nova arquitetura multi-página (v3.0), o processo de contribuição de conteúdo ficou mais estruturado.

### 1. Preparando o Ambiente

1.  **Faça um Fork** do repositório.
2.  **Clone o seu fork** para a sua máquina local.
3.  **Crie uma nova Branch** para suas alterações com um nome descritivo (ex: `feat/documenta-cargo-ux-designer` ou `fix/corrige-typo-em-ai`).

### 2. Fazendo as Alterações

#### **Caso 1: Melhorando um Cargo Existente**

1.  Navegue até a pasta `roles/`.
2.  Encontre o arquivo `.html` correspondente ao cargo que você deseja editar (ex: `arquiteto-informacao.html`).
3.  Faça as alterações diretamente no arquivo.

#### **Caso 2: Adicionando um Novo Cargo**

1.  Navegue até a pasta `roles/`.
2.  **Copie um arquivo existente** (como `arquiteto-informacao.html`) para usar como um template. Isso garante que a estrutura de HTML, a barra lateral e os metadados sejam consistentes.
3.  **Renomeie** o novo arquivo para o cargo que você está adicionando (ex: `ux-designer.html`). Use letras minúsculas e hífens.
4.  **Edite o conteúdo** do novo arquivo:
    * Atualize o `<title>` e a `<meta name="description">` no `<head>`.
    * Atualize o JSON-LD (`<script type="application/ld+json">`).
    * Atualize o conteúdo principal do artigo: o `<h1>`, a introdução e todas as seções.
    * Atualize os links da barra lateral ("Nesta Página") para que correspondam aos `id`s das suas novas seções.
5.  Abra o arquivo `index.html` na raiz do projeto.
6.  **Adicione um novo "card"** no `<div class="grid-container">`, seguindo a estrutura dos cards existentes. Certifique-se de que o link `href` no card aponte para o novo arquivo que você criou na pasta `roles/` (ex: `href="roles/ux-designer.html"`).

### 3. Fazendo Commits e Enviando o Pull Request

1.  Após fazer suas alterações, **faça o commit** com uma mensagem clara seguindo o padrão de *Conventional Commits*:
    * `feat:` para uma nova funcionalidade (como adicionar um novo cargo).
    * `fix:` para uma correção de bug.
    * `docs:` para alterações na documentação ou no conteúdo de um cargo.
    * **Exemplo de commit:** `docs: Expande a seção de ferramentas do Arquiteto de Informação`
2.  **Envie sua branch** para o seu fork no GitHub (`git push`).
3.  Abra um **Pull Request** no repositório original, preenchendo o template com uma descrição clara do que foi feito.

## 🎨 Guia de Estilo de Código

* **HTML:** Escreva HTML5 semântico e válido. Mantenha a estrutura dos arquivos de template.
* **CSS:** Se precisar de novos estilos, discuta em um "Issue" primeiro. Tente ao máximo reutilizar as classes e variáveis CSS existentes.
* **JavaScript:** Não há necessidade de alterar o arquivo `script.js` para adicionar novo conteúdo. Se encontrar um bug, por favor, reporte em um "Issue".

Obrigado novamente por sua contribuição!
