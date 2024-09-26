# APP

Desenvolvi este projeto com o objetivo de criar uma plataforma de e-commerce onde os usuários podem adicionar produtos ao carrinho, remover e finalizar compras, ajustem quantidades, realizem pagamentos e após o pagamento o produto é debitado e em caso de não haver estoque o produto é retirado da pagina de produtos. O frontend foi construído utilizando React, Zustand e React Query, cada uma escolhida por suas qualidades específicas. O React, por exemplo, permite a criação de componentes reutilizáveis, facilitando a manutenção e acelerando o desenvolvimento. Para o gerenciamento de estado global devido à sua simplicidade e eficiência, foi utilizado o Zustand, permitindo o controle de informações como o carrinho de compras e dados do usuário entre diferentes páginas.  Para o gerenciamento de chamadas de API, caching e atualização de dados foi utilizado o React Query.

O backend foi desenvolvido com Node.js, MongoDB e TypeScript, utilizando o framework Nest.js para a construção das APIs. O Node.js foi escolhido pela sua capacidade de criar aplicações rápidas e escaláveis com JavaScript, enquanto o MongoDB, como banco de dados NoSQL, oferece flexibilidade na modelagem de dados, como informações de produtos e usuários. O Prisma foi utilizado para o gerenciamento do banco de dados.

O foco principal deste projeto foi integrar o Stripe como método de pagamento, aprimorando minhas habilidades em integração com APIs de pagamento. Com essa integração, pude aprimorar meus conhecimentos em pagamentos online, automação de cobranças e manipulação segura de dados financeiros.

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
