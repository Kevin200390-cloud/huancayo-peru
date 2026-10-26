<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
	import { goto } from '$app/navigation';
    import '../global.css'
	import { onMount } from 'svelte';
    

    let pin = '';
    let errorPin = '';
    let claveVisible = false;
    let panel = '';
    let dialogo;
    function abrirPanel(valor) {
        panel = valor;
        dialogo.showModal();
    }
    function comprobarPin() {
        if (pin.length < 6 || pin.length > 14) return;
        if (pin === localStorage.getItem('clave')) {
            goto('/home');
        } else {
            errorPin = 'Clave incorrecta. Inténtalo nuevamente.';
            pin = '';
        }
    }
    let nombre = ''
    onMount(() => {
        if (!localStorage.getItem('clave')){
            goto('/register')
        }
        nombre = localStorage.getItem('nombre') || '';
    });

    function cerrar() {
		document.getElementById('flotante').style.display = 'none'
    }
    function registrar(){
		goto('/register')
	}
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
    function unNombre(nombre){
        const palabras = nombre.split(' ');
        return palabras[0]
    }
</script>

<div class="login-page">
    <header class="login-hero">
        <div class="brand-row">
            <button type="button" class="menu-button" title="Menú" on:click={() => goto('/opciones')}><span></span><span></span><span></span></button>
            <img class="brand-logo" src="/images/caja-logo.svg" alt="Caja Huancayo, La Caja del Perú" />
        </div>
        <div class="greeting">
            <h1>Hola{nombre ? `, ${nombre.trim()}.` : '.'}</h1>
            <p>Qué bueno verte por aquí</p>
        </div>
    </header>

    <main>
        <form class="login-card" on:submit|preventDefault={comprobarPin}>
            <h2>Accede a tu banca digital</h2>
            <p class="subtitle">De forma rápida y segura</p>
            <div class="password-field">
                <input id="clave-web" type={claveVisible ? 'text' : 'password'} value={pin} on:input={(event) => { pin = event.currentTarget.value; errorPin = ''; }} minlength="6" maxlength="14" autocomplete="current-password" placeholder="Clave web" title="Clave web de 6 a 14 caracteres" aria-describedby="password-message" required />
                <button type="button" class="visibility-button" title={claveVisible ? 'Ocultar clave' : 'Mostrar clave'} aria-pressed={claveVisible} on:click={() => claveVisible = !claveVisible}>
                    <img src={claveVisible ? '/images/login/ojos-cerrados-icon.svg' : '/images/login/ojos-abiertos-icon.svg'} alt="" />
                </button>
            </div>
            <p id="password-message" class="password-message" class:message-hidden={(pin.length === 0 || pin.length >= 6) && !errorPin} role="status">{errorPin || 'La contraseña debe tener al menos 6 caracteres'}</p>
            <button type="submit" class="enter-button" disabled={pin.length < 6 || pin.length > 14}>Ingresar</button>
        </form>

        <nav class="quick-links">
            <button type="button" on:click={() => abrirPanel('bloquear')}><span class="quick-circle"><img src="/images/login/tarjeta-icon.svg" alt="" /></span><span>Bloquear<br />tarjeta</span></button>
            <button type="button" on:click={() => abrirPanel('token')}><span class="quick-circle"><img src="/images/login/candado-icon.svg" alt="" /></span><span>Token digital</span></button>
            <button type="button" on:click={() => abrirPanel('ubicacion')}><span class="quick-circle"><img src="/images/login/ubicacion-icon.svg" alt="" /></span><span>Ubícanos<br />rápido y fácil</span></button>
        </nav>
        <button type="button" class="login-help" on:click={registrar}>¿Problemas para ingresar?</button>
        <p class="version">v2.0.5</p>
    </main>
</div>

<dialog class="shortcut-dialog" bind:this={dialogo} aria-labelledby="shortcut-title">
    <form method="dialog"><button class="close-dialog" title="Cerrar">×</button></form>
    <h2 id="shortcut-title">{panel === 'bloquear' ? 'Bloquear tarjeta' : panel === 'token' ? 'Token digital' : 'Ubícanos'}</h2>
    <p>{panel === 'bloquear' ? 'Solicita el bloqueo de tu tarjeta a través de los canales de atención de Caja Huancayo.' : panel === 'token' ? 'Consulta la activación de tu token digital con Caja Huancayo.' : 'Consulta las oficinas y los horarios de atención a través de los canales oficiales de Caja Huancayo.'}</p>
</dialog>

<style>
    .login-page { min-height: 100dvh; padding-bottom: calc(6vw + env(safe-area-inset-bottom, 0vw)); background: #fdfdfd; color: #454b55; font-family: 'Roboto', Arial, sans-serif; box-sizing: border-box; }
    .login-page button { cursor: pointer; }
    .login-hero { position: relative; height: 85.2vw; overflow: hidden; background: #ff0000 url('/images/login/fondo-login.png') center top / 100vw auto no-repeat; color: #fff; box-shadow: inset 0 -.3vw 0 #fdfdfd; }
    .login-hero::after { content: ''; position: absolute; width: 125vw; height: 24vw; bottom: -19vw; left: -12.5vw; border-radius: 50%; background: #fdfdfd; pointer-events: none; }
    .brand-row { position: relative; height: 24.8vw; padding: 4.7vw 6vw 0; box-sizing: border-box; }
    .menu-button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1vw; width: 12vw; height: 12vw; border-radius: 50%; background: #ffcdce; }
    .menu-button span { width: 4.5vw; height: .5vw; border-radius: 1vw; background: #282b28; }
    .brand-logo { position: absolute; left: 27.2vw; top: 6.1vw; width: 45.5vw; height: 9.3vw; object-fit: contain; filter: brightness(0) invert(1); }
    .greeting { margin: 0 6vw; }
    .greeting h1 { font-size: 5.8vw; line-height: 1.22; font-weight: 700; overflow-wrap: anywhere; }
    .greeting p { margin: 1.7vw 0 0; font-size: 3.8vw; line-height: 1.3; font-weight: 400; }
    main { position: relative; margin-top: -24.9vw; }
    .login-card { width: 88vw; min-height: 65.6vw; margin: 0 6vw; padding: 9vw 5.7vw 8.8vw; border: .25vw solid #f1f1f1; border-radius: 3.5vw; box-sizing: border-box; background: #fdfdfd; text-align: center; }
    .login-card h2 { margin: 0; font-size: 4vw; line-height: 1.2; font-weight: 700; }
    .subtitle { margin: 1.2vw 0 4vw; color: #a1a4aa; font-size: 3.5vw; line-height: 1.3; }
    .password-field { position: relative; width: 100%; height: 13.1vw; border: .25vw solid #d6d7da; border-radius: 5.4vw; box-sizing: border-box; overflow: hidden; }
    .password-field:focus-within { border-color: #8e949c; }
    .password-field input { width: 100%; height: 100%; padding: 0 12vw 0 3.9vw; background: transparent; color: #454b55; font-family: inherit; font-size: 3.3vw; font-weight: 500; outline: none; }
    .password-field input::placeholder { color: #a1a4aa; opacity: 1; }
    .visibility-button { position: absolute; right: 3.3vw; top: 0; width: 7vw; height: 100%; display: grid; place-items: center; background: transparent; }
    .visibility-button img { width: 5.4vw; height: 5.4vw; object-fit: contain; opacity: .24; }
    .password-message { min-height: 4vw; margin: 1vw 0 3.7vw; color: #ff0014; font-size: 3.15vw; line-height: 1.25; text-align: left; }
    .message-hidden { visibility: hidden; }
    .enter-button { display: block; width: 57.8vw; height: 12vw; margin: 0 auto; border-radius: 5.3vw; background: #ff0000; color: #fff; font-size: 4vw; line-height: 1.2; font-weight: 700; }
    .enter-button:disabled { background: #e9e9eb; color: #a6a8ae; cursor: default; }
    .quick-links { display: flex; justify-content: center; gap: 6vw; margin-top: 4vw; }
    .quick-links button { display: flex; flex-direction: column; align-items: center; gap: 2vw; width: 14vw; background: transparent; color: #7c838a; font-size: 2.3vw; line-height: 1.18; white-space: nowrap; }
    .quick-links button:nth-child(2) { padding-top: 1.3vw; }
    .quick-circle { display: grid; place-items: center; width: 14vw; height: 14vw; border-radius: 50%; background: #fff; box-shadow: 0 1vw 3vw #20263012; }
    .quick-circle img { width: 5.8vw; height: 5.8vw; object-fit: contain; }
    .login-help { display: block; margin: 8.2vw auto 0; padding: 0; background: transparent; color: #ff0000; font-size: 4vw; line-height: 1.25; font-weight: 700; }
    .version { margin: 9.8vw 0 0; color: #7c838a; font-size: 3vw; line-height: 1.3; text-align: center; }
    .login-page button:focus-visible, .shortcut-dialog button:focus-visible { outline: .4vw solid #00b6dc; outline-offset: .5vw; }
    .shortcut-dialog { position: fixed; inset: 0; width: 88vw; max-width: 88vw; padding: 6vw; border: 0; border-radius: 3.5vw; background: #fff; color: #454b55; box-sizing: border-box; font-family: 'Roboto', Arial, sans-serif; }
    .shortcut-dialog::backdrop { background: #08263066; }
    .shortcut-dialog h2 { padding-right: 4vw; font-size: 4.5vw; line-height: 1.2; }
    .shortcut-dialog p { margin: 3vw 0 0; font-size: 3.5vw; line-height: 1.5; }
    .close-dialog { position: absolute; right: 3vw; top: 1vw; background: transparent; color: #454b55; font-size: 7vw; cursor: pointer; }
</style>
