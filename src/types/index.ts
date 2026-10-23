export interface ClienteDTO { idCliente?: number; nome: string; cpf: string; }
export interface ProdutoDTO { idProduto?: number; descricao: string; validade?: string|null; preco: number; qtdEstoque: number; qtdMinEstoque: number; emAlerta?: boolean; }
export interface Pedido { idVenda: number; idCliente: number; dataVenda: string; nomeCliente?: string; }
export interface ItemPedido { idProduto:number; descricao:string; qtdProduto:number; precoUnit:number; }
export interface PedidoDetalhe { pedido: Pedido; itens: ItemPedido[]; }
export interface NovoPedido { idCliente:number; itens:{idProduto:number;qtdProduto:number;precoUnit:number}[]; }
