# APP

Desenvolvi este projeto com o objetivo de criar uma plataforma de e-commerce onde os usuários podem adicionar produtos ao carrinho, remover e finalizar compras de forma intuitiva, permitindo que os usuários visualizem detalhes dos produtos, ajustem quantidades e realizem pagamentos utilizando o Stripe.

O frontend foi construído utilizando React, Zustand e React Query, cada uma dessas tecnologias foi escolhida por apresentar diferentes qualificações. O React foi escolhido por apresentar a caracteristica de criar components reutilizaveis, facilitando a manutenção do código e deixando o processo de desenvolvimento mais rapido e eficaz. Zustand foi utilizado para o gerenciamento de estado global da aplicação devido a sua simplificade e eficiencia, permitindo o controle de informações como carrinho de compras e dados do usuário pelas diferentes paginas que necessitam dos dados. Já o React Query foi implementado para gerenciar chamadas de API, caching e a atualização de dados. O backend do projeto de e-commerce foi desenvolvido com Node.js, MongoDB e TypeScript, utilizando o framework Nest.js para a construção das APIs. O Node.js foi escolhido por permitir a criação de aplicações rápidas e escaláveis com JavaScript. O MongoDB foi adotado como banco de dados NoSQL, proporcionando flexibilidade na modelagem de dados como informações de produtos e usuários. O Nest.js foi utilizado para estruturar o código. A integração com o Stripe foi implementada para facilitar os pagamentos. O gerenciamento do banco de dados foi realizado pelo Prisma.

### Clonando o repositório

```sh
gh repo clone GuiOrlandin/e-commerce-with-stripe
```

### Navegue até os diretórios do projeto

```sh
cd api
```

```sh
cd web
```

## Back-end (API)

### Instale as dependências

```sh
npm i
```

### Inicie a aplicação no back-end

```sh
npm run start:dev
```

## Front-end (WEB)

### Instale as dependências

```sh
npm i
```

### Inicie a aplicação no front-end

```sh
npm run dev
```

### Rode os testes do front-end

```sh
npm run test
```
