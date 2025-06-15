import Link from "next/link";
import { useRouter } from 'next/router';

export default function MenuAdmin() {
    const router = useRouter();

    // Estilo base para os itens do menu
    const menuItemStyle = {
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
        padding: '10px 20px',
        borderRadius: '0',
        width: '100%',
        textAlign: 'center',
    };

    return (
        <div className="d-flex justify-content-center bg-secondary" style={{ gap: '0' }}>
            {/* HOME */}
            <div
                className="p-2"
                style={menuItemStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#67cf8d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => router.push('/home/')} // Corrigido
                title="Página inicial"
            >
                <strong>HOME</strong>
            </div>

            {/* EXTRATO */}
            <div
                className="p-2"
                style={menuItemStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#67cf8d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => router.push('/extrato/')} // Corrigido
                title="Visualizar Extrato de pagamentos"
            >
                <strong>EXTRATO</strong>
            </div>
            {/* EXTRATO */}
            <div
                className="p-2"
                style={menuItemStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#67cf8d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => router.push('/extrato/')} // Corrigido
                title="Visualizar Metas para traçar"
            >
                <strong>Metas</strong>
            </div>

        </div>
    );
}
