<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import { currentUser, initAuth, logout } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		try {
			//const currentUser = await initAuth();
			await initAuth();

			if (!currentUser.user && !page.url.pathname.startsWith('/auth')) {
				goto('/auth');
			}
			if (currentUser.user && page.url.pathname.startsWith('/auth')) {
				goto('/');
			}
		} catch (error) {
			if (!page.url.pathname.startsWith('/auth')) {
				goto('/auth');
			}
		}
	});

	$inspect(currentUser);

	const handleLogout = async () => {
		try {
			await logout();
			goto('/auth');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};
</script>

<header>
	<nav style="border-bottom: 1px white solid">
		<ul>
			<li><strong>Expense Tracker</strong></li>
		</ul>
		<!-- {JSON.stringify(currentUser)} -->

		<ul>
			<li>
				{#if currentUser.user}
					<details class="dropdown">
						<summary>
							{currentUser.user.name}
						</summary>
						<ul dir="rtl">
							<li><a onclick={handleLogout}>Logout</a></li>
							<li><a href="/profile">profile</a></li>
						</ul>
					</details>
				{/if}
			</li>
		</ul>
	</nav>
</header>

<main class="container">
	<div>
		{#if !page.url.pathname.startsWith('/auth')}
			<!-- main page -->
			<slot />
		{:else}
			<!-- login page -->
			<slot />
		{/if}
	</div>
</main>
