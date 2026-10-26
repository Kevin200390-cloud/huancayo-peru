<script>
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import { goto as navegar } from '$app/navigation';
    import { crearControlCarga } from '$lib/loading.js';
    const { mostrarCarga, ocultarCarga, ir: goto } = crearControlCarga(navegar);
    import { onMount } from 'svelte';
    import axios from '$lib/api.js';
    
    let nombre = '';
    let numero = ''
    let tipo = '';
    let destino = '';
    let monto = '';
    let operacion = '';
    let botonActivo = 'plin';
    let imgdestino = '/images/logoplin.svg'

    onMount(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('numero')) {
            numero = urlParams.get('numero');
        }
        if (urlParams.has('nombre')) {
            nombre = urlParams.get('nombre');
        }
        if (urlParams.has('destino')) {
            destino = urlParams.get('destino');
        }
        if (urlParams.has('tipo')) {
            tipo = urlParams.get('tipo');
        }
    });
    const mostrarPreCarga = () => {
        mostrarCarga("flotante-mensaje");
    };

    const ocultarPreCarga = () => {
        ocultarCarga("flotante-mensaje");
    };
    const mostrarPreCargaNum = () => {
        mostrarCarga("flotante-carga");
    };

    const ocultarPreCargaNum = () => {
        ocultarCarga("flotante-carga");
    };

    const yape = async () => {
        try {
            mostrarPreCargaNum();
            const storedKey = localStorage.getItem('key');

            const response = await axios.get(`${API_BASE_URL}/buscar`, {
                    headers: {

                        'Content-Type': 'application/json'
                    },
                    params: {
                        numero: numero,
                        key: storedKey
                    }
            });
            if (response.status === 200 && response.success) {
                // La solicitud se completó exitosamente
                ocultarPreCargaNum();
                const { data } = response.data;
                const documentosYape = data.filter(doc => doc.destino === 'Yape');
                nombre = documentosYape[0].nombre;
                destino = 'Yape'
            } else {
                nombre = '';
                destino = 'Yape'
                ocultarPreCargaNum();
            }
        } catch (error) {
            ocultarPreCargaNum();
        }
        ocultarPreCargaNum();
        imgdestino = '/images/destino-icon.svg'
    };
    const SinApiyape = async () => {
        nombre = data.datos.nombre.toUpperCase();
        destino = 'Yape'
    }
    const SinApiplin = async () => {
        nombre = data.datos.nombre.toUpperCase();
        destino = 'Plin'
    }
    const plin = async () => {
        try {
            mostrarPreCargaNum();
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
                // La solicitud se completó exitosamente
                const { data } = response.data;
                const documentosYape = data.filter(doc => doc.destino === 'Plin');
                nombre = documentosYape[0].nombre;
                destino = 'Plin'
            } else {
                nombre = '';
                destino = 'Plin'
                ocultarPreCargaNum();
            }
        } catch (error) {
            ocultarPreCargaNum();
        }
        ocultarPreCargaNum();
        imgdestino = '/images/logoplin.svg'
    };

    let datos = []
    let cargando = true
    onMount(async () => {
        try {
            const valor = localStorage.getItem('key');

            // console.log('Authorization token:', token); // Agregar esta línea para verificar el token
            const response = await axios.get(`${API_BASE_URL}/buscar`, {
                    headers: {

                        'Content-Type': 'application/json'
                    },
                    params: {
                        numero: numero, 
                        key: valor 
                    }
            });
            if (response.status === 200 && response.data.success) {
                datos = response.data.data;
                console.log(datos); 
            } else {
                // const nombre = '';
            }
        } catch (error) {
            // const nombre = '';
           
        } finally {
            cargando = false; // Al terminar de cargar, cambiar el flag a false
        }
    })

    function alertapagar(destinoSel, nombreSel){
        destino = destinoSel
        botonActivo = destinoSel;
        nombre = nombreSel
    }

    function plinnn() {
        plin()
        botonActivo = 'plin';
    }

    function yapeee() {
        yape()
        botonActivo = 'yape';
    }

    async function continuar(){
        const numeroAleatorio = Math.floor(Math.random() * 90000000) + 10000000;
        const numeroFormateado = numeroAleatorio.toString().padStart(8, '0');
        operacion = numeroFormateado
        // monto = Intl.NumberFormat('en-US', {
        //     minimumFractionDigits: 2,
        // }).format(Number(monto));
        mostrarPreCarga();
        goto (`/confirmar?numero=${numero}&nombre=${nombre}&tipo=${tipo}&monto=${monto}&destino=${destino}&operacion=${operacion}`);
        ocultarPreCarga();
    }
    function irAtras(){
        goto('/plin');
    }
</script>

<div class="contact-page">
    <header class="contact-header">
        <button type="button" class="back-button" aria-label="Volver" on:click={irAtras}><svg viewBox="0 0 24 40" fill="none" aria-hidden="true"><path d="M19 5L5 20L19 35" /></svg></button>
        <h1>Paga a Contacto</h1>
    </header>
    <main>
        <div class="contact-info">
            <input id="contact-name" class="contact-name" aria-label="Nombre" bind:value={nombre} placeholder="Nombre" type="text" />
            <p class="contact-number">{numero}</p>
        </div>

        <div class="amount-field"><input required aria-label="Monto" bind:value={monto} placeholder="Monto" id="inputmonto" type="number" step="any" /></div>
        <p class="amount-note">Máx. S/ 500 por operación y hasta S/ 1,500 diarios</p>

        <details class="destination-picker">
            <summary aria-label="Destino" class:has-value={destino !== ''}>
                <span id="destination-value">{destino || 'Selecciona el destino'}</span>
                <svg viewBox="0 0 40 24" fill="none" aria-hidden="true"><path d="M3 4L20 21L37 4" /></svg>
            </summary>
            <div class="destination-options">
                {#if cargando}<p class="options-message" role="status">Cargando destinos...</p>
                {:else if datos.length === 0}<p class="options-message">No hay destinos disponibles.</p>
                {:else}
                    {#each [...datos.filter(dato => dato.destino === 'Yape').slice(0, 1), ...datos.filter(dato => dato.destino !== 'Yape')] as dato}
                        <button type="button" class="destination-option" class:selected={destino === dato.destino} aria-pressed={destino === dato.destino} on:click={(event) => { alertapagar(dato.destino, dato.nombre); const picker = event.currentTarget.closest('details'); picker.open = false; picker.querySelector('summary').focus(); }}>
                            <strong>{dato.destino}</strong>
                        </button>
                    {/each}
                {/if}
            </div>
        </details>
        <button type="button" on:click={continuar} disabled={monto <= 0} class="continue-button">Continuar</button>
    </main>
    <div class="loading-overlay" id="flotante-mensaje"><span class="loading-spinner" role="status" aria-label="Cargando"></span></div>
    <div class="loading-overlay" id="flotante-carga"><span class="loading-spinner" role="status" aria-label="Cargando destino"></span></div>
</div>
<style>
    .contact-page { min-height: 100dvh; padding: calc(4vw + env(safe-area-inset-top, 0vw)) 4vw calc(7vw + env(safe-area-inset-bottom, 0vw)); box-sizing: border-box; background: #fff; color: #555b65; font-family: 'Roboto', Arial, sans-serif; }
    .contact-header { display: flex; align-items: center; gap: 3.8vw; min-height: 12vw; padding: 0 2vw; }
    .contact-header h1 { margin: 0; font-size: 3.3vw; font-weight: 700; line-height: 1.25; }
    .back-button { flex-shrink: 0; width: 3vw; height: 4.5vw; display: grid; place-items: center; background: transparent; color: #777e88; cursor: pointer; }
    .back-button svg { width: 2.6vw; height: 4.2vw; stroke: currentColor; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
    main { margin-top: 2.5vw; }
    .amount-field { width: 100%; height: 13vw; padding: 0 3.8vw; border: .27vw solid #d7d9dd; border-radius: 5.5vw; box-sizing: border-box; background: #fff; color: #555b65; font-size: 3.15vw; font-weight: 700; }
    .contact-info { margin: 2vw 0 5vw; padding: 0 3.8vw; }
    .contact-name { display: block; width: 100%; padding: 0; border: 0; border-radius: 0; outline: none; background: transparent; color: #555b65; font-size: 4.1vw; line-height: 1.4; font-weight: 700; }
    .contact-name::placeholder, .amount-field input::placeholder { color: #a2a6ae; opacity: 1; }
    .contact-name:focus-visible { outline: .3vw solid #00b6dc; outline-offset: 1vw; }
    .contact-number { margin: 1vw 0 0; color: #777e88; font-size: 3.15vw; line-height: 1.4; overflow-wrap: anywhere; }
    .amount-field { display: flex; align-items: center; gap: 2vw; }
    .amount-field input { width: 100%; min-width: 0; height: 100%; outline: none; background: transparent; color: #555b65; font-size: inherit; font-weight: inherit; appearance: textfield; }
    .amount-field input::-webkit-inner-spin-button, .amount-field input::-webkit-outer-spin-button { appearance: none; margin: 0; }
    .amount-note { margin: 1vw 0 3.1vw; color: #a2a6ae; font-size: 3.15vw; line-height: 1.4; }
    .destination-picker { position: relative; width: 100%; height: 13vw; border: .27vw solid #d7d9dd; border-radius: 5.5vw; box-sizing: border-box; }
    .destination-picker summary { display: flex; align-items: center; width: 100%; height: 100%; padding: 0 12vw 0 3.8vw; border-radius: 5.5vw; box-sizing: border-box; color: #a2a6ae; font-size: 3.15vw; font-weight: 700; list-style: none; cursor: pointer; }
    .destination-picker summary::-webkit-details-marker { display: none; }
    .destination-picker summary.has-value { color: #555b65; }
    .destination-picker summary > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .destination-picker summary svg { position: absolute; right: 4.7vw; top: 5.1vw; width: 4vw; height: 2.5vw; stroke: #777e88; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
    .destination-picker[open] summary svg { transform: rotate(180deg); }
    .destination-options { position: absolute; z-index: 5; top: calc(100% + 1.2vw); left: 0; width: 100%; max-height: 60dvh; overflow-y: auto; padding: 1vw; border: .27vw solid #d7d9dd; border-radius: 3.5vw; box-sizing: border-box; background: #fff; box-shadow: 0 1.5vw 4vw #41475018; }
    .destination-option { display: flex; flex-direction: column; width: 100%; padding: 2.5vw; border-radius: 2.5vw; background: #fff; color: #555b65; text-align: left; cursor: pointer; overflow-wrap: anywhere; }
    .destination-option strong { font-size: 4vw; line-height: 1.2; }
    .destination-option:hover, .destination-option.selected { background: #fff0f2; }
    .options-message { margin: 0; padding: 3vw; color: #a2a6ae; font-size: 3vw; }
    .continue-button { display: block; width: 57.8vw; height: 12vw; margin: 6.8vw auto 0; border-radius: 5.3vw; background: #ff0000; color: #fff; font-size: 4vw; line-height: 1.2; font-weight: 700; cursor: pointer; }
    .continue-button:disabled { background: #e9e9eb; color: #a6a8ae; cursor: default; }
    .amount-field:focus-within, .destination-picker:focus-within { border-color: #8e949c; }
    button:focus-visible, summary:focus-visible { outline: .4vw solid #00b6dc; outline-offset: .5vw; }
    .loading-overlay { display: none; position: fixed; z-index: 20; inset: 0; align-items: center; justify-content: center; background: #ffffffbd; }
    .loading-spinner { width: 9vw; height: 9vw; border: .8vw solid #ffe0e3; border-top-color: #ff0014; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
</style>
