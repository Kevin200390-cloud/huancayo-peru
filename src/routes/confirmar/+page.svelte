<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { goto as navegar } from '$app/navigation';
    import { crearControlCarga } from '$lib/loading.js';
    const { mostrarCarga, ocultarCarga, ir: goto } = crearControlCarga(navegar);
    import { onMount } from 'svelte';

    let numero = '';
    let nombre = '';
    let monto = '';
    let fecha = '';
    let hora = '';
    let operacion = '';
    let destino = '';
    let mensaje = '';
    let tipo = '';
    let cuenta = '';
    let origen = '';
    let banco = '';
    let llegada = '';
    let letrasContadas = 0;
    let txtTittle = ''
    let dato1 = ''
    let dato2 = ''
    $: {
        letrasContadas = mensaje.length;
    }
    function inicio(){
        goto('/home');
    }
    function atras(){
        history.go(-1);
    }
    onMount(() => {
        if (typeof window !== 'undefined') {
            origen = localStorage.getItem('origen') || '';
        }
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.has('numero')) {
            numero = urlParams.get('numero');
        }
        if (urlParams.has('nombre')) {
            nombre = urlParams.get('nombre');
        }
        if (urlParams.has('monto')) {
            monto = urlParams.get('monto');
        }
        if (urlParams.has('tipo')) {
            tipo = urlParams.get('tipo');
        }
        if (urlParams.has('banco')) {
            banco = urlParams.get('banco');
        }
        if (urlParams.has('cuenta')) {
            cuenta = urlParams.get('cuenta');
        }
        if (urlParams.has('destino')) {
            destino = urlParams.get('destino');
        }
        if (urlParams.has('llegada')) {
            llegada = urlParams.get('llegada');
        }
        if (urlParams.has('operacion')) {
            operacion = urlParams.get('operacion');
        }
        if (urlParams.has('mensaje')) {
            mensaje = urlParams.get('mensaje');
        }
        if (urlParams.has('dato1')) {
            dato1 = urlParams.get('dato1');
        }
        if (urlParams.has('dato2')) {
            dato2 = urlParams.get('dato2');
        }
        if (tipo == '2' || tipo == '1'){
            txtTittle = 'Confirmar'
        } else if (tipo == '3'){
            txtTittle = 'Resumen de transferencia'
        } else{
            txtTittle = 'Confirmar'
        }
    });
    let procesando = false;
    let errorConfirmacion = '';
    let transaccionGuardada = '';
    async function confirmarpago() {
        if (procesando) return;
        errorConfirmacion = '';
        const montoOperacion = Number(monto);
        if (!nombre.trim() || !Number.isFinite(montoOperacion) || montoOperacion <= 0) {
            errorConfirmacion = 'Ingresa un nombre y un monto válido.';
            return;
        }
        procesando = true;
        mostrarPreCarga();
        try {
            if (!transaccionGuardada) {
                const historial = JSON.parse(localStorage.getItem('historial') ?? '[]');
                if (!Array.isArray(historial)) throw new Error('Historial inválido');
                const saldoActual = Number(localStorage.getItem('saldo') || '0');
                if (!Number.isFinite(saldoActual)) throw new Error('Saldo inválido');
                operacion = '001' + String(Math.floor(Math.random() * 9000000) + 1000000);
                const now = new Date();
                const pad = value => String(value).padStart(2, '0');
                const horas = pad(now.getHours() % 12 || 12);
                fecha = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${horas}:${pad(now.getMinutes())}`;
                hora = `${horas}:${pad(now.getMinutes())} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
                const transaccionId = crypto.randomUUID();
                const transaccion = {
                    nombre, numero, cuenta, monto, destino, operacion, fecha, hora,
                    tipo, transaccionId, mensaje, origen, banco, llegada, dato1, dato2,
                    simulada: true
                };
                const historialAnterior = localStorage.getItem('historial');
                localStorage.setItem('historial', JSON.stringify([...historial, transaccion]));
                try {
                    localStorage.setItem('saldo', (Math.round((saldoActual - montoOperacion) * 100) / 100).toString());
                } catch (error) {
                    if (historialAnterior === null) localStorage.removeItem('historial');
                    else localStorage.setItem('historial', historialAnterior);
                    throw error;
                }
                transaccionGuardada = transaccionId;
            }
            await goto(`/voucher?transaccionId=${encodeURIComponent(transaccionGuardada)}`);
        } catch (error) {
            console.error('Error al guardar la transacción.');
        } finally {
            procesando = false;
            ocultarPreCarga();
        }
    }
    const mostrarPreCarga = () => {
        mostrarCarga("flotante-mensaje");
    };

    const ocultarPreCarga = () => {
        ocultarCarga("flotante-mensaje");
    };
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
    function floatMonto(monto) {
        return monto = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(Number(monto));
    }
</script>

<div class="confirm-page">
    <header class="confirm-header">
        <button class="back-button" on:click={atras} aria-label="Volver">
            <svg viewBox="0 0 24 40" fill="none" aria-hidden="true"><path d="M19 5L5 20L19 35" /></svg>
        </button>
        <h1>{txtTittle || 'Confirmar'}</h1>
    </header>

    <main>
        <section class="amount-card" aria-labelledby="amount-title">
            <h2 id="amount-title">{tipo === '5' ? 'Monto a pagar' : 'Monto a transferir'}</h2>
            <p class="amount"><span>S/</span> {floatMonto(monto)}</p>
        </section>

        <section class="details-card" aria-labelledby="details-title">
            <h2 id="details-title">Detalle de la operación</h2>
            <dl>
                <div class="detail-row">
                    <dt>Desde mi cuenta de ahorro soles</dt>
                    <dd>.... .... {origen ? origen.replace(/\D/g, '').slice(-4) : '••••'}</dd>
                </div>
                {#if tipo === '3'}
                    <div class="detail-row"><dt>Nombre</dt><dd class="uppercase">{nombre || '—'}</dd></div>
                    <div class="detail-row"><dt>Número de celular</dt><dd>{numero || '—'}</dd></div>
                    <div class="detail-row"><dt>Entidad destino</dt><dd>{destino || '—'}</dd></div>
                {:else if tipo === '5'}
                    <div class="detail-row"><dt>Servicio</dt><dd class="uppercase">{nombre || '—'}</dd></div>
                    <div class="detail-row"><dt>Documento</dt><dd>{dato1 || '—'}</dd></div>
                {:else}
                    <div class="detail-row"><dt>{tipo === '2' ? 'Hacia el nro. de CCI' : 'Hacia el nro. de cuenta'}</dt><dd>{cuenta || '—'}</dd></div>
                    {#if tipo === '2'}<div class="detail-row"><dt>Banco destino</dt><dd>{banco || '—'}</dd></div>{/if}
                    <div class="detail-row"><dt>Nombre</dt><dd class="uppercase">{nombre || '—'}</dd></div>
                {/if}
                {#if mensaje}<div class="detail-row"><dt>Motivo de la operación</dt><dd>{mensaje}</dd></div>{/if}
            </dl>
        </section>

        <!-- {#if tipo === '2' || tipo === '3'}
            <section class="charges-card" aria-label="Cargos de la transferencia">
                <dl>
                    <div><dt>Comisión</dt><dd>{tipo === '3' ? 'Gratis' : 'S/ 0.00'}</dd></div>
                    {#if tipo === '2'}<div><dt>ITF</dt><dd>S/ 0.00</dd></div>{/if}
                    <div class="total"><dt>Cargo en cuenta</dt><dd>S/ {floatMonto(monto)}</dd></div>
                </dl>
            </section>
        {/if} -->


        {#if errorConfirmacion}<p role="alert">{errorConfirmacion}</p>{/if}
        <button on:click={confirmarpago} disabled={procesando} class="confirm-button">Confirmar</button>
    </main>
    <div class="loading-overlay" id="flotante-mensaje">
        <div class="loading-content" role="status"><span class="loading-spinner"></span><span>Cargando...</span></div>
    </div>
</div>

<style>
    .confirm-page { min-height: 100dvh; padding: calc(4vw + env(safe-area-inset-top, 0vw)) 4vw calc(7vw + env(safe-area-inset-bottom, 0vw)); box-sizing: border-box; background: #fff; color: #555b65; font-family: 'Roboto', Arial, sans-serif; }
    .confirm-header { display: flex; align-items: center; gap: 3.8vw; min-height: 12vw; padding: 0 2vw; }
    .confirm-header h1 { margin: 0; font-size: 3.3vw; font-weight: 700; line-height: 1.25; }
    .back-button { flex-shrink: 0; width: 3vw; height: 4.5vw; display: grid; place-items: center; background: transparent; color: #777e88; cursor: pointer; }
    .back-button svg { width: 2.6vw; height: 4.2vw; stroke: currentColor; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
    main { margin-top: 2.5vw; }
    .intro { margin: 0 2vw 4vw; color: #a2a6ae; font-size: 3.15vw; line-height: 1.4; }
    .amount-card { padding: 5vw 4vw; border-radius: 5.5vw; background: #fff0f2; text-align: center; }
    .amount-card h2 { color: #777e88; font-size: 3.15vw; line-height: 1.3; font-weight: 500; }
    .amount { margin: 2vw 0 0; color: #414750; font-size: 8vw; line-height: 1.2; font-weight: 700; overflow-wrap: anywhere; }
    .amount span { font-size: 5vw; }
    .details-card { margin-top: 3vw; padding: 4vw; border: .27vw solid #d7d9dd; border-radius: 5.5vw; }
    .details-card h2 { font-size: 3.5vw; line-height: 1.3; font-weight: 700; }
    dl { margin: 0; }
    .detail-row { padding: 3.5vw 0; border-bottom: .2vw solid #e9eaec; }
    .detail-row:last-child { padding-bottom: 0; border-bottom: 0; }
    dt { color: #a2a6ae; font-size: 3vw; line-height: 1.4; }
    dd { margin: 1vw 0 0; color: #555b65; font-size: 3.5vw; line-height: 1.4; font-weight: 700; overflow-wrap: anywhere; }
    .uppercase { text-transform: uppercase; }
    .charges-card { margin-top: 3vw; padding: 3.5vw 4vw; border-radius: 5.5vw; background: #f7f8fa; }
    .charges-card dl > div { display: flex; justify-content: space-between; align-items: baseline; gap: 3vw; padding: 1vw 0; }
    .charges-card dt, .charges-card dd { margin: 0; font-size: 3.15vw; }
    .charges-card .total { margin-top: 2vw; padding-top: 3vw; border-top: .2vw solid #d7d9dd; }
    .total dt { color: #555b65; font-weight: 700; }
    .digital-key { display: flex; flex-direction: column; gap: 2vw; margin: 4vw 2vw 0; padding-bottom: 2vw; border-bottom: .27vw solid #d7d9dd; color: #777e88; font-size: 3vw; }
    .digital-key strong { color: #555b65; font-size: 5vw; letter-spacing: 1vw; }
    .confirm-button { display: block; width: 57.8vw; height: 12vw; margin: 6.8vw auto 0; border-radius: 5.3vw; background: #ff0000; color: #fff; font-size: 4vw; line-height: 1.2; font-weight: 700; cursor: pointer; }
    .confirm-page button:focus-visible { outline: .4vw solid #00b6dc; outline-offset: .5vw; }
    .loading-overlay { display: none; position: fixed; z-index: 20; inset: 0; align-items: center; justify-content: center; background: #ffffffed; }
    .loading-content { display: flex; flex-direction: column; align-items: center; gap: 4vw; color: #555b65; font-size: 3vw; }
    .loading-spinner { width: 9vw; height: 9vw; box-sizing: border-box; border: .8vw solid #ffe0e3; border-top-color: #ff0014; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
</style>
