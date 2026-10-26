<script>
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import { goto  } from '$app/navigation';
    import { onMount } from 'svelte';
    function atras(){
        goto('/home')
    }
    function addNumero(){
        goto('/addcontacto')
    }
    function addQr(){
        goto('/addqr')
    }
    function addCuenta(){
        goto('/addcuenta')
    }
    function editCuenta(){
        goto('/register')
    }
</script>
<div class="registro">
    <div class="divcriz">
        <button on:click={atras} class="botonatrasya1"></button>
        <h3 class="h3bien2">Escoge una opción</h3>
        <button on:click={atras} class="botonatrasya2"></button>
    </div>
    <div class="btnsOpciones">
        <button on:click={editCuenta} class="botonyapearya">EDITAR CUENTA</button>
        <button on:click={addNumero} class="botonyapearya">GUARDAR NÚMERO</button>
        <button on:click={addQr} class="botonyapearya">GUARDAR QR</button>
        <button on:click={addCuenta} class="botonyapearya">GUARDAR CUENTA</button>
    </div>

</div>
<style>
    .registro{
        width: 100%;
        height: 100vh;
        background-color: #fff;
    }
    .btnsOpciones{
        height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .botonyapearya{
        margin: 2vw 0;
    }
</style>