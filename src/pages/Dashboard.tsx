import {useEffect,useState} from 'react';
import {Package,ShoppingCart,Users,AlertTriangle,ArrowRight} from 'lucide-react';
import {Link} from 'react-router-dom';

import {api} from '../services/api';
export default function Dashboard(){const [d,setD]=useState({p:0,c:0,v:0,a:0}); 

const [err,setErr]=useState(''); useEffect(()=>{Promise.all([api.produtos(),api.clientes(),api.pedidos(),api.alertas()]).then(([p,c,v,a])=>setD({p:p.length,c:c.length,v:v.length,a:a.length})).catch
    (e=>setErr(e.message))},[]); 
    return <>
    <div className="pageHead">
        <div><h1>Dashboard</h1><p>Visão geral do sistema da farmácia.</p>
    </div></div>{err&&<div className="error">{err}</div>}<div className="stats"><Card icon={<Package/>} 
    title="Produtos" value={d.p} to="/produtos"/><Card icon={<Users/>} title="Clientes" value={d.c} to="/clientes"/><Card icon={<ShoppingCart/>} title="Pedidos" value={d.v} to="/pedidos"/><Card icon={<AlertTriangle/>} title="Em alerta" value={d.a} to="/alertas" danger/>
    </div><div className="welcome">
        <div><h2>Controle simples e organizado</h2><p>Gerencie estoque, cadastros e pedidos usando diretamente os recursos disponibilizados pela API.</p></div><ArrowRight/></div></>}
function Card({icon,title,value,to,danger}
    :{icon:React.ReactNode;title:string;value:number;to:string;danger?:boolean})
    {return <Link className={`stat ${danger?'danger':''}`} to={to}>{<div className="statIcon">{icon}
    </div>}<div><span>{title}</span><b>{value}</b></div><ArrowRight className="arrow"/></Link>}
