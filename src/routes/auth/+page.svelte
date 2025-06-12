<script>
	import { account } from '$lib/appwrite';
	import { goto } from '$app/navigation';
	import { ID } from 'appwrite';
	import { login, register } from '$lib/stores/auth.svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');

	let isLogin = $state(true);
	let loading = $state(false);
	let error = $state();

	async function handleSubmit() {
		try {
			loading = true;
			error = null;

			if (isLogin) {
				await login(email, password);
			} else {
				await register(email, password, name);
			}

			goto('/');

		} catch (err) {
            console.error("Auth Error: ",err);
            console.log(err);
        } finally {
            loading = false;
        }
	}
</script>

<div class="auth-container">
	<div class="auth-content">
		<div class="auth-header">
			<div class="mb-3 text-4xl">💰</div>
			<h2 class="auth-title">
				{isLogin ? 'Welcome back!' : 'Create your account'}
			</h2>
			<p class="auth-subtitle">
				{isLogin
					? "Track your expenses with ease. Let's get you signed in."
					: 'Start your journey to better expense management'}
			</p>
		</div>

		{#if error}
			<div class="auth-error">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="auth-form">
			{#if !isLogin}
				<div>
					<label for="name" class="form-label"> Full Name </label>
					<input
						type="text"
						id="name"
						bind:value={name}
						required
						class="input form-input-container"
						placeholder="John Doe"
					/>
				</div>
			{/if}

			<div>
				<label for="email" class="form-label"> Email address </label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					class="input form-input-container"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="form-label"> Password </label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					minlength="8"
					class="input form-input-container"
					placeholder="••••••••"
				/>
			</div>

			<div>
				<button
					type="submit"
					class="btn btn-primary w-full {loading ? 'opacity-75 cursor-not-allowed' : ''}"
					disabled={loading}
				>
					{#if loading}
						<div class="loading-spinner-small mr-2"></div>
					{/if}
					{isLogin ? 'Sign in' : 'Create account'}
				</button>
			</div>
		</form>

		<div class="text-center">
			<button
				on:click={() => (isLogin = !isLogin)}
				class="text-sm text-primary-600 hover:text-primary-500"
			>
				{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
			</button>
		</div>
	</div>
</div>
