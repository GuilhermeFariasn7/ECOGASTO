import Link from "next/link";


export default function AppointmentAction(props) {
    return (
        <>
            <Link className="btn btn-secondary btn-sm fw-bold mx-1" href={`/admin/appointments/read/${ props.pid }`}>VISUALIZAR</Link>
            <Link className="btn btn-primary btn-sm fw-bold mx-1" href={`/admin/appointments/update/${ props.pid }`}>EDITAR</Link>
            <Link className="btn btn-danger btn-sm fw-bold mx-1" href={`/admin/appointments/delete/${ props.pid }`}>DELETAR</Link>
        </>
    )
}
