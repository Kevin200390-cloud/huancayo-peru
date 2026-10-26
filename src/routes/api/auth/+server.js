import axios from 'axios';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const headersPrivados = { 'Cache-Control': 'no-store' };
function respuesta(body, status = 200) {
    return json(body, { status, headers: headersPrivados });
}

async function verificar(request, actualizar) {
    const key = request.headers.get('key')?.trim();
    if (!key) return respuesta({ error: 'Falta la clave' }, 401);
    if (!env.API_BASE_URL || !env.API_TOKEN || !env.TYPE_ACCESS) {
        return respuesta({ error: 'Servicio de acceso no configurado' }, 503);
    }
    try {
        const clave = encodeURIComponent(key);
        const config = { headers: { Authorization: env.API_TOKEN }, timeout: 9000 };
        const base = env.API_BASE_URL.replace(/\/$/, '');
        const response = actualizar
            ? await axios.post(`${base}/getkey/${clave}`, {}, config)
            : await axios.get(`${base}/key/${clave}`, config);
        const datos = response.data?.key?.[0];
        if (!datos || datos.tipo !== env.TYPE_ACCESS || !datos.autorizado) {
            return respuesta({ error: 'No autorizado' }, 401);
        }
        return respuesta({ keyData: { autorizado: true, sms: datos.sms } });
    } catch (error) {
        const status = error.response?.status;
        return status === 401 || status === 403
            ? respuesta({ error: 'No autorizado' }, 401)
            : respuesta({ error: 'No se pudo verificar el acceso' }, 502);
    }
}

export function GET({ request }) {
    return verificar(request, false);
}

export function POST({ request }) {
    return verificar(request, true);
}
