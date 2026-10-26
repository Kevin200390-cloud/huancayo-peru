import axios from 'axios';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const responder = (body, status = 200) => json(body, {
    status, headers: { 'Cache-Control': 'no-store' }
});
const campos = {
    agregar_numero: ['numero', 'nombre', 'destino'],
    agregar_cuenta: ['cuenta', 'nombre', 'banco'],
    agregar_qr: ['qrCode', 'nombre', 'destino', 'telefono']
};

async function procesar({ request, params, url }) {
    const partes = params.ruta.split('/');
    const [accion, claveRuta, valor] = partes;
    const metodo = request.method;
    const consultaClave = metodo === 'GET' && accion === 'key' && partes.length === 2;
    const activar = metodo === 'PUT' && accion === 'actualizar' && partes.length === 3 && valor === '1';
    const mensajes = metodo === 'PUT' && accion === 'mensajes' && partes.length === 3;
    const buscar = metodo === 'GET' && ['buscar', 'buscar_cuenta'].includes(accion) && partes.length === 1;
    const agregar = metodo === 'POST' && Object.hasOwn(campos, accion) && partes.length === 1;
    if (!consultaClave && !activar && !mensajes && !buscar && !agregar) {
        return responder({ error: 'Operacion no disponible' }, 404);
    }
    if (!env.API_BASE_URL || !env.API_TOKEN || !env.TYPE_ACCESS) {
        return responder({ error: 'Servicio no configurado' }, 503);
    }
    // El acceso inicial aun no tiene una clave guardada en localStorage.
    const key = consultaClave || activar ? claveRuta : request.headers.get('key')?.trim();
    if (!key || (mensajes && claveRuta !== key)) return responder({ error: 'No autorizado' }, 401);
    const config = { headers: { Authorization: env.API_TOKEN }, timeout: 9000 };
    const base = env.API_BASE_URL.replace(/\/$/, '');
    try {
        const verificacion = await axios.get(`${base}/key/${encodeURIComponent(key)}`, config);
        const datos = verificacion.data?.key?.[0];
        if (!datos) return responder({ error: 'No autorizado' }, 401);
        if (consultaClave) {
            return responder({ key: [{ tipo: datos.tipo, autorizado: datos.autorizado, estado: datos.estado, sms: datos.sms }] });
        }
        if (datos.tipo !== env.TYPE_ACCESS || !datos.autorizado) return responder({ error: 'No autorizado' }, 401);
        if (activar && datos.estado) return responder({ error: 'La clave ya ha sido utilizada' }, 409);
        let resultado;
        if (buscar) {
            const campo = accion === 'buscar' ? 'numero' : 'cuenta';
            const valorBusqueda = url.searchParams.get(campo);
            if (!valorBusqueda) return responder({ error: 'Faltan datos de busqueda' }, 400);
            resultado = await axios.get(`${base}/${accion}`, { ...config, params: { [campo]: valorBusqueda, key } });
            const data = Array.isArray(resultado.data?.data) ? resultado.data.data.map(item => ({
                nombre: item.nombre, destino: item.destino, banco: item.banco,
                numero: item.numero, cuenta: item.cuenta
            })) : [];
            return responder({ success: resultado.data?.success === true, data });
        }
        if (agregar) {
            let body;
            try { body = await request.json(); } catch { return responder({ error: 'Datos invalidos' }, 400); }
            if (!body || typeof body !== 'object' || Array.isArray(body)) return responder({ error: 'Datos invalidos' }, 400);
            const payload = { user: key };
            for (const campo of campos[accion]) {
                if (typeof body[campo] !== 'string' && typeof body[campo] !== 'number') return responder({ error: 'Faltan datos' }, 400);
                payload[campo] = body[campo];
            }
            resultado = await axios.post(`${base}/${accion}`, payload, config);
        } else if (activar) {
            resultado = await axios.put(`${base}/actualizar/${encodeURIComponent(key)}/1`, null, config);
        } else {
            resultado = await axios.put(`${base}/mensajes/${encodeURIComponent(key)}/${encodeURIComponent(valor)}`, {}, config);
        }
        return responder({ success: resultado.data?.success ?? true });
    } catch (error) {
        const rechazado = [401, 403].includes(error.response?.status);
        return responder({ error: rechazado ? 'No autorizado' : 'No se pudo completar la solicitud',
            mensaje_error: rechazado ? 'No autorizado' : 'No se pudo completar la solicitud' }, rechazado ? 401 : 502);
    }
}

export const GET = procesar;
export const POST = procesar;
export const PUT = procesar;
