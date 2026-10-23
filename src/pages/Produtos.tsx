
import { useEffect, useState } from 'react';
import {
    Search,
    Plus,
    Edit3,
    AlertTriangle,
    RefreshCw,
} from 'lucide-react';

import { api } from '../services/api';
import type { ProdutoDTO } from '../types';

const empty = {
    descricao: '',
    validade: '',
    preco: 0,
    qtdEstoque: 0,
    qtdMinEstoque: 0,
};

export default function Produtos() {
    const [items, setItems] = useState<ProdutoDTO[]>([]);
    const [q, setQ] = useState('');
    const [form, setForm] = useState<ProdutoDTO>(empty);
    const [edit, setEdit] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);

        api.produtos()
            .then(setItems)
            .catch((e) => setErr(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const filtered = items.filter((x) =>
        x.descricao.toLowerCase().includes(q.toLowerCase())
    );

    async function save(e: React.FormEvent) {
        e.preventDefault();

        try {
            if (edit) {
                await api.atualizarProduto(edit, form);
            } else {
                await api.criarProduto(form);
            }

            setMsg(
                edit
                    ? 'Produto atualizado!'
                    : 'Produto cadastrado!'
            );

            setOpen(false);
            setEdit(null);
            setForm(empty);

            load();
        } catch (e: any) {
            setErr(e.message);
        }
    }

    function start(p: ProdutoDTO) {
        setEdit(p.idProduto!);

        setForm({
            ...p,
            validade: p.validade?.slice(0, 10) || '',
        });

        setOpen(true);
    }

    return (
        <>
            <div className="pageHead">
                <div>
                    <h1>Produtos</h1>
                    <p>
                        Cadastre, consulte e atualize o estoque.
                    </p>
                </div>

                <button
                    className="primary"
                    onClick={() => {
                        setEdit(null);
                        setForm(empty);
                        setOpen(true);
                    }}
                >
                    <Plus /> Novo produto
                </button>
            </div>

            {msg && <div className="success">{msg}</div>}

            {err && <div className="error">{err}</div>}

            <div className="toolbar">
                <div className="search">
                    <Search />

                    <input
                        placeholder="Buscar por descrição..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>

                <button className="ghost" onClick={load}>
                    <RefreshCw /> Atualizar
                </button>
            </div>

            <div className="tableWrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Validade</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>Mínimo</th>
                            <th>Status</th>
                            <th>Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="empty">
                                    Carregando...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="empty">
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p) => (
                                <tr key={p.idProduto}>
                                    <td>#{p.idProduto}</td>

                                    <td>
                                        <b>{p.descricao}</b>
                                    </td>

                                    <td>
                                        {p.validade
                                            ? new Date(
                                                  p.validade
                                              ).toLocaleDateString('pt-BR')
                                            : '—'}
                                    </td>

                                    <td>
                                        R${' '}
                                        {Number(p.preco)
                                            .toFixed(2)
                                            .replace('.', ',')}
                                    </td>

                                    <td>{p.qtdEstoque}</td>

                                    <td>{p.qtdMinEstoque}</td>

                                    <td>
                                        {p.emAlerta ? (
                                            <span className="badge warn">
                                                <AlertTriangle /> Alerta
                                            </span>
                                        ) : (
                                            <span className="badge ok">
                                                Normal
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        <button
                                            className="iconBtn"
                                            onClick={() => start(p)}
                                            title="Editar"
                                        >
                                            <Edit3 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {open && (
                <div className="modal">
                    <form
                        onSubmit={save}
                        className="modalBox"
                    >
                        <div className="modalHead">
                            <div>
                                <h2>
                                    {edit
                                        ? 'Editar produto'
                                        : 'Novo produto'}
                                </h2>

                                <p>
                                    Preencha os dados do estoque.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="close"
                                onClick={() => setOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <label>
                            Descrição

                            <input
                                required
                                value={form.descricao}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        descricao: e.target.value,
                                    })
                                }
                            />
                        </label>

                        <div className="grid2">
                            <label>
                                Preço

                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={form.preco}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            preco: Number(e.target.value),
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Validade

                                <input
                                    type="date"
                                    value={form.validade || ''}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            validade: e.target.value,
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Estoque atual

                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={form.qtdEstoque}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            qtdEstoque: Number(e.target.value),
                                        })
                                    }
                                />
                            </label>

                            <label>
                                Estoque mínimo

                                <input
                                    required
                                    type="number"
                                    min="0"
                                    value={form.qtdMinEstoque}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            qtdMinEstoque: Number(e.target.value),
                                        })
                                    }
                                />
                            </label>
                        </div>

                        <div className="modalActions">
                            <button
                                type="button"
                                className="ghost"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </button>

                            <button className="primary">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
