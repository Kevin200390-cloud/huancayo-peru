<script>
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import { goto as navegar } from '$app/navigation';
    import { crearControlCarga } from '$lib/loading.js';
    const { mostrarCarga, ocultarCarga, ir: goto } = crearControlCarga(navegar);
    import { onMount } from 'svelte';
    import axios from '$lib/api.js';
    let nombre = '';
    let monto = '';
    let vence = '';
    let dato1= '';
    let dato2= '';
    let tipo = '5'
    let operacion = ''
    async function siguiente(){
        mostrarPreCarga();
        const numeroAleatorio = Math.floor(Math.random() * 900000) + 100000;
        const numeroFormateado = numeroAleatorio.toString().padStart(6, '0');
        operacion = '0'+ numeroFormateado
        // monto = Intl.NumberFormat('en-US', {
        //     minimumFractionDigits: 2,
        // }).format(Number(monto));
        goto (`/confirmar?nombre=${nombre}&monto=${monto}&tipo=${tipo}&dato1=${dato1}&dato2=${dato2}`);
        ocultarPreCarga();
    }
    const mostrarPreCarga = () => {
        mostrarCarga("flotante-mensaje");
    };
    const ocultarPreCarga = () => {
        ocultarCarga("flotante-mensaje");
    };
</script>

<div class="divprincipal">
	<div class="divbienvenida">
        <h2>Servicios</h2>
	</div>
    <div class="contenedorproductos">
        <div class="boxproductos">
            <h3 class="tDescript">Servicio</h3>
            <div class="tBorderInput">
                <input required bind:value={nombre} placeholder="Servicio">
            </div>
            <h3 class="tDescript">Recibo</h3>
            <div class="tBorderInput">
                <h3 style="font-size: 5vw; font-weight: 500; margin-right: 1vw">S/ </h3>
                <input required bind:value={monto} placeholder="0.00" type="number">
            </div>
            <h3 class="tDescript">Ingresa el número de cuenta de destino</h3>
            <div class="tBorderInput">
                <input required maxlength="25" bind:value={dato1} placeholder="Dato 1">
            </div>
            <div class="tBorderInput">
                <input required maxlength="25" bind:value={dato2} style="margin-top: 2vw;" placeholder="Dato 2">
            </div>	
        </div>
    </div>
    <div class="divlastresumen">
        <button disabled="{monto <= 0}" on:click={siguiente} class="botonyapearya">Siguiente</button>
    </div>
    <div class="pantalla-gris-login" id="flotante-mensaje">
        <div class="cuadro-loading">
            <div class="loading"></div>
        </div>
    </div>
</div>
<style>
	.divbienvenida{
        justify-content: center;
    }
    .divlastresumen{
        display: flex;
        justify-content: center;
    }
    .tDescript{
        color: #9d9ca1;
        font-weight: 500;
        padding: 4vw 0 4vw 0;
    }
    .tBorderInput{
        border-bottom: .6vw solid #cccccc;
        padding: 1vw 0;
        /*/(1)/*/
        display: flex;
        justify-content: start;
        align-items: center;
    }
    .tBorderInput input{
        border: 0;
        color: #28384c;
        font-weight: 500;
        outline: 0;
        font-size: 5vw;
    }
    .tBorderInput input::placeholder{
        border: 0;
        color: #b8b8b8;
        font-weight: 400;
        outline: 0;
    }
</style>