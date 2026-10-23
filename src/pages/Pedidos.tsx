import { useEffect, useState } from 'react';
import { Plus, Eye, Trash2, ChevronLeft } from 'lucide-react';
import { api } from '../services/api';
import type {
  ClienteDTO,
  ProdutoDTO,
  Pedido,
  PedidoDetalhe
} from '../types';

export default function Pedidos() {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [clients, setClients] = useState<ClienteDTO[]>([]);
  const [products, setProducts] = useState<ProdutoDTO[]>([]);
  const [detail, setDetail] = useState<PedidoDetalhe | null>(null);
  const [open, setOpen] = useState(false);
  const [cliente, setCliente] = useState(0);
  const [pid, setPid] = useState(0);
  const [qtd, setQtd] = useState(1);
  const [msg, setMsg] = useState('');

  const load = () =>
    api.pedidos().then((x) =>
      setOrders(
        [...x].sort((a, b) =>
          (a.nomeCliente || '').localeCompare(b.nomeCliente || '')
        )
      )
    );

  useEffect(() => {
    load();
    api.clientes().then(setClients);
    api.produtos().then(setProducts);
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();

    const p = products.find((x) => x.idProduto === pid);

    if (!p) return;

    try {
      await api.criarPedido({
        idCliente: cliente,
        itens: [
          {
            idProduto: pid,
            qtdProduto: qtd,
            precoUnit: Number(p.preco)
          }
        ]
      });

      setMsg('Pedido criado com sucesso!');
      setOpen(false);

      setCliente(0);
      setPid(0);
      setQtd(1);

      load();
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  async function openDetail(id: number) {
    setDetail(await api.pedido(id));
  }

  async function removeItem(v: number, p: number) {
    if (confirm('Remover este item do pedido?')) {
      await api.removerItem(v, p);
      openDetail(v);
    }
  }

  return (
    <>
      {detail ? (
        <>
          <button
            className="back"
            onClick={() => setDetail(null)}
          >
            <ChevronLeft />
            Voltar aos pedidos
          </button>

          <div className="pageHead">
            <div>
              <h1>Pedido #{detail.pedido.idVenda}</h1>

              <p>
                Cliente:{' '}
                <b>
                  {detail.pedido.nomeCliente ||
                    detail.pedido.idCliente}
                </b>{' '}
                ·{' '}
                {new Date(
                  detail.pedido.dataVenda
                ).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço unitário</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {detail.itens.map((i) => (
                  <tr key={i.idProduto}>
                    <td>
                      <b>{i.descricao}</b>
                    </td>

                    <td>{i.qtdProduto}</td>

                    <td>
                      R${' '}
                      {Number(i.precoUnit)
                        .toFixed(2)
                        .replace('.', ',')}
                    </td>

                    <td>
                      R${' '}
                      {(i.qtdProduto * i.precoUnit)
                        .toFixed(2)
                        .replace('.', ',')}
                    </td>

                    <td>
                      <button
                        className="iconBtn dangerBtn"
                        onClick={() =>
                          removeItem(
                            detail.pedido.idVenda,
                            i.idProduto
                          )
                        }
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="pageHead">
            <div>
              <h1>Pedidos</h1>
              <p>
                Pedidos ordenados pelo nome do cliente.
              </p>
            </div>

            <button
              className="primary"
              onClick={() => setOpen(true)}
            >
              <Plus />
              Novo pedido
            </button>
          </div>

          {msg && <div className="success">{msg}</div>}

          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.idVenda}>
                    <td>
                      <b>#{o.idVenda}</b>
                    </td>

                    <td>
                      {o.nomeCliente ||
                        `Cliente #${o.idCliente}`}
                    </td>

                    <td>
                      {new Date(
                        o.dataVenda
                      ).toLocaleDateString('pt-BR')}
                    </td>

                    <td>
                      <button
                        className="iconBtn"
                        onClick={() =>
                          openDetail(o.idVenda)
                        }
                      >
                        <Eye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {open && (
            <div className="modal">
              <form
                className="modalBox"
                onSubmit={create}
              >
                <div className="modalHead">
                  <h2>Novo pedido</h2>

                  <button
                    type="button"
                    className="close"
                    onClick={() => setOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <label>
                  Cliente

                  <select
                    required
                    value={cliente}
                    onChange={(e) =>
                      setCliente(
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value={0}>
                      Selecione
                    </option>

                    {clients.map((c) => (
                      <option
                        value={c.idCliente}
                        key={c.idCliente}
                      >
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Produto

                  <select
                    required
                    value={pid}
                    onChange={(e) =>
                      setPid(
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value={0}>
                      Selecione
                    </option>

                    {products.map((p) => (
                      <option
                        value={p.idProduto}
                        key={p.idProduto}
                      >
                        {p.descricao} — R${' '}
                        {Number(p.preco).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Quantidade

                  <input
                    required
                    type="number"
                    min="1"
                    value={qtd}
                    onChange={(e) =>
                      setQtd(
                        Number(e.target.value)
                      )
                    }
                  />
                </label>

                <div className="modalActions">
                  <button
                    type="button"
                    className="ghost"
                    onClick={() =>
                      setOpen(false)
                    }
                  >
                    Cancelar
                  </button>

                  <button className="primary">
                    Criar pedido
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </>
  );
}