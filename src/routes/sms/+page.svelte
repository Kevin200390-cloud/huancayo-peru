<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import { goto as navegar } from '$app/navigation';
    import { crearControlCarga } from '$lib/loading.js';
    const { mostrarCarga, ocultarCarga, ir: goto } = crearControlCarga(navegar);
    import { onMount } from 'svelte';
    import axios from '$lib/api.js';
    import { writable, get } from 'svelte/store';
    let mensaje = false
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });

    function atras(){
        goto('/home');
    }

    const sms = writable(null); // Almacena el valor actual del campo SMS

    const mostrarPreCarga = () => {
        mostrarCarga("flotante-mensaje");
    };
    const ocultarPreCarga = () => {
        ocultarCarga("flotante-mensaje");
    };

    const cambiarEstadoSMS = async (numero) => {
        try {
            mostrarPreCarga();
            const storedKey = localStorage.getItem('key');

            const response = await axios.put(
                `${API_BASE_URL}/mensajes/${storedKey}/${numero}`,
                {},
                {
                    headers: {

                    }
                }
            );
            // Obtener y actualizar el valor actual del campo SMS
            const estadoActualizado = await obtenerEstadoSMS();
            sms.set(estadoActualizado);
            ocultarPreCarga();
        } catch (error) {
            ocultarPreCarga();
            console.error('Error al cambiar el estado de los SMS:', error);
        }
    };

    const obtenerEstadoSMS = async () => {
        try {
            const storedKey = localStorage.getItem('key');

            const response = await axios.get(
                `${API_BASE_URL}/key/${storedKey}`,
                {
                    headers: {

                    }
                }
            );
            const keyData = response.data.key[0];
            return keyData.sms; // Retorna el estado de los SMS
        } catch (error) {
            console.error('Error al obtener el estado de los SMS:', error);
            return null;
        }
    };

    const toggleSMS = async (numero) => {
        await cambiarEstadoSMS(numero);
        mensaje = true
    };
</script>

<div class="registro">
    <div class="destinoyapear">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img on:click={atras} style="width: 5.5vw; object-fit:contain" src="/images/equis.svg" alt="">
        <h3>Activar SMS</h3>
    </div>
    <div class="btnsms">
        <button class="botonyapear" on:click={() => toggleSMS(1)}>Activar SMS</button>
        <button class="botonyapear" on:click={() => toggleSMS(2)}>Desactivar SMS</button>
    </div>
    {#if mensaje}
        <h2 class="hsms">
            Tienes los mensajes 
            {#if $sms === true}
                activados
            {:else}
                desactivados
            {/if}
        </h2>
    {/if}
    <div class="pantalla-gris-login" id="flotante-mensaje">
        <div class="cuadro-main-yapeado">
            <div>
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5">
                    </circle>
                </svg>
            </div> 
        <h3>Cambiando...</h3>
        </div>
    </div>
</div>
<style>
    .destinoyapear{
        width: 92%;
        height: 14vw;
        background-color: #fff;
        padding: 0 0 1vw 5vw;
    }
    .btnsms{
        width: 100vw;
        display: flex;
        justify-content: center;
    }
    .btnsms button{
        margin: 3vw 2vw;
    }
    .hsms{
        font-size: 4vw;
        text-align: center;
    }
</style>