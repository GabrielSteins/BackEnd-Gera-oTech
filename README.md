API de Gestão de Usuários, Categorias e Produtos
API RESTful construída com Node.js, Express e Sequelize para gerenciar usuários, categorias e produtos, com autenticação via JWT.

Funcionalidades:
CRUD de usuários com hash de senha usando bcrypt

CRUD de categorias

CRUD de produtos com imagens, opções e categorias associadas

Autenticação via token JWT

Validação e paginação em endpoints de listagem

Tecnologias
Node.js

Express

Sequelize ORM

SQLite (banco local para desenvolvimento)

bcrypt (hash de senhas)

jsonwebtoken (JWT para autenticação)

Configuração:
Clone o repositório

Rode npm install para instalar as dependências


Inicie a API com npm start

Endpoints principais:
GET /v1/user/:id — Buscar usuário por ID

POST /v1/user — Criar usuário

PUT /v1/user/:id — Atualizar usuário

DELETE /v1/user/:id — Deletar usuário

POST /v1/user/token — Gerar token JWT (login)

GET /v1/category/search — Listar categorias (com filtros e paginação)

GET /v1/category/:id — Buscar categoria por ID

POST /v1/category — Criar categoria

PUT /v1/category/:id — Atualizar categoria

DELETE /v1/category/:id — Deletar categoria

GET /v1/product/search — Listar produtos (com filtros, paginação e inclusão de imagens/opções)

GET /v1/product/:id — Buscar produto por ID

POST /v1/product — Criar produto

PUT /v1/product/:id — Atualizar produto

DELETE /v1/product/:id — Deletar produto

Autenticação:
Endpoints POST, PUT e DELETE exigem cabeçalho Authorization: Bearer <token_jwt>

Token obtido via login em /v1/user/token

Testes:
Scripts para criação de dados estão disponíveis em src/scripts/
