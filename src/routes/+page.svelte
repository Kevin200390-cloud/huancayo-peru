
<script>
	import './global.css'
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let key='';
	let error='';

    function esDispositivoMovil(userAgent) {
        const palabrasClaveMovil = ['Mobile', 'Android', 'iPhone', 'iPad', 'Windows Phone'];
        return palabrasClaveMovil.some(keyword => userAgent.includes(keyword));
    }

    let esMovil = false;
	let mostrarMensaje = true;
    onMount(() => {
        const userAgent = navigator.userAgent;
        esMovil = esDispositivoMovil(userAgent);
		setTimeout(() => {
			mostrarMensaje = false;
		}, 3000);
	
    });

    onMount(async () => {
        const storedKey = localStorage.getItem('key');
        if (!storedKey) return;
        try {
            const response = await fetch('/api/auth', {
                headers: { key: storedKey }, cache: 'no-store'
            });
            if (response.ok) await goto('/login');
        } catch {
            // Permite introducir una clave si la consulta inicial falla.
        }
    });

    let accediendo = false;
    async function acceder() {
        if (accediendo) return;
        const clave = key.trim();
        if (!clave) {
            error = 'Por favor, ingrese una clave';
            return;
        }
        accediendo = true;
        error = '';
        try {
            const response = await fetch('/api/acceso', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: clave })
            });
            const resultado = await response.json();
            error = resultado.mensaje || 'No se pudo completar el acceso';
            if (response.ok && resultado.success) {
                localStorage.setItem('key', clave);
                await goto('/login');
            }
        } catch {
            error = 'No se pudo completar el acceso. Intenta nuevamente.';
        } finally {
            accediendo = false;
        }
    }
    function CodigoLix(){
        window.location.href = "https://t.me/CodigoLix"
    }
    function srPython(){
        window.location.href = "https://t.me/srPython"
    }
</script>
{#if esMovil}
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="loging">
    <div class="contact">
        <div class="imgdv">
            <div on:click={CodigoLix}></div>
        </div>
        <div>
            <h3>CONTACTANOS</h3>
            <h3>POR TELEGRAM</h3>
            <div>
                <h3>@CodigoLix</h3>
                <h3 style="text-align: right;">@srPython</h3>
            </div>
        </div>
        <div class="imgdv">
            <div on:click={srPython}></div>
        </div>
    </div>
	<div class="cuadro-login flex flex-column align-center justify-center">
		<div class="cont-login">
			<h3 style="text-align: center;">KEY:</h3>
			<input class="input-login" type="text" bind:value={key}>
			<button on:click={acceder} disabled={accediendo}>{accediendo ? 'Verificando...' : 'Acceder'}</button>
		</div>
	</div>
	{#if error}
	<h3 style="position: fixed; bottom: 2vw">{error}</h3>
	{/if}
	{#if mostrarMensaje}
	<div class="pantalla-gris-login" id="flotante-mensaje">
		<img class="logo-inicio" src="/images/caja-logo.svg" alt="">
    </div>
	{/if}
</div>
{/if}

<style>
    .pantalla-gris-login {
		display: flex;
		background-color: #fff;
    }
	.logo-inicio{
		width: 60vw;
		object-fit: contain;
	}
    /*login*/
    .loging{
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #000;
        flex-direction: column;
    }
    .cuadro-login{
        width: 95%;
        height: 80%;
        background-color: transparent;
        background-image: url(/images/anony.png);
        background-size: 90%;
        background-position: center;
        background-repeat: no-repeat;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .cuadro-login h3{
        font-size: 4.5vw;
        font-weight: 600;
        color: #fff;
    }
    .cont-login{
        margin-top: 55vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .input-login{
        margin-top: 2vw;
        padding: 0 3vw;
        color: #000;
        background-color: #fff;
        text-align: center;
        border-radius: 10vw;
        outline: 0;
        border: #000 solid .1vw;
        font-size: 5vw;
        font-weight: 600;
    }
    .input-login::selection{
        background-color: transparent;
    }
    .cont-login button{
        margin-top: 5vw;
        border-radius: 5vw;
        font-size: 4.5vw;
        font-weight: 600;
        color: #000;
        background-color: #cccccc;
    }
    .contact{
        width: 90vw;
        position: absolute;
        top: 0;
        padding: 4vw 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .imgdv{
        border-radius: 50%;
        background-color: #000;
        border: .5vw solid #fff;
    }
    .imgdv > div {
        width: 9vw;
        height: 9vw;
        background-image: url('/images/telegram-black.svg');
        background-position: 45% 52%;
        background-repeat: no-repeat;
        background-size: 60%;
        border-radius: 50%;
        /* background-color: #fff; */
        /* border: .5vw solid #fff; */
    }
    .contact > div:nth-of-type(2) {
        width: 65vw;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .contact > div:nth-of-type(2) > h3{
        font-size: 8vw;
        font-family: monospace;
        width: 100%;
        text-align: center;
        color: #fff;
    }
    .contact h3{
        color: #fff;
    }
    .contact > div:nth-of-type(2) > div{
        width: 93%;
        padding: 2vw 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .contact > div:nth-of-type(2) > div > h3{
        font-size: 4.5vw;
        /* text-transform: uppercase; */
        font-family: monospace;
        width: 100%;
    }
</style>