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
    let titular = '';
    let random = '';
    let dato1 = '';
    let dato2 = '';
    onMount(() => {
        const numeroAleatorio = Math.floor(Math.random() * 900000) + 100000;
        const numeroFormateado = numeroAleatorio.toString().padStart(6, '0');
        random = numeroFormateado
        titular = localStorage.getItem('nombre') || ''
        origen = localStorage.getItem('origen') || '';
        historial = JSON.parse(localStorage.getItem("historial")) || [];
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
        if (urlParams.has('fecha')) {
            fecha = urlParams.get('fecha');
        }
        if (urlParams.has('hora')) {
            hora = urlParams.get('hora');
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
        if (urlParams.has('operacion')) {
            operacion = urlParams.get('operacion');
        }
        if (urlParams.has('destino')) {
            destino = urlParams.get('destino');
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
    });
    function botonequis(){
        goto('/home');
    }
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
    function inicio(){
        goto('/home');
    }
    function operaciones(){
        goto('/transferir')
    }
    function plin(){
        goto('/plin')
    }
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
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="divprincipal">
	<div class="divbienvenida" style="box-shadow: none; justify-content: flex-end">
		<button>
		    <img class="imgcampana" style="height: 5vw; object-fit: contain;" src="/images/compartir-icon.svg" alt=""/>		    
        </button>
	</div>
    {#if tipo == '3'}
    <div class="contenedorproductosn">
        <div class="logocheck">
        </div>
    </div>
    <h3 class="textpagoexitoso" style="color: #219a8a">¡Gracias, {primeraPalabra(titular)}!</h3>
    <h3 style="color: #9d9ca1; margin-top: 2vw; font-size: 4vw; font-weight: 500; text-align: center">La operación fue realizada con éxito</h3>
    
    <div style="display: flex; justify-content:center">
        <div style="width: 85%; border: #243744 .3vw solid; border-radius: 3vw; padding: 3vw 4vw; margin-top: 4vw">
            <div style="display: flex; justify-content: space-between; flex-direction: row;">
                <h3 style="color: #243744; font-size: 3.6vw; font-weight: 500;">Nro. operación: {operacion}</h3>
                <h3 style="color: #243744; font-size: 3.6vw; font-weight: 500">{fecha}</h3>
            </div>
            <h3 style="text-align: center; font-size: 8vw; font-weight: 500; color: #243744; padding: 3vw 0;">S/ {floatMonto(monto)}</h3>
            <div>
                <div class="vDivDatos">
                    <h3>Entidad destino:</h3>
                    <h3>{destino}</h3>
                </div>
                <div class="vDivDatos">
                    <h3>Beneficiario:</h3>
                    <h3 style="text-transform: uppercase;">{nombre}</h3>
                </div>
                <div class="vDivDatos">
                    <h3>Nro. celular:</h3>
                    <h3>{numero}</h3>
                </div>
                <div class="vDivDatos">
                    <h3>Cuenta origen:</h3>
                    <h3>{origen}</h3>
                </div>
                <div class="vDivDatos" style="padding: 1vw 0">
                    <div></div>
                    <img src="/images/banco-nacion-logo.svg" alt="">
                </div>
                <div class="vDivDatos">
                    <h3>Comisión:</h3>
                    <h3>Gratis</h3>
                </div>
                <div class="vDivDatos">
                    <h3>Monto cargado:</h3>
                    <h3>S/ {floatMonto(monto)}</h3>
                </div>
                <div class="vDivDatos">
                    <h3>Nro. transferencia:</h3>
                    <h3>000000000{random}</h3>
                </div>
            </div>
        </div>
    </div>
    {/if}
    {#if tipo == '1'}
    <div class="contenedorproductosn">
        <div class="logocheck">
        </div>
    </div>
    <h3 class="textpagoexitoso" style="color: #219a8a">¡Gracias, {primeraPalabra(titular)}!</h3>
    <h3 style="color: #9d9ca1; margin-top: 2vw; font-size: 4vw; font-weight: 500; text-align: center">Tu operación fue realizada con éxito</h3>
    <div style="display: flex; justify-content:center">
        <div class="vClouce" style="width: 90%;">
            <div style="border-bottom: solid 0.1vw #e5e5e5; margin-top:3vw; width:100%"></div>
            <div style="display: flex; justify-content: space-between; flex-direction: row; padding: 4vw 0">
                <h3 style="color: #243744;">Nro. operación: {operacion}</h3>
                <h3 style="font-size: 3.6vw; font-weight: 500; padding: 0">{fecha}</h3>
            </div>
            <div>
                <h3 style="font-size: 3.6vw; padding-bottom: 2vw">Monto transferido</h3>
                <h2>S/ {floatMonto(monto)}</h2>
            </div>
            <div>
                <h3 style="padding-top: 4vw;">Desde mi cuenta de ahorro soles</h3>
                <h3>{origen}</h3>
            </div>
            <div>
                <h3>Hacia el nro. de cuenta</h3>
                <h3 style="text-transform: uppercase;">{cuenta}</h3>
            </div>
            <div>
                <h3>Beneficiario</h3>
                <h3 style="text-transform: uppercase;">{nombre}</h3>
            </div>
            <div>
                <h3 style="color: #219a8a;">Nro. de transferencia</h3>
                <h3>000000000{random}</h3>
            </div>
        </div>
    </div>
    <!-- {#if llegada == '1'}
    <h3 class="textformainmediata">de forma inmediata</h3>
    <div class="borderline1"></div>
    <h3 class="texttiempodemora">Tu transferencia inmediata se realizará en<br><b>10 minutos</b> como máximo.</h3>
    {:else}
    <h3 class="textformainmediata">de forma diferida</h3>
    <div class="borderline1"></div>
    <h3 class="texttiempodemora">Esta transferencia se realizará en<br><b>2 días útiles</b> como máximo.</h3>
    {/if} -->
    {/if}
    {#if tipo == '2'}
    <div class="contenedorproductosn">
        <div class="logocheck">
        </div>
    </div>
    <h3 class="textpagoexitoso" style="color: #219a8a">¡Gracias, {primeraPalabra(titular)}!</h3>
    <h3 style="color: #9d9ca1; margin-top: 2vw; font-size: 4vw; font-weight: 500; text-align: center">Tu operación fue realizada con éxito</h3>
    <div style="display: flex; justify-content:center">
        <div class="vClouce" style="width: 90%;">
            <div style="border-bottom: solid 0.1vw #e5e5e5; margin-top:3vw; width:100%"></div>
            <div style="display: flex; justify-content: space-between; flex-direction: row; padding: 4vw 0">
                <h3 style="color: #243744;">Nro. operación: {operacion}</h3>
                <h3 style="font-size: 3.6vw; font-weight: 500; padding: 0">{fecha}</h3>
            </div>
            <div>
                <h3 style="font-size: 3.6vw; padding-bottom: 2vw">Monto transferido</h3>
                <h2>S/ {floatMonto(monto)}</h2>
            </div>
            <div class="vClouceComi" style="width: 100%; display: flex; justify-content: space-between; flex-direction: row; padding: 5vw 0">
                <div style="width: 50%">
                    <h3>Comisión</h3>
                    <h3>ITF</h3>
                    <h3 style="color: #243744">Cargo en cuenta</h3>
                </div>
                <div style="width: 50%">
                    <h3>S/ 0.00</h3>
                    <h3>S/ 0.00</h3>
                    <h3 style="color: #243744">S/ {floatMonto(monto)}</h3>
                </div>
            </div>
            <div>
                <h3>Desde mi cuenta de ahorro soles</h3>
                <h3>{origen}</h3>
            </div>
            <div>
                <h3>Hacia el nro. de CCI</h3>
                <h3 style="text-transform: uppercase;">{cuenta}<br>{banco}</h3>
            </div>
            <div>
                <h3>Beneficiario</h3>
                <h3 style="text-transform: uppercase;">{nombre}</h3>
            </div>
            <div>
                <h3 style="color: #219a8a;">Nro. de transferencia</h3>
                <h3>000000000{random}</h3>
            </div>
        </div>
    </div>
    <!-- {#if llegada == '1'}
    <h3 class="textformainmediata">de forma inmediata</h3>
    <div class="borderline1"></div>
    <h3 class="texttiempodemora">Tu transferencia inmediata se realizará en<br><b>10 minutos</b> como máximo.</h3>
    {:else}
    <h3 class="textformainmediata">de forma diferida</h3>
    <div class="borderline1"></div>
    <h3 class="texttiempodemora">Esta transferencia se realizará en<br><b>2 días útiles</b> como máximo.</h3>
    {/if} -->
    {/if}
    {#if tipo == '5'}
    <div class="contenedorproductosn">
        <div class="logocheck">
        </div>
    </div>
    <h3 class="textpagoexitoso" style="color: #219a8a">¡Gracias, {primeraPalabra(titular)}!</h3>
    <h3 style="color: #9d9ca1; margin-top: 2vw; font-size: 4vw; font-weight: 500; text-align: center">Tu operación fue realizada con éxito</h3>
    <div style="display: flex; justify-content:center">
        <div class="vClouce" style="width: 90%;">
            <div style="border-bottom: solid 0.1vw #e5e5e5; margin-top:3vw; width:100%"></div>
            <div style="display: flex; justify-content: space-between; flex-direction: row; padding: 4vw 0">
                <h3 style="color: #243744;">Nro. operación: {operacion}</h3>
                <h3 style="font-size: 3.6vw; font-weight: 500; padding: 0">{fecha}</h3>
            </div>
            <div>
                <h3 style="font-size: 3.6vw; padding-bottom: 2vw">Monto pagado</h3>
                <h2>S/ {floatMonto(monto)}</h2>
            </div>
            <div>
                <h3 style="padding-top: 4vw;">Desde mi cuenta de ahorro soles</h3>
                <h3>{origen}</h3>
            </div>
            <div>
                <h3>Servicio</h3>
                <h3 style="text-transform: uppercase;">{nombre}</h3>
            </div>
            <div>
                <h3>Documento</h3>
                <h3 style="text-transform: uppercase;">{dato1}</h3>
            </div>
            <div>
                <h3>Empresa</h3>
                <h3 style="text-transform: uppercase;">{dato2}</h3>
            </div>
            <div>
                <h3 style="color: #219a8a;">Nro. de transferencia</h3>
                <h3>00000{random}</h3>
            </div>
        </div>
    </div>
    {/if}
    <div class="divlastresumen">
        <button on:click={inicio} class="botonyapearya" style="background-color: #219a8a;">Confirmar</button>
    </div>
</div>
<style>
    .vDivDatos{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 2vw 0;
    }
    .vDivDatos h3:nth-last-of-type(1){
        font-size: 4vw;
        font-weight: 500;
        color: #243744;
        text-align: left;
        width: 60%;
        margin-left: 2vw;
    }
    .vDivDatos h3:nth-last-of-type(2){
        font-size: 3.6vw;
        font-weight: 400;
        color: #96b3af;
        text-align: right;
        width: 40%;
    }
    .vDivDatos div{
        width: 40%;
    }
    .vDivDatos img{
        width: 35vw;
        height: 7.5vw;
        object-fit: contain;
    }
</style>