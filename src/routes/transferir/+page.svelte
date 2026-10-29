<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import data from './entities.json'
    import { goto as navegar } from '$app/navigation';
    import { crearControlCarga } from '$lib/loading.js';
    const { mostrarCarga, ocultarCarga, ir: goto } = crearControlCarga(navegar);
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import axios from '$lib/api.js';
    let tipo = '1';
    let paso = '1';
    let monto = '';
    let cuenta = '';
    let nombre = '';
    let banco = '';
    let mensaje = '';
    let llegada = '';
    let botonActivo = '';
    let numero = '';
    let origen = '';
    let saldo = '';
    let inputdisabled = 'disabled';
    let sms = false;
    function oninputyapear(){
        if (nombre.length >= 3) {
            inputdisabled = "";
        } else {
            inputdisabled = "disabled";
        }
    }
    async function continuar(){
        if(codigo !== ''){
            tipo = '2'
        }
        mostrarCarga("flotante-mensaje");
        ocultarCarga("flotante-mensaje");
        goto (`/monto?nombre=${nombre}&cuenta=${cuenta}&codigo=${codigo}&tipo=${tipo}`);
    }
    onMount(async () => {
        const keyData = await verificarAcceso({ navegar: goto });
        if (keyData) sms = keyData.sms;
    });
    function verificarCuenta() {
        tipo = '2';
        banco = ''
        const cuentaCodigo = cuenta.slice(0, 3);
        const entidad = data.financial_entities.find(ent => ent.code === cuentaCodigo);
        if (entidad) {
            banco = entidad.name;
            // tipo = banco === 'INTERBANK' ? '1' : '2';
            // Para esto no es necesario lo de abajo
            if(banco == 'CMAQ HUANCAYO'){
                tipo = '1';
            } else{
                tipo = '2';
            }
        } else {
            tipo = '1';
        }
    }
    function handlePaste(event) {
        setTimeout(() => verificarCuenta(), 10);
    }
    let imgBtn ='menu-icon.svg'
    
    function auto(){
        paso = '2'
        mensaje = 'Recibir'
    }
    function interbancaria(){
        tipo = '2';
        paso = '2'
        mensaje = ''
        nmTransf = 'Inmediatas a otro banco'
        nmBar = 'CCI'
        nmInput = 'Ingresa un nro CCI'
        imgBtn = 'atras-icon.svg'
    } 
    function bancaria(){
        tipo = '1';
        paso = '2'
        mensaje = ''
        nmTransf = 'A otra cuenta BN'
        nmBar = 'Cuenta'
        nmInput = 'Ingresa un nro de cuenta'
        imgBtn = 'atras-icon.svg'
    }
    function atras(){
        goto ('/transferencias')
    }

    function bancos(){
        tipo = '2'
        llegada = '10 minutos';
        botonActivo = 'minutos';
    }
    function minutos(){
        llegada = '1';
        botonActivo = 'minutos'
    }
    function dias(){
        llegada = '2';
        botonActivo = 'dias'
    }
    async function siguienteAnt(){
        mostrarPreCarga();
        // monto = Intl.NumberFormat('en-US', {
        //     minimumFractionDigits: 2,
        // }).format(Number(monto));
        goto (`/confirmar?nombre=${nombre}&numero=${numero}&monto=${monto}&banco=${banco}&cuenta=${cuenta}&tipo=${tipo}&mensaje=${mensaje}&llegada=${llegada}`);
        ocultarPreCarga();
    }
    const siguiente = async () => {
        mostrarPreCarga();

        const storedKey = localStorage.getItem('key');
        // Primera solicitud
        try {
            const response = await axios.get(`${API_BASE_URL}/buscar_cuenta`, {
                headers: {

                    'Content-Type': 'application/json'
                },
                params: {
                    cuenta: cuenta,
                    key: storedKey
                }
            });
            if (response.status === 200 && response.data.success) {
                const nombre = response.data.data[0].nombre.trim();
                const encodedNombre = encodeURIComponent(nombre);
                goto (`/confirmar?nombre=${encodedNombre}&numero=${numero}&monto=${monto}&banco=${banco}&cuenta=${cuenta}&tipo=${tipo}&mensaje=${mensaje}&llegada=${llegada}`);
                // 941640140
            }
        } catch (error) {
            const nombre = ''
            goto (`/confirmar?nombre=${nombre}&numero=${numero}&monto=${monto}&banco=${banco}&cuenta=${cuenta}&tipo=${tipo}&mensaje=${mensaje}&llegada=${llegada}`);
        }
        ocultarPreCarga();
    };
    $: cuenta = formatInput(cuenta);
    function formatInput(value) {
    value = value.replace(/\s+/g, '');
    if (value.length > 3) {
        value = value.slice(0, 3) + ' ' + value.slice(3);
    }
    return value;
    }
    const mostrarPreCarga = () => {
        mostrarCarga("flotante-mensaje");
    };
    const ocultarPreCarga = () => {
        ocultarCarga("flotante-mensaje");
    };
    onMount(() => {
		origen = localStorage.getItem('origen') || '';
        saldo = localStorage.getItem('saldo') || '';
        saldo = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(Number(saldo));
  	});
    let nmTransf = ''
    let nmBar = ''
    let nmInput = ''

    let cuentaOrigen = '';
    let selectorOrigen;
    function seleccionarOrigen() {
        cuentaOrigen = origen;
        selectorOrigen.open = false;
        selectorOrigen.querySelector('summary').focus();
    }
    function cerrarSelector(event) {
        if (selectorOrigen && !selectorOrigen.contains(event.target)) selectorOrigen.open = false;
    }
    function validarOrigen(event) {
        event.preventDefault();
        selectorOrigen.open = true;
        selectorOrigen.querySelector('summary').focus();
    }

    $: titulo = $page.url.searchParams.get('destino') === 'otros-bancos'
        ? 'Transferencia a cuenta de otros bancos'
        : 'Transferencia a cuenta de terceros';
</script>

<div class="transfer-page">
    <header class="transfer-header">
        <button type="button" class="back-button" title="Volver" on:click={atras}><svg viewBox="0 0 24 40" fill="none" aria-hidden="true"><path d="M19 5L5 20L19 35" /></svg></button>
        <h1>{titulo}</h1>
    </header>

    <main>
        <form on:submit|preventDefault={siguiente}>
            <div class="source-field">
                <select class="native-source" bind:value={cuentaOrigen} required title="Cuenta de origen" tabindex="-1" aria-hidden="true" on:invalid={validarOrigen}>
                    <option value="" disabled>Cuenta de origen</option>
                    {#if origen}<option value={origen}>Cuenta de ahorro · {origen} · S/ {saldo}</option>{/if}
                </select>
                <details class="source-picker" bind:this={selectorOrigen}>
                    <summary class:has-value={cuentaOrigen !== ''}>
                        <span>{cuentaOrigen ? `Cuenta de ahorro · ${origen} · S/ ${saldo}` : 'Cuenta de origen'}</span>
                        <svg viewBox="0 0 40 24" fill="none" aria-hidden="true"><path d="M3 4L20 21L37 4" /></svg>
                    </summary>
                    <div class="source-options">
                        {#if origen}
                            <button type="button" class="source-option" class:selected={cuentaOrigen === origen} on:click={seleccionarOrigen}>
                                <span class="source-account"><strong>Cuenta de ahorro</strong><span>{origen}</span></span>
                                <span class="source-balance"><strong>S/ {saldo}</strong><span>Saldo disponible</span></span>
                            </button>
                        {:else}<p class="no-accounts">No hay cuentas de origen guardadas.</p>{/if}
                    </div>
                </details>
            </div>
            <div class="exchange-banner"><span class="currency-symbol">$</span><span>Tipo de cambio: Compra: 3.3450 | Venta: 3.5150</span></div>

            <fieldset class="currency-field">
                <legend>Moneda</legend>
                <div class="currency-options"><button type="button" class="selected" aria-pressed="true">Soles</button><button type="button" disabled>Dólares</button></div>
            </fieldset>
            <input class="rounded-input amount-input" title="Monto" placeholder="Monto" type="number" step="any" required bind:value={monto} />
            <p class="exchange-note">Tipo de cambio: Compra: 3.3450 | Venta: 3.5150</p>
            <input class="rounded-input" title="Cuenta de destino" placeholder="Cuenta de destino" required on:paste={handlePaste} on:change={verificarCuenta} on:input={verificarCuenta} maxlength="25" bind:value={cuenta} />
            <input class="rounded-input reason-input" title="Motivo de transferencia (Opcional)" placeholder="Motivo de transferencia (Opcional)" bind:value={mensaje} />
            {#if sms}<input class="rounded-input phone-input" title="Número de celular" placeholder="Número de celular" type="tel" required bind:value={numero} />{/if}
            <button type="submit" class="continue-button" disabled={monto <= 0}>Continuar</button>
        </form>
    </main>
    <div class="loading-overlay" id="flotante-mensaje"><div class="loading-content" role="status"><span class="loading-spinner" aria-hidden="true"></span><span class="loading-label">Cargando</span></div></div>
</div>

<style>
    .transfer-page { min-height: 100dvh; padding: calc(4vw + env(safe-area-inset-top, 0vw)) 4vw calc(7vw + env(safe-area-inset-bottom, 0vw)); box-sizing: border-box; background: #fff; color: #555b65; font-family: 'Roboto', Arial, sans-serif; }
    .transfer-header { display: flex; align-items: center; gap: 3.8vw; min-height: 12vw; padding: 0 2vw; }
    .transfer-header h1 { margin: 0; font-size: 3.3vw; font-weight: 700; line-height: 1.25; }
    .back-button { flex-shrink: 0; width: 3vw; height: 4.5vw; display: grid; place-items: center; background: transparent; color: #777e88; cursor: pointer; }
    .back-button svg { width: 2.6vw; height: 4.2vw; stroke: currentColor; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
    main { margin-top: 2.5vw; }
    .source-field { position: relative; width: 100%; height: 13vw; border: .27vw solid #d7d9dd; border-radius: 5.5vw; box-sizing: border-box; }
    .native-source { position: absolute; width: .1vw; height: .1vw; opacity: 0; pointer-events: none; }
    .source-picker { width: 100%; height: 100%; }
    .source-picker summary { display: flex; align-items: center; width: 100%; height: 100%; padding: 0 12vw 0 3.8vw; border-radius: 5.5vw; box-sizing: border-box; color: #a2a6ae; font-size: 3.15vw; font-weight: 700; list-style: none; cursor: pointer; }
    .source-picker summary::-webkit-details-marker { display: none; }
    .source-picker summary.has-value { color: #555b65; font-size: 2.8vw; }
    .source-picker summary > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .source-picker summary svg { position: absolute; right: 4.7vw; top: 5.1vw; width: 4vw; height: 2.5vw; stroke: #777e88; stroke-width: 3.5; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
    .source-picker[open] summary svg { transform: rotate(180deg); }
    .source-options { position: absolute; z-index: 5; top: calc(100% + 1.2vw); left: 0; width: 100%; padding: 1vw; border: .27vw solid #d7d9dd; border-radius: 3.5vw; box-sizing: border-box; background: #fff; box-shadow: 0 1.5vw 4vw #41475018; }
    .source-option { display: flex; align-items: center; justify-content: space-between; gap: 3vw; width: 100%; min-height: 14vw; padding: 2.5vw; border-radius: 2.5vw; background: #fff; color: #555b65; text-align: left; cursor: pointer; }
    .source-option:hover, .source-option.selected { background: #fff0f2; }
    .source-option.selected { box-shadow: inset .5vw 0 #ff0000; }
    .source-account, .source-balance { display: flex; flex-direction: column; gap: 1.3vw; min-width: 0; }
    .source-balance { text-align: right; flex-shrink: 0; }
    .source-option strong { font-size: 3.1vw; line-height: 1.2; }
    .source-account > span { font-size: 2.8vw; color: #a2a6ae; overflow-wrap: anywhere; }
    .source-balance > span { font-size: 2.3vw; color: #a2a6ae; }
    .no-accounts { margin: 0; padding: 3vw; color: #a2a6ae; font-size: 3vw; }
    .exchange-banner { display: flex; justify-content: center; align-items: center; gap: 2.2vw; height: 9.2vw; margin-top: 2.8vw; border: .27vw solid #d7d9dd; border-radius: 8vw; box-sizing: border-box; background: #f2f2f2; color: #777e88; font-size: 2.8vw; line-height: 1.2; white-space: nowrap; }
    .currency-symbol { width: 4vw; height: 4vw; display: grid; place-items: center; border: .3vw solid #777e88; border-radius: 50%; font-size: 3.2vw; font-weight: 700; }
    .currency-field { margin: 3vw 0 0; padding: 0; border: 0; min-width: 0; }
    .currency-field legend { margin: 0 0 1.2vw; padding: 0; color: #a2a6ae; font-size: 3vw; font-weight: 700; line-height: 1.2; }
    .currency-options { display: flex; gap: 1vw; height: 9vw; padding: .5vw; border-radius: 6vw; background: #fff0f2; box-sizing: border-box; }
    .currency-options button { flex: 1; height: 100%; border-radius: 6vw; background: #fffbfc; color: #555b65; font-size: 3.3vw; line-height: 1.2; }
    .currency-options button.selected { background: #ff0000; color: #fff; font-weight: 700; }
    .currency-options button:disabled { color: #555b65; }
    .rounded-input { display: block; width: 100%; height: 13vw; padding: 0 3.8vw; border: .27vw solid #d7d9dd; border-radius: 5.5vw; outline: none; background: #fff; color: #555b65; font-family: inherit; font-size: 3.15vw; font-weight: 700; box-sizing: border-box; }
    .rounded-input::placeholder { color: #a2a6ae; opacity: 1; }
    .amount-input { margin-top: 2.8vw; appearance: textfield; }
    .amount-input::-webkit-inner-spin-button, .amount-input::-webkit-outer-spin-button { appearance: none; margin: 0; }
    .exchange-note { margin: 1vw 0 3.1vw; color: #a2a6ae; font-size: 3.15vw; line-height: 1.2; }
    .reason-input, .phone-input { margin-top: 2.8vw; }
    .continue-button { display: block; width: 57.8vw; height: 12vw; margin: 6.8vw auto 0; border-radius: 5.3vw; background: #ff0000; color: #fff; font-size: 4vw; line-height: 1.2; font-weight: 700; cursor: pointer; }
    .continue-button:disabled { background: #e9e9eb; color: #a6a8ae; cursor: default; }
    .rounded-input:focus, .source-field:focus-within { border-color: #8e949c; }
    .transfer-page button:focus-visible, .source-picker summary:focus-visible { outline: .4vw solid #00b6dc; outline-offset: .5vw; }
    .loading-overlay { display: none; position: fixed; z-index: 20; inset: 0; align-items: center; justify-content: center; background: #ffffffbd; }
    .loading-content { display: flex; flex-direction: column; align-items: center; gap: 3vw; }
    .loading-spinner { display: block; flex-shrink: 0; box-sizing: border-box; width: 9vw; height: 9vw; border: .8vw solid #ffe0e3; border-top-color: #ff0014; border-radius: 50%; animation: spin .8s linear infinite; }
    .loading-label { display: block; color: #555b65; font-size: 3vw; }
    @keyframes spin { to { transform: rotate(360deg); } }
</style>
