
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
        <nav className=" navbar-light p-2" style={{ display: 'flex', gap: '10px', background:'#000000'}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent:'left',border:'1px solide red',width:'5%'}}>
                <img src="https://i.ibb.co/CJPQcsX/LOGOECOGASTO.png" alt="Logo" style={{ height: '45px', }} />
                
            </div>
            <div style={{display:'flex', width:'88%',alignItems:'center',justifyContent:'center'}}>
                <h6 style={{ color: "white", margin: 0,  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>INFORME SEUS DADOS PARA REALIZAR O CADASTRO</h6>
            </div>
            
        </nav>
    </>
    )
}
