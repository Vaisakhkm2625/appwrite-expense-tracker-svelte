<script>

import {currentUser} from "$lib/stores/auth.svelte";

let keys = Object.keys(currentUser.user)
console.log(keys);
</script>

<!-- {JSON.stringify(currentUser.user)} -->

<form action="">
    {#if currentUser.user}
        {#each keys as key }
            <label for={key}>{key.toUpperCase()}<input id={key} value={currentUser.user[key]} disabled></label>
        {/each}
    {/if}
</form>
