<script>
    import { verificarAcceso } from '$lib/verificarAcceso.js';
    import '../global.css'
    import { API_BASE_URL } from '../config.js';
    import { goto  } from '$app/navigation';
    import { onMount } from 'svelte';
    import axios from '$lib/api.js';
    import QrScanner from 'qr-scanner'; // Importa la librería de escaneo de códigos QR
    let videoElement;
    let nombre = '';
    let qrCode = '';
    let destino='Yape'
    let botonActivo = 'Yape'
    let success = false
    let error = ''
    let telefono = ''
    let fileInput;
    onMount(async () => {
        await verificarAcceso({ navegar: goto });
    });
    function atras(){
        goto('/home')
    }
    const mostrarPreCarga = () => {
        document.getElementById("flotante-mensaje").style.display = "flex";
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
    const QRaceptado = () => {
        document.getElementById("idCamera").style.display = "none";
        document.getElementById("idRegister").style.display = "block";
    };
    function subirImg(){

    }
    async function abrirCamara(){
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoElement.srcObject = stream;
  
      const qrScanner = new QrScanner(
        videoElement,
        result => {
        // result aquí ya es el string del QR
        qrCode = result.data;
        console.log('Datos reales del QR:', qrCode);
        QRaceptado();
        },
        {
        // Opciones adicionales para mejor detección
        preferredCamera: 'environment',
        maxScansPerSecond: 5,
        // highlightScanRegion: true,
        highlightCodeOutline: true,
        }
        );
        qrScanner.start();
    }
    function handleFileInputChange(event) {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const image = new Image();
            image.onload = function() {
            // Escanea el código QR desde la imagen
            QrScanner.scanImage(image)
                .then(result => {
                    // console.log('Valor del código QR:', result);
                    qrCode = result.trim();
                    console.log(qrCode)
                })
                .catch(error => {
                // console.error('Error al escanear el código QR:', error);
                });
            };
            image.src = event.target.result;
        };
        reader.readAsDataURL(file);
        }
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
    function handleQRScanned(result) {
        try {
        // La librería qr-scanner devuelve directamente el string del QR en 'result'
            qrCode = result; // Asignamos el resultado directamente
            
            if (!qrCode) {
                throw new Error('No se pudieron obtener datos del QR');
            }

            console.log('QR escaneado:', qrCode);
            QRaceptado();
            
        } catch (err) {
            console.error('Error procesando QR:', err);
            error = 'El código QR no es válido';
            mostrarPreCarga();
        }
    }

    async function guardar(){
       
        // cerrarDatos();
        error = '';
        success = false;
        const user = localStorage.getItem('key');
        
        if (!user) {
            mostrarPreCarga();
            error = 'El usuario no está permitido para agregar números.';
            return;
        }
        try {

            const response = await axios.post(`${API_BASE_URL}/agregar_qr`, {
                qrCode,
                nombre,
                destino,
                telefono,
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
        goto('/contacto')
    };
    //
    // onMount(async () => {
    //   // Accede a la cámara del dispositivo
    //   const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    //   videoElement.srcObject = stream;
  
    //   const qrScanner = new QrScanner(
    //     videoElement,
    //     result => {
    //     // result aquí ya es el string del QR
    //     qrCode = result.data;
    //     console.log('Datos reales del QR:', qrCode);
    //     QRaceptado();
    //     },
    //     {
    //     // Opciones adicionales para mejor detección
    //     preferredCamera: 'environment',
    //     maxScansPerSecond: 5,
    //     // highlightScanRegion: true,
    //     highlightCodeOutline: true,
    //     }
    //     );
    //     qrScanner.start();
    // });
    const mostrarCambio = () => {
        document.getElementById("cambiarDestino").style.display = "flex";
    };

    function abrirCambio(){
        mostrarCambio()
    }
    function ocultarCambio (){
        document.getElementById("cambiarDestino").style.display = "none";
    };
    function cerrarCambio(){
        ocultarCambio()
    }
    let billeteras = [
        { nombre: "Yape"},
        { nombre: "Plin"},
        { nombre: "Bim"},
        { nombre: "BCP"},
        { nombre: "Agora / Oh!"},
        { nombre: "Banco Falabella"},
        { nombre: "Cmac Arequipa"},
        { nombre: "BBVA Perú"},
        { nombre: "Compartamos Financiera"},
	];
</script>

<div class="divcamara" id="idCamera" style="display: none;">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="cam-video" bind:this={videoElement} playsinline autoplay></video>
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
 <div class="registro" id="idRegister">
    <div class="divcriz">
        <button on:click={atras} class="botonatrasya1"></button>
        <h3 class="h3bien2">Agregar QR</h3>
        <button on:click={atras} class="botonatrasya2"></button>
    </div>
    <div class="divcentertop">
        <div class="divofitop">
            <div class="boxContacto">
                <h3>Nombre</h3>
                <input bind:value={nombre} maxlength="100" class="inputcodser" placeholder="Ingresa nombres "/>
            </div>
            <div class="boxContacto">
                <h3>Número</h3>
                <input bind:value={telefono} type="tel" maxlength="15" class="inputcodser" placeholder="Ingresa número"/>
            </div>
           <div class="boxContacto">
                <h3>QR</h3>
                <input bind:value={qrCode} class="inputcodser" disabled placeholder="Sube un QR"/>
            </div>
            <div class="boxContacto">
                <h3>Destino</h3>
                <button on:click={abrirCambio} class="dropdown-menu-item border-color destino-btn" style="margin-top: 1vw;">
                    <span>{destino}</span>
                    <span style="margin-right: 4vw">CAMBIAR</span>
                </button>
                <!-- <button class="dropdown-menu-item {botonActivo === 'Yape' ? 'border-color' : ''}" style="margin-top: 3vw;" on:click={yape}>Yape</button>
                <button class="dropdown-menu-item  {botonActivo === 'Plin' ? 'border-color' : ''}" style="margin-top: 3vw;" on:click={plin}>Plin</button> -->
            </div>
            <span style="font-size: 4vw; margin-top: 4vw; display:block; color: rgb(76 76 76)">Recuerda que el uso incorrecto de este apartado puede traer como consecuencia el baneo permanente en la aplicación sin derecho a reclamo.</span>
        </div>
        
    </div>
    <div class="divyapeardown" style="height: auto; margin-bottom: 3vw">
        <button on:click={abrirCamara} class="botonyapearya">ABRIR CAMARA</button>
        <button on:click={() => fileInput.click()} class="botonyapearya" style="margin: 2vw 0">SUBIR IMAGEN</button>
        <button on:click={guardar} class="botonyapearya">GUARDAR</button>
        
        <input type="file" bind:this={fileInput} style="display: none" on:change={handleFileInputChange}/>
    </div>
    <div class="pantalla-gris-login" id="cambiarDestino" on:click={ocultarCambio}>
        <div class="cuadro-main-yapeado cuadro-upd">
            {#each billeteras as billetera}
            <div on:click={() => destino = billetera.nombre}>
                <h3>{billetera.nombre}</h3>
            </div>
            {/each}
        </div>
    </div>

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
                <span style="text-align: center; font-size: 4.5vw;">Número: {telefono}</span>
                <span style="text-align: center; font-size: 4.5vw;">Destino: {destino}</span>
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
</div>
<style>
    .dropdown-menu-item {
        padding: 0;
        border: 0;
    }
    .botonyapearya{
        width: 100%;
    }
    .divyapeardown{
        display: flex;
        flex-direction: column;
    }
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
        display: block;
        width: 100%;
        height: 100vh;
        background-color: #fff;
    }
    .divofitop {
        margin: 0;
        margin-top: 3vw;
    }
    .divcriz {
        background-color: #ffffff;
        height: 12vw;
        display: flex;
        align-items: center;
        box-shadow: 0vw 0vw 1vw 0vw #afafaf;
    }
    .cuadro-upd{
        /* height: 80%; */
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
        width: 65vw;
        font-weight: 600;
        color: black;
        text-align: left;
        margin-left: 2vw;
    }
    .destino-btn{
        width: 100%;
        display: flex;
        justify-content: space-between;
        background-color: transparent;
        align-items: center;
    }
    .destino-btn span{
        color: #000;
        font-size: 4.1vw;
        font-weight: 600;
    }
</style>