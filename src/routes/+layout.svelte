<script lang="ts">
    import{ onMount } from 'svelte'
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

<slot />

<svelte:head>
<title>Caja Huancayo</title>
</svelte:head>
