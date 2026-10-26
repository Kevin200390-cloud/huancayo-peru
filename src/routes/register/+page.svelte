<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    let nombre = '';
    let saldo = '';
    let origen = '';
    let origenInter = '';
    let clave = '';
    let correo = '';

    function guardarDatos() {

        localStorage.setItem('nombre', nombre);
        localStorage.setItem('saldo', saldo);
        localStorage.setItem('origen', origen);
        localStorage.setItem('origenInter', origenInter);
        localStorage.setItem('clave', clave);
        if(correo && validarCorreo(correo)){
            localStorage.setItem('correo', correo);
        }
        goto('/login');
    }
    function validarCorreo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    }
    function borrarHistorial(){
        localStorage.removeItem('historial');
    }
    onMount(() => {
        nombre = localStorage.getItem('nombre') || '';
        saldo = localStorage.getItem('saldo') || '';
        origen = localStorage.getItem('origen') || '';
        origenInter = localStorage.getItem('origenInter') || '';
        clave = localStorage.getItem('clave') || '';
        correo = localStorage.getItem('correo') || '';
    });
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
</script>

<div class="register-page">
    <header class="register-header">
        <div class="register-header-row">
            <button class="header-button back-button" on:click={() => goto('/login')}>
                <img src="/images/menu/atras-icon.svg" alt="" class="arrow-back" />
            </button>
            <h1>Crear una cuenta</h1>
        </div>
        <p>Configura tus datos y las cuentas que quieres ver en Inicio.</p>
    </header>

    <main class="register-content">
        <section class="form-card" aria-labelledby="profile-title">
            <div class="section-heading">
                <div><h2 id="profile-title">Tus datos</h2><p>Información de tu perfil</p></div>
            </div>
            <div class="field">
                <label for="nombre">Nombre</label>
                <input id="nombre" bind:value={nombre} maxlength="30" autocomplete="name" placeholder="Nombre y apellido" />
            </div>
            <div class="field">
                <label for="clave">Clave</label>
                <input id="clave" bind:value={clave} maxlength="15" type="tel" autocomplete="off" placeholder="Ingresa tu clave" />
            </div>
        </section>

        <section class="form-card" aria-labelledby="account-title">
            <div class="section-heading">
                <div><h2 id="account-title">Cuenta</h2></div>
            </div>
            <div class="field">
                <label for="cuenta">Número de cuenta</label>
                <input id="cuenta" bind:value={origen} type="tel" maxlength="15" placeholder="Ingrese su numero de cuenta" />
            </div>
            <div class="field">
                <label for="cuenta">Número de cuenta interbancaria</label>
                <input id="cuenta" bind:value={origenInter} type="tel" maxlength="20" placeholder="Ingrese su numero de cuenta interbancaria" />
            </div>
            <div class="field">
                <label for="saldo">Saldo</label>
                <div class="currency-input"><span>S/</span><input id="saldo" bind:value={saldo} type="number" step="0.01" placeholder="0.00" /></div>
            </div>
        </section>

        <div class="form-actions">
            <button class="primary-button" on:click={guardarDatos}>Registrar</button>
            <button class="clear-button" on:click={borrarHistorial}>Borrar historial</button>
        </div>
    </main>
</div>

<style>
    .register-page {
        min-height: 100vh;
        min-height: 100dvh;
        background: #f5f7fa;
        color: #14243c;
        font-family: "Poppins", "Segoe UI", sans-serif;
    }
    .register-header {
        background: #ff0000;
        padding: 4vw 6vw 11vw;
        color: #fff;
    }
    .register-header h1 { margin: 2.051vw 0; font-size: 6.2vw; line-height: 1.25; font-weight: 600; text-align: left; }
    .register-header-row { display: flex; align-items: center; gap: 3.077vw; }
    .header-button { display: flex; align-items: center; justify-content: center; flex: 0 0 11.282vw; height: 11.282vw; background: transparent; cursor: pointer; }
    .arrow-back { width: auto; height: 6vw; object-fit: contain; transform: rotate(180deg); filter: brightness(0) invert(1); }
    .header-button:focus-visible { outline: 0.513vw solid #fff; outline-offset: 0.769vw; border-radius: 2.051vw; }
    .register-header p { font-size: 3.39vw; line-height: 1.65; }
    .register-content { width: 100%; box-sizing: border-box; margin: -5.641vw auto 0; position: relative; padding: 0 4.615vw calc(6.154vw + env(safe-area-inset-bottom, 0vw)); }
    .form-card { padding: 5.641vw; margin-bottom: 4.103vw; border-radius: 5.128vw; background: #fff; box-shadow: 0 1.026vw 5.128vw #14243c06; border: 0.256vw solid #e9edf2; }
    .section-heading { display: flex; align-items: center; gap: 3.077vw; margin-bottom: 5.641vw; }
    .form-card h2 { margin: 0; font-size: 4.159vw; font-weight: 600; line-height: 1.5; }
    .section-heading p { color: #7a8493; font-size: 2.877vw; margin-top: 0.513vw; line-height: 1.5; }
    .field + .field { margin-top: 4.359vw; }
    .field label { font-size: 2.877vw; font-weight: 500; color: #657184; margin-bottom: 1.795vw; }
    .field > input, .currency-input { width: 100%; height: 12.821vw; border: 0.256vw solid #dfe5ed; border-radius: 3.077vw; background: #fafbfd; box-sizing: border-box; }
    .field input { min-width: 0; padding: 0 3.59vw; font-size: 3.903vw; font-weight: 500; color: #14243c; font-family: inherit; outline: none; }
    .field input::placeholder { color: #a1aaba; font-weight: 400; }
    .field > input:focus, .currency-input:focus-within { border-color: #0039a6; box-shadow: 0 0 0 0.769vw #0039a60d; }
    .currency-input { display: flex; align-items: center; }
    .currency-input span { padding-left: 3.59vw; font-size: 3.646vw; color: #657184; }
    .currency-input input { flex: 1; width: 100%; height: 100%; border: 0; background: transparent; }

    .form-actions { display: flex; flex-direction: column; gap: 3.077vw; padding-top: 1.538vw; }
    .form-actions button { width: 100%; min-height: 13.333vw; border-radius: 3.59vw; font-family: inherit; font-size: 3.646vw; font-weight: 600; cursor: pointer; }
    .primary-button { background: #00b1d8; color: #fff; box-shadow: 0 1.026vw 3.077vw #0039a620; }
    .clear-button { background: transparent; color: #657184; border: 0.256vw solid #dfe5ed; }
    .form-actions button:focus-visible { outline: 0.513vw solid #00b1d8; outline-offset: 0.769vw; }
</style>
