# 🛍️ Serviço de Usuários - Vendrix E-commerce

Este é o microsserviço de autenticação e gerenciamento de usuários para a plataforma de e-commerce **Vendrix**. Ele é responsável pelo registro, login (com JWT) e consulta de perfis de usuário.

Este serviço faz parte de um projeto de portfólio de arquitetura de microsserviços.

## ✨ Features

- **Autenticação JWT:** Geração de token seguro no login.
- **Registro de Usuário:** Criação de novos usuários com senha criptografada.
- **Segurança:** Senhas com hash (bcrypt) e Rate Limiting contra ataques de força bruta.
- **Consulta de Perfil:** Endpoint protegido para buscar dados do usuário logado.

## 🚀 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB** (com Mongoose)
- **JSON Web Tokens (JWT)**
- **Bcrypt**
- **Jest** & **Supertest** (para testes)

---

## 🏁 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20+ recomendado)
- [MongoDB](https://www.mongodb.com/try/download/community) (ou uma conta no MongoDB Atlas)

### 1. Instalação

Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/PedroArthur06/vendrix-users-service.git](https://github.com/PedroArthur06/vendrix-users-service.git)
cd vendrix-users-service
npm install
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto. Use o `.env.example` como base:

```.env
MONGODB_URI="sua_string_de_conexao_do_mongodb"
PORT=3000
JWT_EXPIRES_IN=7d
JWT_SECRET="sua_chave_secreta_para_jwt_bem_longa_e_segura"
```

### 3. Rodando a Aplicação

**Modo de Desenvolvimento (com hot-reload):**

```bash
npm run dev
```

**Modo de Produção (requer build):**

```bash
# 1. Compilar o TypeScript
npm run build

# 2. Iniciar o servidor
npm run start
```

### 4. Rodando os Testes

Este projeto possui uma suíte de testes completa com 100% de cobertura de lógica.

```bash
# Rodar todos os testes
npm test

# Ver cobertura de testes
npm run test:coverage
```

---

## 🐳 Rodando com Docker

Você também pode construir e rodar a imagem Docker:

```bash
# 1. Construir a imagem
docker build -t vendrix-users-service .

# 2. Rodar o container
# (Não se esqueça de passar as variáveis de ambiente!)
docker run \
  -e MONGODB_URI="sua_string_de_conexao_do_mongodb" \
  -e JWT_SECRET="sua_chave_secreta_para_jwt_bem_longa_e_segura" \
  -e PORT=3000 \
  -p 3000:3000 \
  -d vendrix-users-service
```

---

## 📍 API Endpoints

### Health Check

- `GET /health`
  - Verifica se o serviço está no ar.
  - **Resposta (200):** `{ "status": "ok" }`

### Autenticação

- `POST /register`

  - Registra um novo usuário.
  - **Body (raw/json):**
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "profile": {
        "name": "Pedro",
        "lastName": "Arthur"
      }
    }
    ```
  - **Resposta (201):** `{ "token": "...", "user": { ... } }`

- `POST /login`
  - Autentica um usuário e retorna um JWT.
  - **Body (raw/json):**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Resposta (200):** `{ "token": "...", "user": { ... } }`

### Usuário (Protegido)

- `GET /profile`
  - Retorna o perfil do usuário autenticado.
  - **Header (Autorização):** `Bearer <seu_token_jwt>`
  - **Resposta (200):** `{ "id": "...", "email": "...", "profile": { ... } }`
