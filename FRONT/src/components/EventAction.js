import Link from "next/link";


export default function EventAction(props) {
    return (
        <>
            <Link className="btn btn-secondary btn-sm fw-bold mx-1" href={`/admin/events/read/${ props.pid }`}>VISUALIZAR</Link>
            <Link className="btn btn-primary btn-sm fw-bold mx-1" href={`/admin/events/update/${ props.pid }`}>EDITAR</Link>
            <Link className="btn btn-danger btn-sm fw-bold mx-1" href={`/admin/events/delete/${ props.pid }`}>DELETAR</Link>
        </>
    )
}
