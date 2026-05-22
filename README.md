# AlfaFeed

Frontend da rede social **AlfaInsta**, desenvolvido em React + Vite. Consome a API REST e WebSocket do backend AlfaInsta, oferecendo uma experiência completa de rede social com feed, chat em tempo real, perfis e notificações.

> 📌 Este é o **frontend** do projeto. O backend está disponível em [AlfaInsta Backend](https://github.com/seu-usuario/alfainsta-backend).

## 🚀 Funcionalidades

- 🔐 **Autenticação** — Login, registro e recuperação de senha
- 🌐 **Login Social** — Login com conta Google
- 📰 **Feed** — Posts de quem você segue + aba Explore
- 📝 **Posts** — Criar, curtir, comentar e repostar
- 👤 **Perfil** — Visualizar e editar perfil, foto e capa
- 👥 **Follow** — Seguir/deixar de seguir usuários
- 💬 **Chat em tempo real** — Mensagens via WebSocket
- 🔔 **Notificações** — Likes, comentários, follows
- 🖼️ **Upload de imagens** — Foto de perfil, capa e posts

## 🛠️ Tecnologias

- **React 18**
- **Vite** — Build tool e dev server
- **Tailwind CSS** — Estilização
- **JavaScript (ES6+)**
- **ESLint** — Padronização de código

## 📋 Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- Backend **AlfaInsta** rodando em `http://localhost:8080`

## ⚙️ Como Rodar

### 1. Clone o repositório

```bash
git clone https://github.com/Vitorgabriel5/AlfaFeed.git
cd AlfaFeed
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=seu-google-client-id
```

> ⚠️ **Importante:** Variáveis em Vite **precisam** começar com `VITE_` para serem expostas ao frontend.

### 4. Rode o projeto em modo desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### 5. Build para produção

```bash
npm run build
```

Os arquivos otimizados ficarão na pasta `dist/`.

### 6. Preview do build de produção

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
AlfaFeed/
├── public/              # Assets estáticos
├── src/
│   ├── assets/          # Imagens e ícones
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── services/        # Chamadas à API
│   ├── App.jsx          # Componente raiz
│   └── main.jsx         # Entry point
├── index.html           # HTML principal
├── tailwind.config.js   # Configuração do Tailwind
├── vite.config.js       # Configuração do Vite
└── package.json
```

## 🔗 Integração com Backend

Este frontend consome a API do backend **AlfaInsta**, que oferece:

- API REST em `http://localhost:8080/api/**`
- WebSocket em `http://localhost:8080/ws` (STOMP + SockJS)
- Autenticação via JWT (Bearer Token no header `Authorization`)

Certifique-se de que o backend esteja rodando antes de iniciar o frontend.

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa o ESLint |

## 👥 Autores

Projeto desenvolvido por:

- **Vitor Gabriel**
- **João Pedro**
- **Pedro**

---

📌 Projeto desenvolvido para fins acadêmicos.
