<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
	import '../global.css'
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let nombre = '';
	let saldo = '';
	let origen = '';
	let historial = [];
	onMount(() => {
		historial = JSON.parse(localStorage.getItem("historial")) || [];
		historial.reverse();
        nombre = localStorage.getItem('nombre') || '';
        saldo = localStorage.getItem('saldo') || '';
		origen = localStorage.getItem('origen') || '';
        saldo = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(Number(saldo));
  	});
	onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
    let enviarDatos = true;
    function manejarAccion(item){
		if (enviarDatos) {
            if (item.transaccionId) {
                goto(`/voucher?transaccionId=${encodeURIComponent(item.transaccionId)}`);
                return;
            }
			goto(`/voucher2?numero=${item.numero}&nombre=${item.nombre}&monto=${item.monto}&destino=${item.destino}&mensaje=${item.mensaje}&operacion=${item.operacion}&cuenta=${item.cuenta}&banco=${item.banco}&tipo=${item.tipo}&llegada=${item.llegada}&dato1=${item.dato1}&dato2=${item.dato2}&fecha=${item.fecha}&hora=${item.hora}`);
		}
		else{
			eliminarItem(item)
		}
	}
	function eliminarItem(item) {
		historial = historial.filter(elem => elem !== item); // Filtrar la lista para eliminar el elemento
		localStorage.setItem("historial", JSON.stringify(historial)); // Actualizar el localStorage
	}
    function inicio(){
        goto('/home');
    }
	function obtenerSegundaYTercaPalabra(fecha) {
        const palabras = fecha.split(' ');
        return palabras.length >= 3 ? palabras[1] + ' ' + palabras[2] : '';
    }
	function obtenerPrimeraLetra(nombre) {
        // Obtener la primera letra de la primera palabra
        return nombre.charAt(0).toUpperCase();
    }
    function delLast(texto) {
        // Dividir el texto en palabras
        let palabras = texto.split(' ');
        if (palabras.length > 1) {
        palabras.pop();
        return palabras.join(' ');
        }
        return texto;
    }
	function determinarNombre(item){
		if (item.tipo === '1'){
			return 'TRANSFERENCIA BANCARIA EN LINEA'
		}
		else if (item.tipo === '2'){
			return 'TRANSFERENCIA INTERBANCARIA EN LINEA'
		}
		else if (item.tipo === '3'){
			return 'TRANSFERENCIA A ENTIDADES'
		}
		else if (item.tipo === '5'){
			return 'PAGO DE SERVICIO'
		}
	}
	function floatMonto(monto) {
        return monto = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(Number(monto));
    }

    let cci = '';
    let detallesAbiertos = false;
    let avisoCompartir = '';
    onMount(() => { cci = localStorage.getItem('origenInter') || ''; });
    async function compartirCuenta() {
        const texto = ['Ahorro Soles', 'Número de cuenta: ' + origen, cci ? 'Código CCI: ' + cci : ''].filter(Boolean).join('\n');
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Información de la cuenta', text: texto });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(texto);
                avisoCompartir = 'Datos de cuenta copiados.';
            } else {
                avisoCompartir = 'No se puede compartir desde este navegador.';
            }
        } catch (error) {
            if (error.name !== 'AbortError') avisoCompartir = 'No se pudo compartir la cuenta.';
        }
    }
</script>

<div class="account-page">
    <header class="account-header">
        <button class="back-button" aria-label="Volver al inicio" on:click={inicio}>
            <svg viewBox="0 0 24 40" fill="none"><path d="M20 4L4 20L20 36" /></svg>
        </button>
        <h1>Mi cuenta</h1>
    </header>

    <section class="balance-area">
        <div class="balance-card">
            <h2>Ahorro Soles</h2>
            <strong>S/ {saldo || '0.00'}</strong>
            <p>Saldo disponible</p>
        </div>
    </section>

    <main class="account-content">
        <section class="account-information">
            <h2>Información de la cuenta</h2>
            <div class="information-card">
                <button class="share-button" aria-label="Compartir datos de la cuenta" on:click={compartirCuenta}>
                    <svg viewBox="0 0 40 40" fill="none"><path d="M12 20L29 10M12 20L29 30" stroke="currentColor" stroke-width="4" /><circle cx="10" cy="20" r="6" fill="currentColor" /><circle cx="30" cy="9" r="6" fill="currentColor" /><circle cx="30" cy="31" r="6" fill="currentColor" /></svg>
                </button>
                <dl>
                    <div><dt>Número de cuenta</dt><dd>{origen || '—'}</dd></div>
                    <div><dt>Código CCI</dt><dd>{cci || '—'}</dd></div>
                    {#if detallesAbiertos}
                        <div><dt>Tasa de interés anual (TEA)</dt><dd>0.40%</dd></div>
                    {/if}
                </dl>
                <button class="details-button" aria-label={detallesAbiertos ? 'Ocultar detalles' : 'Ver detalles'} aria-expanded={detallesAbiertos} on:click={() => detallesAbiertos = !detallesAbiertos}>
                    <svg viewBox="0 0 40 40" fill="none"><path d="M5 20H35" />{#if !detallesAbiertos}<path d="M20 5V35" />{/if}</svg>
                </button>
            </div>
            {#if avisoCompartir}<p class="share-notice" role="status">{avisoCompartir}</p>{/if}
        </section>

        <section class="movements">
            <h2>Últimos movimientos</h2>
            <div class="movement-list">
                {#each historial as item}
                    <button class="movement-card" on:click={() => manejarAccion(item)}>
                        <span class="movement-description">
                            <span class="movement-title">{item.nombre || (item.mensaje === 'Recibir' ? 'Abono recibido' : 'Cargo')}</span>
                            <span class="movement-date">{item.hora ? (item.fecha || '').split(' ')[0] : (item.fecha || '').replace(/(\d{2}:\d{2}):\d{2}/, '$1')}{item.hora ? ' - ' + item.hora.replace(/(\d{2}:\d{2}):\d{2}/, '$1') : ''}</span>
                        </span>
                        <strong class:credit={item.mensaje === 'Recibir'}>{item.mensaje === 'Recibir' ? '+' : '−'} S/ {floatMonto(item.monto)}</strong>
                    </button>
                {:else}
                    <p class="empty-history">Aún no tienes movimientos.</p>
                {/each}
            </div>
        </section>
    </main>
</div>

<style>
    .account-page { min-height: 100dvh; padding: 0 0 calc(7vw + env(safe-area-inset-bottom, 0px)); box-sizing: border-box; background: #fff; color: #555b65; font-family: 'Roboto', Arial, sans-serif; }
    .account-header { display: flex; align-items: center; gap: 3.8vw; min-height: 18vw; padding: calc(2vw + env(safe-area-inset-top, 0px)) 6vw 0; box-sizing: border-box; background: #fff; }
    .account-header h1 { margin: 0; font-size: 3.3vw; font-weight: 700; line-height: 1.25; }
    .back-button { flex-shrink: 0; width: 3vw; height: 4.5vw; display: grid; place-items: center; background: transparent; color: #777e88; cursor: pointer; }
    .back-button svg { width: 2.6vw; height: 4.2vw; stroke: currentColor; stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }
    .balance-area { margin: 2vw 6vw 0; }
    .balance-card { position: relative; overflow: hidden; padding: 6vw; border: 0; border-radius: 4vw; background: #ed0019 url('/images/home/fondo.svg') center / cover no-repeat; text-align: left; color: #fff; }
    .balance-card h2 { margin: 0; font-size: 3.5vw; color: #fff; font-weight: 500; line-height: 1.3; }
    .balance-card > strong { display: block; margin-top: 5vw; color: #fff; font-size: 8.5vw; line-height: 1.2; overflow-wrap: anywhere; letter-spacing: -.2vw; }
    .balance-card p { margin: 1.5vw 0 0; color: #fff; font-size: 3vw; line-height: 1.3; opacity: .85; }
    .book-balance { display: flex; justify-content: space-between; gap: 3vw; margin: 3vw 0 0; padding: 0 1vw; font-size: 2.8vw; line-height: 1.4; color: #a2a6ae; }
    .book-balance strong { color: #555b65; }
    .account-content { padding: 7vw 6vw 0; }
    .account-content h2 { margin: 0; color: #082630; font-size: 4vw; font-weight: 700; line-height: 1.3; }
    .information-card { position: relative; margin-top: 3vw; padding: 1vw 11vw 4vw 0; border: 0; border-bottom: .25vw solid #e9eaec; border-radius: 0; background: #fff; }
    .information-card dl { margin: 0; }
    .information-card dl > div + div { margin-top: 3vw; }
    .information-card dt { color: #a2a6ae; font-size: 2.8vw; line-height: 1.3; }
    .information-card dd { margin: 1vw 0 0; color: #555b65; font-size: 3.5vw; line-height: 1.4; font-weight: 700; overflow-wrap: anywhere; }
    .share-button, .details-button { position: absolute; display: grid; place-items: center; width: 7.5vw; height: 7.5vw; border-radius: 50%; cursor: pointer; }
    .share-button { right: 0; top: 1vw; background: #fff; color: #00b6dc; }
    .share-button svg { width: 3.7vw; height: 3.7vw; }
    .details-button { bottom: 4vw; right: 0; background: #fff; color: #00b6dc; }
    .details-button svg { width: 3.5vw; height: 3.5vw; stroke: currentColor; stroke-width: 3; stroke-linecap: round; }
    .share-notice { margin: 3vw 0 0; color: #777e88; font-size: 2.8vw; line-height: 1.4; }
    .movements { margin-top: 6vw; }
    .movement-list { margin-top: 3vw; }
    .movement-card { display: flex; align-items: center; justify-content: space-between; gap: 3vw; width: 100%; min-height: 17vw; padding: 3.5vw 0; box-sizing: border-box; margin: 0; border: 0; border-bottom: .2vw solid #e9eaec; border-radius: 0; background: #fff; text-align: left; cursor: pointer; }
    .movement-description { min-width: 0; display: flex; flex-direction: column; gap: 1vw; }
    .movement-title { font-size: 3.4vw; color: #414750; line-height: 1.3; font-weight: 500; overflow-wrap: anywhere; }
    .movement-date { color: #a2a6ae; font-size: 2.7vw; line-height: 1.4; overflow-wrap: anywhere; }
    .movement-card > strong { flex-shrink: 0; font-size: 3.7vw; color: #555b65; line-height: 1.2; font-weight: 700; }
    .movement-card > strong.credit { color: #169a65; }
    .movement-card:hover { background: #fafafa; }
    .empty-history { margin: 0; padding: 7vw 0; border: 0; border-radius: 0; color: #a2a6ae; background: #fff; text-align: left; font-size: 3.2vw; line-height: 1.5; }
    .account-page button:focus-visible { outline: .4vw solid #00b6dc; outline-offset: .5vw; }
</style>
