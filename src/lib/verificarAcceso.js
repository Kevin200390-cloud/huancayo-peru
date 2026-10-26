import { goto } from '$app/navigation';

// La pantalla recibe solo los datos necesarios; la API externa se consulta en el servidor.
export async function verificarAcceso({ actualizar = false, navegar = goto } = {}) {
    try {
        const key = localStorage.getItem('key');
        if (key) {
            const response = await fetch('/api/auth', {
                method: actualizar ? 'POST' : 'GET',
                headers: { key },
                cache: 'no-store'
            });
            if (response.ok) {
                const { keyData } = await response.json();
                if (keyData?.autorizado) return keyData;
            }
        }
    } catch {
        // Una consulta fallida tampoco permite continuar.
    }
    await navegar('/');
    return null;
}
