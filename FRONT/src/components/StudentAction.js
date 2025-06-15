import Link from "next/link";


export default function StudentAction(props) {
    return (
        <>
            <Link className="btn btn-secondary btn-sm fw-bold mx-1" href={`/admin/students/read/${ props.pid }`}>VISUALIZAR</Link>
            <Link className="btn btn-primary btn-sm fw-bold mx-1" href={`/admin/students/update/${ props.pid }`}>EDITAR</Link>
            <Link className="btn btn-danger btn-sm fw-bold mx-1" href={`/admin/students/delete/${ props.pid }`}>DELETAR</Link>
        </>
    )
}
