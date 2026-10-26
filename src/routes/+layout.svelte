<script>
    import{ onMount } from 'svelte'
    import { page } from '$app/stores';
    import { beforeNavigate } from '$app/navigation';

    function usescolorStatusBar(pathname) {
        return ['/login', '/home', '/transferencias', '/register'].includes(pathname.replace(/\/+$/, ''));
    }

    $: colorStatusBar = usescolorStatusBar($page.url.pathname);

    beforeNavigate(({ from, to, cancel, willUnload, type }) => {
        if (typeof window === 'undefined' || !from || !to || willUnload) return;

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches
            || ('standalone' in navigator && navigator.standalone === true);

        if (isIOS && isInstalled
            && usescolorStatusBar(from.url.pathname) !== usescolorStatusBar(to.url.pathname)) {
            // iOS can retain the previous status-bar tint during SPA navigation.
            cancel();
            if (type === 'popstate') {
                window.location.replace(to.url.href);
            } else {
                window.location.assign(to.url.href);
            }
        }
    });
    async function detectSWUpdate(){
        const registration =await navigator.serviceWorker.ready
        registration.addEventListener('updatefound',() => {
            const newSW = registration.installing
            newSW?.addEventListener('statechange' , ()=> {
                if(newSW.state === 'installed') {
                    if (confirm('¡Nueva actualización disponible!')){
                        newSW.postMessage({type: 'SKIP_WAITING'})
                        window.location.reload()
                    }
                }
            })
        })
      }
    onMount(()=>{
        detectSWUpdate()
        })
</script>

<div class="route-shell" class:color-status-bar={colorStatusBar} class:white-status-bar={!colorStatusBar}>
    <slot />
</div>

<svelte:head>
    <meta name="theme-color" content={colorStatusBar ? '#ff0014' : '#ffffff'} />
<title>Caja Huancayo</title>
</svelte:head>

<style>
    .route-shell {
        display: contents;
    }

    :global(html:has(.white-status-bar)),
    :global(html:has(.white-status-bar) body) {
        background-color: #ffffff;
    }

    :global(html:has(.white-status-bar) body) {
        position: relative;
        inset: auto;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
    :global(html:has(.color-status-bar)),
    :global(html:has(.color-status-bar) body) {
        background-color: #ff0014;
    }

    :global(html:has(.color-status-bar) body) {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
</style>
