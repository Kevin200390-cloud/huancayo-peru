<script>
    import '../global.css';
    import { goto } from '$app/navigation';

    let dialogo;
    let panel = '';
    const opciones = [
        { titulo: 'A tus cuentas propias', icono: 'operacion-1-icon.svg', destino: '/transferir' },
        { titulo: 'A cuentas de terceros', icono: 'operacion-2-icon.svg', destino: '/transferir?destino=terceros' },
        { titulo: 'A cuentas de otros bancos', icono: 'operacion-3-icon.svg', destino: '/transferir?destino=otros-bancos' },
        { titulo: 'Remesas Western Union', icono: 'operacion-4-icon.svg', destino: null },
        { titulo: 'Transferir a contacto', icono: 'operacion-5-icon.svg', destino: '/contacto' }
    ];
    const navegacion = [
        { titulo: 'Inicio', icono: 'inicio-icon.svg', destino: '/home' },
        { titulo: 'Transferencias', icono: 'transferencias-icon.svg', destino: '/transferencias' },
        { titulo: 'Transferir', icono: 'enviar-icon.svg', destino: '/transferir' },
        { titulo: 'Pagos', icono: 'tarjeta-icon.svg', destino: null },
        { titulo: 'Préstamos', icono: 'efectivo-icon.svg', destino: null }
    ];
    function abrirPanel(titulo) {
        panel = titulo;
        dialogo.showModal();
    }
</script>

<div class="transfers-page">
    <header class="transfers-header"><h1>Transferencias</h1></header>
    <main class="transfer-options">
        {#each opciones as opcion}
            <button type="button" class="transfer-option" on:click={() => opcion.destino ? goto(opcion.destino) : abrirPanel(opcion.titulo)}>
                <img class="option-icon" src={'/images/tra/' + opcion.icono} alt="" />
                <span>{opcion.titulo}</span>
                <svg class="chevron" viewBox="0 0 20 36" fill="none" aria-hidden="true"><path d="M4 4L16 18L4 32" /></svg>
            </button>
        {/each}
    </main>
    <nav class="bottom-navigation">
        {#each navegacion as item, i}
            <button type="button" class:active={i === 1} class:send-button={i === 2} title={item.titulo} aria-current={i === 1 ? 'page' : undefined} on:click={() => item.destino ? goto(item.destino) : abrirPanel(item.titulo)}>
                <span class="nav-icon"><img src={'/images/footer/' + item.icono} alt="" /></span>
                {#if i !== 2}<span>{item.titulo}</span>{/if}
            </button>
        {/each}
    </nav>
</div>

<dialog class="info-dialog" bind:this={dialogo} aria-labelledby="dialog-title">
    <form method="dialog"><button class="close-dialog" title="Cerrar">×</button></form>
    <h2 id="dialog-title">{panel}</h2>
    <p>Consulta las condiciones de {panel === 'Remesas Western Union' ? 'las remesas Western Union' : 'los préstamos'} a través de los canales de atención de Caja Huancayo.</p>
</dialog>

<style>
    .transfers-page { min-height: 100dvh; padding-bottom: calc(27vw + env(safe-area-inset-bottom, 0vw)); box-sizing: border-box; background: #f7f8fa; color: #414750; font-family: 'Roboto', Arial, sans-serif; }
    .transfers-page button { cursor: pointer; }
    .transfers-header { height: 15.7vw; padding: 0 6vw; display: flex; align-items: center; box-sizing: border-box; background: #ff0014; color: #fff; }
    .transfers-header h1 { margin: 0; padding-top: 1.6vw; font-size: 5vw; line-height: 1.2; font-weight: 700; text-align: left; }
    .transfer-options { margin: 0 4vw; }
    .transfer-option { display: flex; align-items: center; gap: 3.3vw; width: 92vw; height: 15.2vw; padding: 0 5.3vw 0 3.2vw; border-bottom: .25vw solid #e9eaec; background: transparent; color: #414750; text-align: left; }
    .transfer-option:first-child { height: 16.1vw; }
    .transfer-option:last-child { border-bottom: 0; }
    .option-icon { width: 5.5vw; height: 5.5vw; object-fit: contain; flex-shrink: 0; }
    .transfer-option > span { flex: 1; font-size: 4vw; line-height: 1.25; font-weight: 700; }
    .chevron { width: 2.1vw; height: 3.6vw; flex-shrink: 0; stroke: #7a828a; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
    .bottom-navigation { position: fixed; z-index: 10; bottom: 0; left: 0; width: 100vw; height: calc(23.8vw + env(safe-area-inset-bottom, 0vw)); padding: 3vw 2vw calc(10.8vw + env(safe-area-inset-bottom, 0vw)); display: grid; grid-template-columns: 18vw 18vw 24vw 18vw 18vw; box-sizing: border-box; background: #fff; }
    .bottom-navigation button { display: flex; flex-direction: column; align-items: center; gap: 1.4vw; background: transparent; color: #7a828a; font-size: 2.6vw; line-height: 1.2; white-space: nowrap; }
    .nav-icon { display: grid; place-items: center; width: 5.7vw; height: 5.7vw; }
    .nav-icon img { width: 5.7vw; height: 5.7vw; }
    .bottom-navigation button.active { color: #ff0000; font-weight: 700; }
    .bottom-navigation .active img { filter: brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7450%) hue-rotate(3deg) brightness(105%) contrast(120%); }
    .bottom-navigation .send-button { position: relative; top: -9vw; }
    .send-button .nav-icon { width: 12vw; height: 12vw; background: #ff0000; border-radius: 50%; box-shadow: 0 1.3vw 4vw #ff000046; }
    .send-button img { width: 5.5vw; height: 5.5vw; filter: brightness(0) invert(1); }
    .transfers-page button:focus-visible, .info-dialog button:focus-visible { outline: .4vw solid #00b6dc; outline-offset: .5vw; }
    .info-dialog { position: fixed; inset: 0; width: 88vw; max-width: 88vw; padding: 6vw; border: 0; border-radius: 3.5vw; background: #fff; color: #414750; box-sizing: border-box; font-family: 'Roboto', Arial, sans-serif; }
    .info-dialog::backdrop { background: #08263066; }
    .info-dialog h2 { padding-right: 4vw; font-size: 4.5vw; line-height: 1.2; }
    .info-dialog p { margin: 3vw 0 0; font-size: 3.5vw; line-height: 1.5; }
    .close-dialog { position: absolute; right: 3vw; top: 1vw; background: transparent; color: #414750; font-size: 7vw; cursor: pointer; }
</style>
