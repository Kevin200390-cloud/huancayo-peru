import axios from 'axios';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const respuesta = (success, mensaje, status = 200) => json(
    { success, mensaje }, { status, headers: { 'Cache-Control': 'no-store' } }
);

export async function POST({ request }) {
    let body;
    try { body = await request.json(); }
    catch { return respuesta(false, 'Solicitud invalida', 400); }
    const key = typeof body?.key === 'string' ? body.key.trim() : '';
    if (!key) return respuesta(false, 'Por favor, ingrese una clave', 400);
    if (!env.API_BASE_URL || !env.API_TOKEN || !env.TYPE_ACCESS) {
        return respuesta(false, 'Servicio de acceso no configurado', 503);
    }
    const base = env.API_BASE_URL.replace(/\/$/, '');
    const clave = encodeURIComponent(key);
    const config = { headers: { Authorization: env.API_TOKEN }, timeout: 9000 };
    try {
        const consulta = await axios.get(`${base}/key/${clave}`, config);
        const datos = consulta.data?.key?.[0];
        if (!datos) return respuesta(false, 'Acceso denegado', 401);
        if (datos.estado) return respuesta(false, 'La clave ya ha sido utilizada', 409);
        if (datos.tipo !== env.TYPE_ACCESS) return respuesta(false, 'Clave no permitida', 403);
        if (!datos.autorizado) return respuesta(false, 'Acceso denegado', 403);
        const activacion = await axios.put(`${base}/actualizar/${clave}/1`, null, config);
        if (activacion.data?.success === false) {
            return respuesta(false, 'No se pudo activar la clave', 502);
        }
        return respuesta(true, 'Clave aceptada');
    } catch (error) {
        return [401, 403, 404].includes(error.response?.status)
            ? respuesta(false, 'Acceso denegado', 401)
            : respuesta(false, 'No se pudo completar el acceso. Intenta nuevamente.', 502);
    }
}
