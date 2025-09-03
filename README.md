# Guia Definitivo de Carreiras Web

![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/tech-HTML%2FCSS%2FJS-orange?style=for-the-badge)

Um portal de documentação aprofundada sobre os 11 principais cargos no desenvolvimento de sites modernos, construído com a sinergia de todas essas especialidades.

---

### ➤ [Acesse a versão ao vivo do site aqui](https://<seu-usuario>.github.io/<nome-do-repositorio>/)

*(Nota: Substitua `<seu-usuario>` e `<nome-do-repositorio>` pelos seus dados do GitHub após o deploy.)*

---

## 🎯 Sobre o Projeto (v3.0)

Este projeto foi criado como um recurso educacional para desenvolvedores e estudantes de tecnologia. Na sua versão 3.0, ele foi refatorado para uma **arquitetura multi-página** para melhorar a escalabilidade, a otimização de SEO e a experiência do usuário.

A página principal (`index.html`) agora funciona como um portal (hub), apresentando um resumo de cada um dos 11 papéis fundamentais e direcionando os usuários para páginas de detalhes dedicadas. Cada página de detalhe é um mergulho profundo nas responsabilidades, habilidades e ferramentas de um cargo específico.

O próprio site continua a ser uma meta-demonstração: foi construído aplicando os princípios de cada uma das áreas que ele documenta.

## 🛠️ Tecnologias Utilizadas

Este projeto é construído com as tecnologias fundamentais da web, sem frameworks ou bibliotecas externas, para focar nos conceitos essenciais.

* **HTML5:** Utilização de tags semânticas para estrutura e acessibilidade.
* **CSS3:** Design moderno e responsivo com Grid, Flexbox, Variáveis CSS e uma abordagem *mobile-first*.
* **JavaScript (ES6+):** Código modular e condicional para interatividade global e específica da página.

## 📁 Estrutura do Projeto

A arquitetura foi atualizada para suportar múltiplas páginas de conteúdo de forma organizada.

```

/
├── roles/                  \# Diretório para as páginas de detalhe de cada cargo
│   └── 📄 arquiteto-informacao.html
│   └── ... (outras páginas de cargos)
│
├── 📄 index.html           \# A página principal (hub/portal).
├── 🎨 style.css            \# UMA folha de estilos GLOBAL para todo o site.
├── ✨ script.js            \# UM script GLOBAL com lógica condicional para cada tipo de página.
├── 📖 README.md            \# (Este arquivo) A documentação geral do projeto.
└── 🤝 CONTRIBUTING.md      \# Diretrizes para quem deseja contribuir.

````

## 🚀 Como Executar

Este site foi projetado para ser hospedado gratuitamente no **GitHub Pages**.

### Visualização Online (Implantação)

1.  Faça o upload de todos os arquivos e da pasta `roles/` para o seu repositório no GitHub.
2.  No seu repositório, vá para `Settings` > `Pages`.
3.  Na seção `Branch`, selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
4.  Clique em `Save`. O GitHub irá gerar a URL do seu site.

### Desenvolvimento Local

Para visualizar ou modificar o site localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/](https://github.com/)<seu-usuario>/<nome-do-repositorio>.git
    ```
2.  **Navegue até a pasta:**
    ```bash
    cd <nome-do-repositorio>
    ```
3.  **Abra o arquivo `index.html`** diretamente no seu navegador para ver a página principal. Navegue para as páginas de detalhe clicando nos cards.

    * **Dica de Profissional:** Para uma melhor experiência de desenvolvimento com recarregamento automático (live reload), recomendamos usar a extensão **Live Server** no Visual Studio Code.

## 🤝 Como Contribuir

A forma mais comum de contribuição para este projeto é adicionar ou atualizar o conteúdo de um cargo. Com a nova arquitetura, o processo é o seguinte:

1.  **Para adicionar um novo cargo:**
    * Copie um arquivo existente de `roles/`, como `arquiteto-informacao.html`, para usar como template.
    * Renomeie o novo arquivo (ex: `ux-designer.html`).
    * Edite o conteúdo dentro do novo arquivo (título, texto, etc.).
    * Vá até o `index.html` e adicione um novo "card" para o seu cargo, apontando para o arquivo que você criou.

2.  **Para corrigir ou melhorar um cargo existente:**
    * Encontre o arquivo correspondente na pasta `roles/` e edite o conteúdo diretamente.

Para diretrizes mais detalhadas sobre mensagens de commit, estilo de código e processo de Pull Request, por favor, leia nosso **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## 📄 Licença

Distribuído sob a Licença MIT.

---
*Este projeto é um tributo ao trabalho colaborativo que constrói a web.*
