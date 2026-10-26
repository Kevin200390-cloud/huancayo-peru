<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let historial = [];
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
    let titular ='';
    let conexion = false;
    let random = '';
    let dato1 = '';
    let dato2 = ''
    let errorVoucher = '';
    let cargandoVoucher = true;
    onMount(() => {
        try {
            const transaccionId = new URLSearchParams(window.location.search).get('transaccionId');
            const guardados = JSON.parse(localStorage.getItem('historial') ?? '[]');
            if (!Array.isArray(guardados)) throw new Error('Historial inválido');
            const transaccion = transaccionId && guardados.find(item => item?.transaccionId === transaccionId);
            if (!transaccion) {
                errorVoucher = 'No se encontró esta simulación en el historial de este navegador.';
                return;
            }
            ({ numero = '', nombre = '', monto = '', fecha = '', hora = '', operacion = '',
                destino = '', mensaje = '', tipo = '', cuenta = '', origen = '', banco = '',
                llegada = '', dato1 = '', dato2 = '' } = transaccion);
        } catch (error) {
            errorVoucher = 'No se pudo leer el historial local de simulaciones.';
        } finally {
            cargandoVoucher = false;
        }
    });
    function inicio(){
        goto('/home');
    }
    function activate(){
        conexion = !conexion
    }
    function operaciones(){
        goto('/transferir')
    }
    function otroservicio(){
        goto('/servicio')
    }
    function plin(){
        goto('/plin')
    }
    function esDispositivoMovil(userAgent) {
        const palabrasClaveMovil = ['Mobile', 'Android', 'iPhone', 'iPad', 'Windows Phone'];
        return palabrasClaveMovil.some(keyword => userAgent.includes(keyword));
    }
    let esMovil = false;
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
        esMovil = esDispositivoMovil(navigator.userAgent);
    });
    function delFirst(texto) {
        let palabras = texto.split(' ');
        if (palabras.length > 1) {
        palabras.shift();
        return palabras.join(' ');
        }
        return texto;
    }
    function primeraPalabra(text){
        let palabra = text.split(' ')
        return palabra[0]
    }
    function floatMonto(monto) {
        return monto = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(Number(monto));
    }
    let aviso = '';
    $: identificador = (tipo === '3' ? numero : cuenta).replace(/\s/g, '');
    $: numeroOculto = identificador ? '*****' + identificador.slice(-3) : '';
    $: fechaVisible = formatearFecha(fecha, hora);
    function formatearFecha(valor, tiempo) {
        const partes = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        const dia = partes ? `${partes[3]}-${partes[2]}-${partes[1]}` : valor.split(' ')[0];
        return [dia, tiempo.toLowerCase()].filter(Boolean).join(' - ');
    }
    function otroPago() {
        goto(tipo === '3' ? '/plin' : tipo === '5' ? '/servicios' : '/transferir');
    }
</script>

<main class="voucher-page">
    
    <header class="success-header">
        <svg class="success-icon" viewBox="0 0 100 62" fill="none" aria-hidden="true"><path d="M7 36L23 49Q28 53 33 47L65 10M34 36L50 49Q55 53 60 47L92 10" /></svg>
        <h1>Enviaste</h1>
        <p class="amount">S/ {floatMonto(monto)}</p>
    </header>

    <dl class="receipt-details">
        <div><dt>{tipo === '5' ? 'Servicio' : 'Enviado a'}</dt><dd class="recipient">{nombre || '—'}{#if numeroOculto}<br />{numeroOculto}{/if}</dd></div>
        <div><dt>Destino</dt><dd class="uppercase">{destino || banco || dato2 || 'Cuenta de ahorro'}</dd></div>
        {#if tipo === '5' && dato1}<div><dt>Documento</dt><dd>{dato1}</dd></div>{/if}
        <div><dt>Fecha y hora</dt><dd>{fechaVisible || '—'}</dd></div>
        <div><dt>Código de operación</dt><dd>{operacion || '—'}</dd></div>
    </dl>

    <aside class="commission-card">
        <div><h2>Sin costo de comisión</h2><p>Tu dinero llega completo</p></div>
        <span>Gratis</span>
    </aside>

    <div class="receipt-actions">
        <button><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M16 20L32 11M16 28L32 37" /><circle cx="10" cy="24" r="7" /><circle cx="37" cy="8" r="7" /><circle cx="37" cy="40" r="7" /></svg><span>Compartir</span></button>
        <button><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5V31M14 22L24 32L34 22M7 32V37Q7 42 12 42H36Q41 42 41 37V32" /></svg><span>Descargar</span></button>
    </div>
    {#if aviso}<p class="action-message" role="status">{aviso}</p>{/if}
    <button class="another-payment" on:click={otroPago}>Realizar otro pago</button>
    
    <button class="home-button" on:click={inicio}>Ir al Inicio</button>
</main>

<style>
    .voucher-page { min-height: 100dvh; box-sizing: border-box; padding: calc(4vw + env(safe-area-inset-top, 0px)) 8vw calc(10vw + env(safe-area-inset-bottom, 0px)); background: #fff; color: #555b65; font-family: 'Roboto', Arial, sans-serif; }
    .demo-notice { margin: 0; padding: 2vw; border: .2vw solid #d7d9dd; border-radius: 2vw; text-align: center; font-size: 2.8vw; line-height: 1.4; color: #555b65; background: #f7f8fa; }
    .success-header { text-align: center; padding-top: 5vw; }
    .success-icon { width: 12vw; height: 7vw; stroke: #00c853; stroke-width: 10; stroke-linecap: round; stroke-linejoin: round; }
    .success-header h1 { margin: 5.5vw 0 0; font-size: 4vw; line-height: 1.3; font-weight: 700; }
    .amount { margin: 2.3vw 0 0; font-size: 6vw; line-height: 1.2; font-weight: 900; overflow-wrap: anywhere; }
    .receipt-details { margin: 4.8vw 0 0; }
    .receipt-details > div { padding: 2.1vw 2vw 2.2vw; border-bottom: .25vw solid #d7d9dd; }
    .receipt-details > div:last-child { border: 0; }
    dt { color: #777e88; font-size: 2.8vw; line-height: 1.3; font-weight: 700; }
    dd { margin: 1vw 0 0; font-size: 3.5vw; line-height: 1.2; overflow-wrap: anywhere; }
    .recipient, .uppercase { text-transform: uppercase; }
    .commission-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 2vw; margin-top: 1vw; padding: 2vw; background: #f1fcf6; }
    .commission-card h2 { color: #777e88; font-size: 2.9vw; font-weight: 700; line-height: 1.3; }
    .commission-card p { margin: 1vw 0 0; font-size: 3.2vw; line-height: 1.2; }
    .commission-card > span { padding: .4vw 2.6vw; border-radius: 5vw; background: #00c853; color: #fff; font-size: 3vw; line-height: 1.1; }
    .demo-description { margin: 2vw 0 0; font-size: 2.7vw; line-height: 1.4; text-align: center; color: #777e88; }
    .receipt-actions { display: flex; justify-content: center; gap: 8vw; margin-top: 4.2vw; }
    .receipt-actions button { display: flex; flex-direction: column; align-items: center; gap: 1.7vw; background: transparent; color: #00b1d8; font-size: 3vw; font-weight: 700; cursor: pointer; }
    .receipt-actions svg { width: 5.2vw; height: 5.2vw; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .another-payment { display: block; width: 57.8vw; min-height: 12vw; margin: 6.2vw auto 0; padding: 2vw; border-radius: 5.3vw; background: #ff0000; color: #fff; font-size: 4vw; font-weight: 700; cursor: pointer; }
    .home-button { display: block; margin: 5vw auto 0; padding: 0 2vw; min-height: 5vw; background: transparent; color: #ff0000; font-size: 4vw; font-weight: 700; cursor: pointer; }
    .action-message { margin: 3vw 0 0; text-align: center; color: #777e88; font-size: 2.8vw; }
    button:focus-visible { outline: .4vw solid #00b1d8; outline-offset: .5vw; }
</style>
