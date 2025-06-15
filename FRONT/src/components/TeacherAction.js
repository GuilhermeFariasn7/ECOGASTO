import Link from "next/link";


export default function TeacherAction(props) {
    return (
        <>
            <Link className="btn btn-secondary btn-sm fw-bold mx-1" href={`/admin/teachers/read/${ props.pid }`}>VISUALIZAR</Link>
            <Link className="btn btn-primary btn-sm fw-bold mx-1" href={`/admin/teachers/update/${ props.pid }`}>EDITAR</Link>
            <Link className="btn btn-danger btn-sm fw-bold mx-1" href={`/admin/teachers/delete/${ props.pid }`}>DELETAR</Link>
        </>
    )
}
