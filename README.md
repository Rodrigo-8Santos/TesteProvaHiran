<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# CRUD de Usuários com Supabase

Este projeto implementa um sistema completo de CRUD (Create, Read, Update, Delete) de usuários utilizando React no frontend e Supabase como backend. O sistema permite registro, login, atualização de perfil, visualização de usuários e exclusão da própria conta.

## Funcionalidades

- **Autenticação completa**:
  - Registro de novos usuários (sem necessidade de confirmação por email)
  - Login de usuários existentes
  - Proteção de rotas para usuários autenticados

- **Gerenciamento de perfil**:
  - Visualização de dados do próprio perfil
  - Atualização de informações pessoais
  - Exclusão da própria conta

- **Visualização de usuários**:
  - Lista de todos os usuários cadastrados
  - Visualização de informações básicas de outros usuários

## Tecnologias Utilizadas

### Frontend
- React
- React Router
- Chakra UI
- Formik e Yup para validação de formulários
- Context API para gerenciamento de estado

### Backend
- Supabase para autenticação e banco de dados
- PostgreSQL como banco de dados relacional
- Políticas de segurança (Row Level Security)

## Estrutura do Projeto

```
projeto-crud/
├── public/              # Arquivos públicos
├── src/                 # Código fonte
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Footer/      # Componente de rodapé
│   │   ├── Header/      # Componente de cabeçalho
│   │   ├── UserCard/    # Card para exibição de usuários
│   │   └── UserForm/    # Formulário de usuário reutilizável
│   ├── contexts/        # Contextos React
│   │   └── AuthContext.js # Contexto de autenticação
│   ├── pages/           # Páginas da aplicação
│   │   ├── Home/        # Página inicial
│   │   ├── Login/       # Página de login
│   │   ├── Profile/     # Página de perfil do usuário
│   │   ├── Register/    # Página de registro
│   │   └── UserList/    # Página de listagem de usuários
│   ├── services/        # Serviços de API
│   │   ├── auth.js      # Serviço de autenticação
│   │   ├── supabase.js  # Configuração do Supabase
│   │   └── users.js     # Serviço de usuários
│   ├── App.js           # Componente principal
│   └── index.js         # Ponto de entrada
└── supabase_setup.sql   # Script SQL para configuração do Supabase
```

## Configuração e Execução

### Pré-requisitos
- Node.js (v14 ou superior)
- NPM ou Yarn
- Conta no Supabase

### Configuração do Supabase
1. Crie uma conta no [Supabase](https://supabase.io/)
2. Crie um novo projeto
3. Execute o script `supabase_setup.sql` no Editor SQL do Supabase
4. Copie a URL e a chave anônima do projeto

### Configuração do Projeto
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   REACT_APP_SUPABASE_URL=sua_url_do_supabase
   REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

## Fluxo de Uso

1. **Registro**: Usuários podem se registrar fornecendo nome, email, senha, idade e descrição
2. **Login**: Usuários registrados podem fazer login com email e senha
3. **Perfil**: Usuários autenticados podem visualizar e editar seu perfil
4. **Listagem**: Usuários autenticados podem ver a lista de todos os usuários cadastrados
5. **Exclusão**: Usuários podem excluir sua própria conta

## Segurança

- Autenticação gerenciada pelo Supabase
- Senhas armazenadas com hash seguro
- As políticas de Row Level Security garantem que usuários só possam modificar seus próprios dados
- Tokens JWT são utilizados para autenticação
- Validação de dados é realizada tanto no frontend quanto no backend

## Melhorias Futuras

- Implementação de testes automatizados
- Implementação de upload de foto de perfil
- Adição de funcionalidade de recuperação de senha
- Implementação de paginação na listagem de usuários
- Adição de perfis de administrador com permissões especiais

## Notas Importantes

- O sistema foi configurado para aceitar qualquer email sem necessidade de confirmação
- O login funciona imediatamente após o registro
- A exclusão de conta é permanente e não pode ser desfeita
>>>>>>> 26f5f1c0 (first commit)
