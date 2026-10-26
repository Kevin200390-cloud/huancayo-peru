<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
	import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    let nombre = '';
	let saldo = '';
	let saldoSec = '';
	let origen = '';
    let historial = [];
    let enviarDatos = true;
	let saldoVisible = true
	onMount(() => {
        if (typeof window !== 'undefined') {
        historial = JSON.parse(localStorage.getItem("historial")) || [];
        historial.reverse();
        nombre = localStorage.getItem('nombre') || '';
        saldo = localStorage.getItem('saldo') || '';
		saldoSec = localStorage.getItem('saldoSec') || '';
		origen = localStorage.getItem('origen') || '';
		saldo = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(Number(saldo));
		saldoSec = Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
        }).format(Number(saldoSec));
        }
  	});
	function obtenerFechaActual() {
    	const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
		const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
		
		const fechaActual = new Date();
		
		const diaSemana = diasSemana[fechaActual.getDay()];
		const diaNumero = fechaActual.getDate();
		const mes = meses[fechaActual.getMonth()];
		const año = fechaActual.getFullYear();
		
		return `${diaSemana}, ${diaNumero} de ${mes} de ${año}`;
	}
	onMount(async () => {
        await verificarAcceso({ actualizar: true, navegar: goto });
    });

	function operaciones(){
		goto('/operaciones');
	}
	function micuenta(){
		goto('/cuenta');
	}
	// function plin(){
	// 	goto('/plin');
	// }
	// function manejarAccion(item){
	// 	if (enviarDatos) {
	// 		goto(`/yapeaste?numero=${item.numero}&nombre=${item.nombre}&monto=${item.monto}&destino=${item.destino}&mensaje=${item.mensaje}&operacion=${item.operacion}&fecha=${item.fecha}`);
	// 	}
	// 	else{
	// 		eliminarItem(item)
	// 	}
	// }
	// function eliminarItem(item) {
	// 	historial = historial.filter(elem => elem !== item); // Filtrar la lista para eliminar el elemento
	// 	localStorage.setItem("historial", JSON.stringify(historial)); // Actualizar el localStorage
	// }
	function movimientos(){
		goto('/cuenta')
	}
	let mostrarNovedades = false;
	function ocultarNovedades() {
		mostrarNovedades = false;
	}
	let ocultarSaldos = false;
	let mostrarTexto = 'Mostrar saldos';
	let mostrarImagen = '/images/ojo-abierto-icon.svg';
	function ocultar() {
		ocultarSaldos = false;
		mostrarTexto = 'Mostrar saldos';
		mostrarImagen = '/images/ojo-abierto-icon.svg';
	}
	function mostrar() {
		ocultarSaldos = true;
		mostrarTexto = 'Ocultar saldos';
		mostrarImagen = '/images/ojo-cerrado-icon.svg';
	}
	const mostrarPreCarga = () => {
        document.getElementById("ventana-desl").style.display = "block";
    };
    const ocultarPreCarga = () => {
        document.getElementById("ventana-desl").style.display = "none";
    };
	function cerrarVentana(){
		ocultarPreCarga();
	}
	function abrirVentana(){
		mostrarPreCarga();
	}
	function celular(){
		goto('/plin')
	}
	function cuentas(){
		goto('/transferir')
	}
	function salir(){
		goto('/login')
	}
	function servicios(){
        goto('/servicios')
    }
	function opciones(){
		goto('/opciones')
	}

    let cuentasAbiertas = false;
    let tarjetasAbiertas = false;
    let panel = '';
    const navegacion = [
        { titulo: 'Inicio', icono: 'inicio-icon.svg', destino: '/home' },
        { titulo: 'Transferencias', icono: 'transferencias-icon.svg', destino: '/transferencias' },
        { titulo: 'Transferir', icono: 'enviar-icon.svg', destino: '/transferir' },
        { titulo: 'Pagos', icono: 'tarjeta-icon.svg', destino: null },
        { titulo: 'Préstamos', icono: 'efectivo-icon.svg', destino: null }
    ];
    function unNombre(valor) {
        return valor.trim().split(/\s+/)[0];
    }
</script>

<div class="home-page">
    <header class="hero">
        <div class="brand-row">
            <button class="menu-button" title="Menú" on:click={opciones}><span></span><span></span><span></span></button>
            <img class="brand-logo" src="/images/caja-logo.svg" alt="" />
        </div>
        <div class="greeting">
            <h1>Hola{nombre ? `, ${nombre.trim()}` : ''}</h1>
            <p>Alcanza tus metas con nosotros</p>
        </div>
        <section class="exchange" aria-labelledby="exchange-title">
            <h2 id="exchange-title">Valor tipo de cambio referencial del día</h2>
            <div class="exchange-card">
                <p class="rates"><strong>Compra: 3.345</strong><span></span><strong>Venta: 3.515</strong></p>
                <p class="exchange-message"><span class="currency-symbol">$</span><span>Tenemos un tipo de cambio <strong>especial para ti</strong></span></p>
                <button class="exchange-button" on:click={() => panel = 'cambio'}>Ir a tipo de cambio</button>
            </div>
        </section>
    </header>

    <div class="quick-actions">
        <button on:click={() => panel = 'frecuentes'}><span class="quick-circle"><img src="/images/home/transferencias-icon.svg" alt="" /></span><span>Operaciones<br />frecuentes</span></button>
        <button on:click={() => tarjetasAbiertas = !tarjetasAbiertas} aria-expanded={tarjetasAbiertas}><span class="quick-circle"><img src="/images/home/tarjeta-icon.svg" alt="" /></span><span>Mis<br />tarjetas</span></button>
    </div>
    <!-- {#if tarjetasAbiertas}
        <section class="card-details"><h2>Mis tarjetas</h2><p>Tarjeta de débito</p><strong>•••• •••• ••••</strong></section>
    {/if} -->

    <main>
        <section class="products" aria-labelledby="products-title">
            <div class="section-heading">
                <h2 id="products-title">Mis productos</h2>
                <button class="visibility-button" title={saldoVisible ? 'Ocultar saldos' : 'Mostrar saldos'} on:click={() => saldoVisible = !saldoVisible} aria-pressed={saldoVisible}>
                    <span class="visibility-icon" aria-hidden="true" style={`--eye-icon: url('${saldoVisible ? '/images/login/ojos-cerrados-icon.svg' : '/images/login/ojos-abiertos-icon.svg'}')`}></span>
                </button>
                <button class="see-all" on:click={micuenta}>Ver todos</button>
            </div>
            <button class="account-card" on:click={micuenta}>
                <span class="account-info"><strong class="account-title">Cuenta de ahorro</strong><span class="account-number">.... .... {origen ? origen.replace(/\D/g, '').slice(-4) : '••••'}</span><span class="balance">S/ <strong>{saldoVisible ? (saldo || '0.00') : '••••'}</strong></span></span>
                <svg class="account-chevron" viewBox="0 0 20 36" fill="none" aria-hidden="true"><path d="M4 4L16 18L4 32" /></svg>
            </button>
        </section>

    </main>

    <nav class="bottom-navigation">
        {#each navegacion as item, i}
            <button class:active={i === 0} class:send-button={i === 2} title={item.titulo} aria-current={i === 0 ? 'page' : undefined} on:click={() => item.destino ? goto(item.destino) : panel = 'prestamos'}>
                <span class="nav-icon"><img src={'/images/footer/' + item.icono} alt="" /></span>
                {#if i !== 2}<span>{item.titulo}</span>{/if}
            </button>
        {/each}
    </nav>
</div>
<!-- 
{#if panel}
    <div class="panel-backdrop">
        <section class="info-panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" tabindex="-1">
            <button class="close-panel" title="Cerrar" on:click={() => panel = ''}>×</button>
            <h2 id="panel-title">{panel === 'cambio' ? 'Tipo de cambio' : panel === 'frecuentes' ? 'Operaciones frecuentes' : 'Préstamos'}</h2>
            {#if panel === 'cambio'}
                <p>Compra: <strong>3.345</strong> · Venta: <strong>3.515</strong></p><p>Valores referenciales del día. Consulta las condiciones y el tipo de cambio vigente con Caja Huancayo.</p>
            {:else if panel === 'frecuentes'}
                {#if historial.length}
                    <div class="history-list">{#each historial.slice(0, 5) as item}<button on:click={micuenta}><span>{item.nombre || 'Operación'}<small>{item.fecha || ''}</small></span><strong>S/ {item.monto || '0.00'}</strong></button>{/each}</div>
                    <button class="panel-action" on:click={micuenta}>Ver movimientos</button>
                {:else}<p>Aún no tienes operaciones guardadas.</p>{/if}
            {:else}
                <p>Consulta los préstamos y sus condiciones con Caja Huancayo.</p>
            {/if}
        </section>
    </div>
{/if}
 -->

<style>
    .home-page { min-height: 100dvh; padding-bottom: calc(27vw + env(safe-area-inset-bottom, 0vw)); background: #f7f8fa; color: #082630; font-family: 'Roboto', Arial, sans-serif; }
    .home-page button, .info-panel button { cursor: pointer; }
    .hero { position: relative; overflow: hidden; height: 100vw; box-sizing: border-box; background: url('/images/home/fondo.svg') center top / 100vw 100vw no-repeat; box-shadow: inset 0 -.3vw 0 #f7f8fa; color: #fff; }
    .hero::after { content: ''; position: absolute; width: 125vw; height: 24vw; bottom: -19vw; left: -12.5vw; border-radius: 50%; background: #f7f8fa; pointer-events: none; }
    .brand-row { position: relative; height: 23.9vw; padding: 5.2vw 6vw 0; box-sizing: border-box; }
    .menu-button { width: 12vw; height: 12vw; border-radius: 50%; background: #ffcdce; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1vw; }
    .menu-button span { width: 4.5vw; height: .5vw; border-radius: 1vw; background: #282b28; }
    .brand-logo { position: absolute; width: 45.5vw; height: 9.3vw; left: 27.2vw; top: 6.5vw; object-fit: contain; filter: brightness(0) invert(1); }
    .greeting { margin: 0 6vw; }
    .greeting h1 { font-size: 5.8vw; line-height: 1.22; font-weight: 700; overflow-wrap: anywhere; }
    .greeting p { margin: 1.5vw 0 0; font-size: 3.7vw; line-height: 1.3; font-weight: 600; }
    .exchange { margin: 5.2vw 6vw 0; text-align: center; }
    .exchange h2 { display: table; position: relative; margin: 0 auto; padding: 1.15vw 2vw 1.4vw; border-radius: 2vw 2vw 0 0; background: #d7f5f7; color: #00b7dc; font-size: 2.95vw; line-height: 1.2; font-weight: 500; }
    .exchange-card { height: 29.6vw; border-radius: 4vw; padding: 4vw 2vw 3.9vw; box-sizing: border-box; background: #ffffffdf; color: #414750; }
    .rates { display: flex; align-items: center; justify-content: center; gap: 2.8vw; margin: 0; font-size: 3.9vw; line-height: 1.2; }
    .rates > span { width: .5vw; height: 4.5vw; background: #414750; }
    .exchange-message { margin: 2.4vw 0 2.3vw; display: flex; justify-content: center; align-items: center; gap: 1.3vw; font-size: 2.95vw; line-height: 1.2; color: #7c838a; white-space: nowrap; }
    .currency-symbol { display: grid; place-items: center; width: 3.9vw; height: 3.9vw; border: .3vw solid #00b7dc; border-radius: 50%; color: #00b7dc; font-size: 3vw; font-weight: 700; }
    .exchange-button { border-radius: 8vw; padding: 1.6vw 4.1vw; color: #fff; background: #ff0000; font-size: 3.9vw; line-height: 1.2; font-weight: 700; }
    .quick-actions { position: relative; display: flex; justify-content: center; gap: 6vw; margin-top: -13.5vw; }
    .quick-actions > button { display: flex; flex-direction: column; align-items: center; gap: 2vw; width: 14vw; background: transparent; color: #7c838a; font-size: 2.3vw; line-height: 1.18; text-align: center; }
    .quick-circle { display: grid; place-items: center; width: 14vw; height: 14vw; border-radius: 50%; background: #fff; box-shadow: 0 1.8vw 2.2vw #1b273c16; }
    .quick-circle img { width: 5.8vw; height: 5.8vw; }
    main { padding: 8.2vw 6vw 0; }
    h2 { font-size: 4.5vw; line-height: 1.2; font-weight: 700; }
    .section-heading { display: flex; align-items: center; gap: 3.4vw; margin-bottom: 4vw; }
    .visibility-button { display: grid; place-items: center; width: 5vw; height: 5vw; background: transparent; color: #082630; }
    .visibility-icon { display: block; width: 4.8vw; height: 4.8vw; background-color: currentColor; mask: var(--eye-icon) center / contain no-repeat; -webkit-mask: var(--eye-icon) center / contain no-repeat; }
    .see-all { margin-left: auto; background: transparent; color: #00b6dc; font-size: 3.5vw; line-height: 1.2; font-weight: 700; }
    .account-card { display: flex; justify-content: space-between; align-items: center; width: 88vw; min-height: 25.3vw; padding: 3.7vw 5.7vw 3.8vw 3.8vw; border: .25vw solid #e9eaec; border-radius: 3.3vw; background: #fff; color: #414750; text-align: left; }
    .account-info { display: flex; flex-direction: column; }
    .account-title { font-size: 3.6vw; line-height: 1.2; }
    .account-number { margin-top: 1.2vw; color: #a0a5ab; font-size: 2.9vw; line-height: 1.2; }
    .balance { margin-top: 2.5vw; font-size: 5.5vw; line-height: 1.15; }
    .account-chevron { width: 2vw; height: 3.5vw; stroke: #a2a7ac; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
    .bottom-navigation { position: fixed; z-index: 10; bottom: 0; left: 0; width: 100vw; height: calc(23.8vw + env(safe-area-inset-bottom, 0vw)); padding: 3vw 2vw calc(10.8vw + env(safe-area-inset-bottom, 0vw)); display: grid; grid-template-columns: 18vw 18vw 24vw 18vw 18vw; box-sizing: border-box; background: #fff; }
    .bottom-navigation button { display: flex; flex-direction: column; align-items: center; gap: 1.4vw; background: transparent; color: #7a828a; font-size: 2.6vw; line-height: 1.2; white-space: nowrap; }
    .nav-icon { display: grid; place-items: center; width: 5.7vw; height: 5.7vw; }
    .nav-icon img { width: 5.7vw; height: 5.7vw; }
    .bottom-navigation button.active { color: #ff0000; font-weight: 500; }
    .bottom-navigation .active img { filter: brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7450%) hue-rotate(3deg) brightness(105%) contrast(120%); }
    .bottom-navigation .send-button { position: relative; top: -9vw; }
    .send-button .nav-icon { width: 12vw; height: 12vw; background: #ff0000; border-radius: 50%; box-shadow: 0 1.3vw 4vw #ff000046; }
    .send-button img { width: 5.5vw; height: 5.5vw; filter: brightness(0) invert(1); }
    .card-details { margin: 4vw 6vw 0; padding: 4vw; border-radius: 3vw; background: #fff; font-size: 3.5vw; }
    .card-details h2 { font-size: 4vw; }
    .panel-backdrop { position: fixed; z-index: 20; inset: 0; display: flex; align-items: center; justify-content: center; background: #08263066; padding: 6vw; }
    .info-panel { position: relative; width: 88vw; padding: 7vw 5vw 5vw; border-radius: 4vw; background: #fff; color: #414750; box-sizing: border-box; font-size: 3.5vw; line-height: 1.5; }
    .info-panel h2 { color: #082630; font-size: 4.5vw; padding-right: 3vw; }
    .close-panel { position: absolute; top: 1vw; right: 3vw; font-size: 7vw; line-height: 1; background: transparent; color: #414750; }
    .history-list { max-height: 60dvh; overflow-y: auto; margin: 3vw 0; }
    .history-list button { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 3vw 0; border-bottom: .2vw solid #e9eaec; background: transparent; text-align: left; font-size: 3.3vw; }
    .history-list small { display: block; font-size: 2.8vw; color: #7c838a; }
    .panel-action { width: 100%; padding: 3vw; border-radius: 7vw; background: #ff0000; color: #fff; font-size: 3.5vw; font-weight: 700; }
    .home-page button:focus-visible, .info-panel button:focus-visible { outline: .4vw solid #00b6dc; outline-offset: .5vw; }
</style>
