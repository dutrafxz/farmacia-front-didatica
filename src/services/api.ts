
import type {
    ClienteDTO,
    ProdutoDTO,
    Pedido,
    PedidoDetalhe,
    ItemPedido,
    NovoPedido,
} from '../types';

declare global {
    interface ImportMeta {
        readonly env: Record<string, string | undefined>;
    }
}

const BASE = import.meta.env.VITE_API_URL;

if (!BASE) {
    throw new Error('VITE_API_URL não foi configurada.');
}

async function request<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const r = await fetch(`${BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        },
        ...options,
    });

    const data = await r.json().catch(() => null);

    if (!r.ok) {
        throw new Error(
            data?.mensagem ||
            data?.erro ||
            `Erro HTTP ${r.status}`
        );
    }

    return data as T;
}

export const api = {
    // Clientes
    clientes: () =>
        request<ClienteDTO[]>('/clientes'),

    criarCliente: (d: ClienteDTO) =>
        request('/clientes', {
            method: 'POST',
            body: JSON.stringify(d),
        }),

    // Produtos
    produtos: () =>
        request<ProdutoDTO[]>('/produtos'),

    alertas: () =>
        request<ProdutoDTO[]>('/produtos/alerta'),

    criarProduto: (d: ProdutoDTO) =>
        request('/produtos', {
            method: 'POST',
            body: JSON.stringify(d),
        }),

    atualizarProduto: (
        id: number,
        d: Partial<ProdutoDTO>
    ) =>
        request(`/produtos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(d),
        }),

    // Pedidos
    pedidos: () =>
        request<Pedido[]>('/pedidos'),

    pedido: (id: number) =>
        request<PedidoDetalhe>(`/pedidos/${id}`),

    criarPedido: (d: NovoPedido) =>
        request('/pedidos', {
            method: 'POST',
            body: JSON.stringify(d),
        }),

    // Itens do pedido
    itens: (id: number) =>
        request<ItemPedido[]>(`/pedidos/${id}/itens`),

    adicionarItem: (
        id: number,
        d: {
            idProduto: number;
            qtdProduto: number;
            precoUnit: number;
        }
    ) =>
        request(`/pedidos/${id}/itens`, {
            method: 'POST',
            body: JSON.stringify(d),
        }),

    atualizarItem: (
        v: number,
        p: number,
        d: Partial<{
            qtdProduto: number;
            precoUnit: number;
        }>
    ) =>
        request(`/itens/${v}/${p}`, {
            method: 'PUT',
            body: JSON.stringify(d),
        }),

    removerItem: (
        v: number,
        p: number
    ) =>
        request(`/itens/${v}/${p}`, {
            method: 'DELETE',
        }),
};
