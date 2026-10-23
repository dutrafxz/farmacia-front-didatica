# Farmácia — Frontend

Frontend React + TypeScript desenvolvido para consumir a API do projeto `farmacia-backend-didatica`.

## Requisitos
- Node.js 18+
- Backend da farmácia rodando em `http://localhost:3333`

## Instalação
```bash
npm install
npm run dev
```

Acesse o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## API
Por padrão o Front utiliza `http://localhost:3333`. Para alterar, crie `.env` a partir de `.env.example`:
```env
VITE_API_URL=http://localhost:3333
```

## Funcionalidades
- Dashboard com indicadores
- Listagem e busca de produtos
- Cadastro e edição de produtos
- Alerta automático de estoque
- Listagem e cadastro de clientes
- Listagem e criação de pedidos
- Visualização dos itens do pedido
- Remoção de itens do pedido
- Navegação entre módulos

## Observação sobre o Backend
A API fornecida não possui `DELETE /produtos/:id` nem endpoint para editar/excluir o cabeçalho de um pedido. Por isso o Front implementa somente operações realmente disponíveis na API, sem simular endpoints inexistentes.

## Commits sugeridos
```text
feat: cria estrutura inicial do frontend
feat: configura integração com API
feat: implementa dashboard
feat: implementa gerenciamento de produtos
feat: implementa alerta de estoque
feat: implementa clientes
feat: implementa pedidos e itens
style: melhora layout e responsividade
docs: atualiza README
```
