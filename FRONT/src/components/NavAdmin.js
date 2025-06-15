import Link from "next/link";
import Head from 'next/head';

export default function NavAdmin() {
    return (
    <>
        <Head>
            <link
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
              rel="stylesheet"
            />
            <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            rel="stylesheet"
            />
        </Head>
        <nav className="navbar navbar-light p-2 bg-dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://i.ibb.co/CJPQcsX/LOGOECOGASTO.png" alt="Logo" style={{ height: '45px', marginRight: '10px' }} />
                <h5 style={{ color: "white", margin: 0,  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>Gestão de gastos</h5>
            </div>
            
            <div>
            <Link className="d-flex align-items-center fw-bold" style={{ gap: '4px', marginRight: '20px', color: 'white', textDecoration: 'none' }} href="/"><span>Sair</span><i className="fas fa-sign-out-alt"></i></Link>
            </div>
        </nav>
    </>
    )
}
