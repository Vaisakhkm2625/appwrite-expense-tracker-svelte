
<script>

import {page } from "$app/state";
import {onMount} from "svelte";

import {currentUser,initAuth,logout} from "$lib/stores/auth.svelte"
import {goto} from "$app/navigation";



onMount(async ()=> {
    try {
        //const currentUser = await initAuth();

        await initAuth();
        if(!currentUser.user && !page.url.pathname.startsWith("/auth")){
            goto("/auth")
        } 
        if(currentUser.user && page.url.pathname.startsWith("/auth")){
            goto("/")
        }

    } catch (error) {

        if(!page.url.pathname.startsWith("/auth")){
            goto("/auth")
        }
    }
})

$inspect(currentUser)

const handleLogout = async () => {
    try {
        await logout()
        goto('/auth')
    } catch (error) {
        console.error('Logout failed:', error)
    }
}


</script>

<header>
    <nav>
        <b>expense tracker</b>

        <!-- {JSON.stringify(currentUser)} -->

        {#if currentUser.user}
            username: {currentUser.user.email}
            <button onclick={handleLogout}>Logout</button>
        {/if}

    </nav>
</header>

<main class="container">
    <div>


        {#if !page.url.pathname.startsWith('/auth')}
            main page
            <slot />
        {:else}
            login page
            <slot />
        {/if}

    </div>
</main>
