<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import data from './entities.json'
    import { goto  } from '$app/navigation';
    import { onMount } from 'svelte';
    import axios from '$lib/api.js';
    let nombre = '';
    let banco = 'NACION'
    let cuenta = ''
    let botonActivo = 'Yape'
    let success = false
    let error = ''
    let tipo = 'NACION'
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
    function atras(){
        goto('/home')
    }
    const mostrarCambio = () => {
        document.getElementById("cambiarDestino").style.display = "flex";
    };
    function ocultarCambio (){
        document.getElementById("cambiarDestino").style.display = "none";
    };
    const mostrarPreCarga = () => {
        document.getElementById("flotante-mensaje").style.display = "flex";
        document.getElementById("confirmar").style.display = "none";
    };
    function ocultarPreCarga (){
        document.getElementById("flotante-mensaje").style.display = "none";
    };
    const confirmarDatos = () => {
        document.getElementById("confirmar").style.display = "flex";
    };
    function cerrarDatos (){
        document.getElementById("confirmar").style.display = "none";
    };
    function yape(){
        destino = 'Yape'
        botonActivo = 'Yape'
    }
    function plin(){
        destino = 'Plin'
        botonActivo = 'Plin'
    }
    function verificarCuenta() {
        const cuentaCodigo = cuenta.slice(0, 3);
        const entidad = data.financial_entities.find(ent => ent.code === cuentaCodigo);
        if (entidad) {
            banco = entidad.name;
            if(banco == 'NACION'){
                tipo = 'NACION';
            } else{
                tipo = 'INTERBANCARIO';
            }
        } else{
            tipo = 'NACION';
            banco = 'NACION'
        }
    }
    function handlePaste(event){
        setTimeout(()=> verificarCuenta(), 10);
    }
    function validarNombre(nombre) {
        const palabras = nombre.trim().split(/\s+/);
        if (palabras.length < 2) {
            return 'El nombre debe contener al menos dos palabras';
        }
        // if (!/^[A-Za-z\s]+$/.test(nombre)) {
        //     return 'El nombre solo debe contener letras y espacios';
        // }
        return '';
    }
    async function guardar(){
        confirmarDatos();
        error = '';
        success = false;
        const errorNombre = validarNombre(nombre);
        if (errorNombre) {
            mostrarPreCarga();
            error = errorNombre;
            return;
        }
        // limpiarNumero();
        // if (numero.length !== 9) {
        //     mostrarPreCarga();
        //     error = 'El número debe contener exactamente 9 dígitos';
        //     return;
        // }
        // if (!numero.startsWith('9')) {
        //     mostrarPreCarga();
        //     error = 'El número debe comenzar con el dígito 9';
        //     return;
        // }
        const user = localStorage.getItem('key');
        
        if (!user) {
            mostrarPreCarga();
            error = 'El usuario no está permitido para agregar números.';
            return;
        }
        try {

            const response = await axios.post(`${API_BASE_URL}/agregar_cuenta`, {
                cuenta,
                nombre,
                banco,
                user
            }, {
                headers: {

                'Content-Type': 'application/json'
                }
            });

            const result = response.data;
            // console.log('Respuesta del servidor:', JSON.stringify(result, null, 2));
            if (result.success) {
                success = true;
                error = '';
                mostrarPreCarga();
                // console.log('Agregado correctamente');
            } else {
                error = result.mensaje_error || 'Ocurrió un error al agregar el número';
                mostrarPreCarga();
                // console.log('Mensaje_error');
            }
        } catch (err) {
            // console.log('Error: '+err.response);
            // console.log('No agregado correctamente');
            mostrarPreCarga();
            if (err.response && err.response.data) {
                error = err.response.data.mensaje_error;
            } else {
                error = 'Error al procesar la solicitud';
            }
        }
    }
    function aceptar(){
        ocultarPreCarga();
    }
    function cerrar(){
        ocultarPreCarga();
    }
    function cambio() {
        goto('/addqr')
    };
    function cerrarCambio(){
        ocultarCambio()
    }
    // 0096028

</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
 <!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="registro">
    <div class="divcriz">
        <button on:click={atras} class="botonatrasya1"></button>
        <h3 class="h3bien2">Agregar cuenta</h3>
        <button on:click={atras} class="botonatrasya2"></button>
    </div>
    <div class="divcentertop">
        <div class="divofitop">
            <div class="boxContacto">
                <h3>Nombre</h3>
                <input bind:value={nombre} maxlength="100" class="inputcodser" placeholder="Ingresa nombres "/>
            </div>
            <div class="boxContacto">
                <h3>Número de cuenta</h3>
                <input bind:value={cuenta} on:paste={handlePaste} on:change={verificarCuenta} on:input={verificarCuenta} class="inputcodser" placeholder="Ingresa número"/>
            </div>
            <div class="boxContacto">
                <h3>Banco</h3>
                <input disabled bind:value={tipo} maxlength="100" class="inputcodser" placeholder="{tipo}"/>
            </div>
            <span style="margin-top: 4vw; display:block; color: rgb(76 76 76)">INGRESA EL NÚMERO DE CUENTA COMPLETO SEA BANCARIO O INTERBANCARIO.</span>
            <span style="margin-top: 4vw; display:block; color: rgb(76 76 76)">Recuerda que el uso incorrecto de este apartado puede traer como consecuencia el baneo permanente en la aplicación sin derecho a reclamo.</span>
        </div>
        
    </div>
    <div class="divyapeardown" style="height: auto; margin-bottom: 3vw; flex-direction: column">
        <!-- <button on:click={cambio} class="botonyapearya">INGRESAR QR</button> -->
        <button on:click={guardar} class="botonyapearya">GUARDAR</button>
    </div>
    <!-- <div class="pantalla-gris-login" id="cambiarDestino" on:click={ocultarCambio}>
        <div class="cuadro-main-yapeado cuadro-upd">
            {#each billeteras as billetera}
            <div on:click={() => destino = billetera.nombre}>
                <h3>{billetera.nombre}</h3>
            </div>
            {/each}
        </div>
    </div> -->

    <div class="pantalla-gris-login" id="flotante-mensaje">
        <div class="cuadro-main-yapeado">
        {#if error}
            <h3>Error al guardar datos</h3>
            <div class="dataResponse">
                <span style="text-align: center;">{error}</span>
            </div>
        {/if}
        {#if success}
            <h3>Datos guardados</h3>
            <div class="dataResponse">
                <span style="text-align: center; font-size: 4.5vw;">Nombre: {nombre}</span>
                <span style="text-align: center; font-size: 4.5vw;">Cuenta: {cuenta}</span>
                <span style="text-align: center; font-size: 4.5vw;">Banco: {banco}</span>
            </div>

        {/if}
        <div class="btnDatos">
            {#if success}
                <span on:click={aceptar} style="background-color: #52dd52;">Aceptar</span>
            {/if}
            {#if error}
                <span on:click={cerrar} style="background-color: #f53030;">Volver a intentar</span>
            {/if}
        </div>
        </div>
    </div>

    <div class="pantalla-gris-login" id="confirmar">
        <div class="cuadro-main-yapeado">
            <div>
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5">
                    </circle>
                </svg>
            </div> 
        <h3>Guardando...</h3>
        </div>
    </div>

    <!-- <div class="pantalla-gris-login" id="confirmar-Ant">
        <div class="cuadro-main-yapeado">
            {#if success}
                <h3 style="text-align: center;">¿Estás seguro que quieres guardar estos datos?</h3>
                <div class="dataResponse">
                    <span style="text-align: center;">Nombre: {nombre}</span>
                    <span style="text-align: center;">Número: {numero}</span>
                    <span style="text-align: center;">Destino: {destino}</span>
                </div>
                <div class="btnDatos">
                    <span on:click={guardar} style="background-color: #52dd52; width: 30%; text-align: center;">Confirmar</span>
                    <span on:click={cerrarDatos} style="background-color: #f53030; width: 30%; text-align: center;">Cerrar</span>
                </div>
            {/if}
            {#if error}
                <h3 style="text-align: center; padding: 5vw 0">{error}</h3>
                <div class="btnDatos">
                    <span on:click={cerrarDatos} style="background-color: #f53030;">Cerrar</span>
                </div>
                
            {/if}
        </div>
    </div> -->
</div>
<style>
    .dataResponse{
        padding: 4vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .cuadro-main-yapeado{
        width: 88vw;
        height: auto;
        padding: 3vw 0;
    }
    .btnDatos{
        width: 100%;
        justify-content: center;
        display: flex;
    }
    .btnDatos span{
        border-radius: 2vw;
        padding: 2vw;
        color: #FFF;
        font-size: 4.3vw;
        font-weight: 500;
    }
    .registro{
        width: 100%;
        height: 100vh;
        background-color: #fff;
    }
    /* .registro-top{
        width: 100%;
        background-color: #002A8D;
    }
    .registro-top img{
        width: 6vw;
        height: 5vw;
        object-fit: contain;
        padding: 0 4vw;
    } */
    .divofitop {
        margin: 0;
        margin-top: 3vw;
    }
    /* .cuadro-upd{
        height: 80%;
        justify-content: flex-start;
    }
    .cuadro-upd div{
        width: 80%;
        background-color: rgb(255, 255, 255);
        border-radius: 2vw;
        border: 0.3vw solid rgb(189 189 189);
        margin-top: 4vw;
        padding: 3vw;
        display: flex;
        align-items: center;
        justify-content: left;
        box-shadow: 0 1px 2px rgba(238, 238, 238, 0.701);
    }
    .cuadro-upd h3{
        font-size: 4.2vw;
        width: 50vw;
        font-weight: 600;
        color: black;
        text-align: left;
        margin-left: 2vw;
    }
    .destino-btn{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .destino-btn span{
        color: #000;
        font-size: 4.1vw;
        font-weight: 600;
    } */
</style>