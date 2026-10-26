// Each page owns its loaders; time is measured from the moment they appear.
export function crearControlCarga(navegar) {
    const activos = new Map();
    function mostrarCarga(id) {
        const elemento = document.getElementById(id);
        if (!elemento) return;
        if (!activos.has(elemento)) {
            const duracion = 2000 + Math.floor(Math.random() * 2001);
            activos.set(elemento, new Promise(resolve => setTimeout(resolve, duracion)));
        }
        elemento.style.display = 'flex';
    }
    async function ocultarCarga(id) {
        const elemento = document.getElementById(id);
        const espera = activos.get(elemento);
        await espera;
        if (elemento && activos.get(elemento) === espera) {
            elemento.style.display = 'none';
            activos.delete(elemento);
        }
    }
    async function ir(...args) {
        await Promise.all([...activos.values()]);
        return navegar(...args);
    }
    return { mostrarCarga, ocultarCarga, ir };
}
