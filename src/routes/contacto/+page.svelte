<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import { goto as navegar } from '$app/navigation';
    import { crearControlCarga } from '$lib/loading.js';
    const { mostrarCarga, ocultarCarga, ir: goto } = crearControlCarga(navegar);
    import { onMount } from 'svelte';
    import axios from '$lib/api.js';    
    let numero = ''
    let nombre= '';
    let inputdisabled = "";
    let origen = ''
    let saldo = ''
    let destino = ''
    let tipo = '3'
    onMount(() =>{
        origen = localStorage.getItem('origen') || '';
        saldo = localStorage.getItem('saldo') || '';
        saldo = Intl.NumberFormat('en-US',{
            minimumFractionDigits:2,
        }).format(Number(saldo));
    })
    const mostrarPreCarga = () => {
        mostrarCarga("flotante-mensaje");
    };
    const ocultarPreCarga = () => {
        ocultarCarga("flotante-mensaje");
    };
    const SinApiPlinear = async () => {
        mostrarPreCarga();
        const nombre = '';
        const tipo = '3';
        const destino = 'Plin';
        goto (`/pagarPlin?numero=${numero}&nombre=${nombre}&destino=${destino}&tipo=${tipo}`);
        ocultarPreCarga();
    }
    const continuar = async () => {
        const destino = 'YAPE';
        try {
            mostrarPreCarga();
            console.log('Entró a continuar()', numero);

            const storedKey = localStorage.getItem('key');
            // console.log('Authorization token:', token); // Agregar esta línea para verificar el token
            const response = await axios.get(`${API_BASE_URL}/buscar`, {
                    headers: {

                        'Content-Type': 'application/json'
                    },
                    params: {
                        numero: numero,
                        key: storedKey
                    }
            });
            if (response.status === 200 && response.data.success) {
                const { data } = response.data;
                const documentosYape = data.filter(doc => doc.destino === 'Yape');
                const nombre = documentosYape[0].nombre;
                goto (`/mContact?numero=${numero}&nombre=${nombre}&destino=${destino}&tipo=${tipo}`);
                ocultarPreCarga();
                    // Aquí puedes hacer lo que necesites con el nombre
            } else {
                const nombre = '';
                // goto (`/mContact?numero=${numero}&nombre=${nombre}&destino=${destino}&tipo=${tipo}`);
            }
        } catch (error) {
            const nombre = '';
            // goto (`/mContact?numero=${numero}&nombre=${nombre}&destino=${destino}&tipo=${tipo}`);
        } finally {
            ocultarPreCarga();
        }
    };
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
    function inicio(){
        goto('/home')
    }
    let panel = '';
    let dialogo;
    function abrirPanel(valor) {
        panel = valor;
        dialogo.showModal();
    }
</script>

<div class="contacts-page">
    <header class="contacts-header">
        <button class="back-button" title="Volver" on:click={inicio}><svg viewBox="0 0 24 40" fill="none" aria-hidden="true"><path d="M19 5L5 20L19 35" /></svg></button>
        <h1>Elige a quien enviar dinero</h1>
        <div class="header-actions">
            <button title="Soporte" on:click={() => abrirPanel('Soporte')}><img src="/images/contacto/soporte-icon.svg" alt="" /></button>
            <button title="Ajustes" on:click={() => abrirPanel('Ajustes')}><img src="/images/contacto/ajustes-icon.svg" alt="" /></button>
        </div>
    </header>

    <main>
        <div class="search-field">
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="15" /><path d="M31 31L44 44" /></svg>
            <input title="Busca el celular o contacto" placeholder="Busca el celular o contacto" bind:value={numero} autocomplete="off" maxlength="9" />
        </div>
        <div class="qr-actions">
            <button><img src="/images/contacto/escanear-qr-icon.svg" alt="" /><span>Pagar con QR</span></button>
            <button><img src="/images/contacto/mi-qr-icon.svg" alt="" /><span>Mi QR</span></button>
        </div>
        {#if !/^\d{9}$/.test(numero)}
            <section class="frequent-contacts" aria-labelledby="frequent-title">
                <h2 id="frequent-title">Contactos frecuentes</h2>
                <div class="empty-state" role="status">
                    <p>Aún no tienes contactos frecuentes. Realiza una<br class="wide-break" /> transferencia y aparecerán aquí</p>
                </div>
            </section>
        {/if}
    </main>
    {#if /^\d{9}$/.test(numero)}
        <footer class="continue-footer"><button on:click={continuar} class="continue-button">Continuar</button></footer>
    {/if}
</div>

<dialog class="info-dialog" bind:this={dialogo} aria-labelledby="dialog-title">
    <form method="dialog"><button class="close-dialog" title="Cerrar">×</button></form>
    <h2 id="dialog-title">{panel}</h2>
    <p>{panel === 'Soporte' ? 'Consulta los canales de atención de Caja Huancayo para recibir ayuda.' : panel === 'Ajustes' ? 'No hay preferencias de contactos configuradas.' : panel === 'Mi QR' ? 'No hay un código QR personal disponible.' : 'El lector de códigos QR no está conectado en esta pantalla.'}</p>
</dialog>
<div class="loading-overlay" id="flotante-mensaje">
        <div class="loading-content" role="status"><span class="loading-spinner"></span><span>Cargando...</span></div>
    </div>
<style>
    .contacts-page { display: flex; flex-direction: column; min-height: 100dvh; padding: calc(5.5vw + env(safe-area-inset-top, 0vw)) 6vw calc(6vw + env(safe-area-inset-bottom, 0vw)); box-sizing: border-box; background: #fff; color: #555b65; font-family: 'Roboto', Arial, sans-serif; }
    .contacts-page button { cursor: pointer; }
    .contacts-header { display: flex; align-items: center; gap: 4.1vw; min-height: 5.4vw; }
    .back-button { display: grid; place-items: center; width: 3vw; height: 4.5vw; flex-shrink: 0; background: transparent; color: #747d85; }
    .back-button svg { width: 2.6vw; height: 4.2vw; stroke: currentColor; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
    .contacts-header h1 { margin: 0; font-size: 3.3vw; line-height: 1.2; font-weight: 700; }
    .header-actions { display: flex; align-items: center; gap: 2.8vw; margin-left: auto; flex-shrink: 0; }
    .header-actions button { display: grid; place-items: center; width: 5.3vw; height: 5.3vw; background: transparent; }
    .header-actions img { width: 5.3vw; height: 5.3vw; object-fit: contain; }
    .search-field { display: flex; align-items: center; gap: 2.5vw; width: 100%; height: 10.7vw; margin-top: 7.6vw; padding: 0 2.6vw; border: .27vw solid #d7d9dc; border-radius: 7vw; box-sizing: border-box; }
    .search-field svg { width: 4.3vw; height: 4.3vw; flex-shrink: 0; stroke: #00b4db; stroke-width: 5.5; stroke-linecap: round; }
    .search-field input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: transparent; color: #555b65; font-family: inherit; font-size: 3.6vw; line-height: 1.2; font-weight: 400; }
    .search-field input::placeholder { color: #778087; opacity: 1; }
    .search-field input::-webkit-search-cancel-button { cursor: pointer; }
    .search-field:focus-within { border-color: #00b4db; }
    .qr-actions { display: flex; gap: 2vw; margin-top: 6vw; }
    .qr-actions button { display: flex; align-items: center; gap: 1.5vw; width: 43vw; height: 12vw; padding: 0 4.2vw; border-radius: 3vw; background: #fff; color: #414750; font-size: 3.6vw; line-height: 1.2; font-weight: 700; white-space: nowrap; box-shadow: 0 .5vw 4vw #0000000b; }
    .qr-actions img { width: 5.1vw; height: 5.1vw; flex-shrink: 0; object-fit: contain; }
    .continue-footer { margin-top: auto; padding-top: 6vw; }
    .continue-button { display: block; width: 57.8vw; height: 12vw; margin: 0 auto; border-radius: 5.3vw; background: #ff0000; color: #fff; font-size: 4vw; line-height: 1.2; font-weight: 700; }
    .frequent-contacts { min-height: 39.6vw; margin-top: 6vw; padding: 4vw 3.8vw; border: .2vw solid #eff0f2; border-radius: 3.2vw; box-sizing: border-box; background: #f7f8fa; color: #747d85; }
    .frequent-contacts h2 { margin: 0; font-size: 4vw; line-height: 1.2; font-weight: 700; }
    .empty-state { display: flex; align-items: center; justify-content: center; min-height: 26vw; text-align: center; }
    .empty-state p { margin: 1.7vw 0 0; font-size: 3.3vw; line-height: 1.2; font-weight: 400; overflow-wrap: anywhere; }
    .contacts-page button:focus-visible, .info-dialog button:focus-visible { outline: .4vw solid #00b4db; outline-offset: .5vw; }
    .info-dialog { position: fixed; inset: 0; width: 88vw; max-width: 88vw; padding: 6vw; border: 0; border-radius: 3.5vw; background: #fff; color: #555b65; box-sizing: border-box; font-family: 'Roboto', Arial, sans-serif; }
    .info-dialog::backdrop { background: #08263066; }
    .info-dialog h2 { padding-right: 4vw; font-size: 4.5vw; line-height: 1.2; }
    .info-dialog p { margin: 3vw 0 0; font-size: 3.5vw; line-height: 1.5; }
    .close-dialog { position: absolute; right: 3vw; top: 1vw; background: transparent; color: #555b65; font-size: 7vw; cursor: pointer; }
    .loading-content { display: flex; flex-direction: column; align-items: center; gap: 4vw; color: #555b65; font-size: 3vw; }
    .loading-spinner { width: 9vw; height: 9vw; box-sizing: border-box; border: .8vw solid #ffe0e3; border-top-color: #ff0014; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
</style>
