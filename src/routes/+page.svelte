<script>
	// - can i reactivly update orignal expense list
	// - can i sent oringal

	import { DATABASE_ID, EXPENSES_COLLECTION_ID, ID, databases } from '$lib/appwrite';
	import { Query, Permission, Role } from 'appwrite';

	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth.svelte';

	let expenses = $state([]);
    let edit = $state([]);

	let expense_form = $state({
		open: false,
		data: {
			currentAmount: 0.0,
			currentDescription: '',
			currentCategory: ''
		}
	});

	let expenseAttr = [
		'userID',
		'category',
		'description',
		'date',
		'amount',
		'createdAt',
		'updatedAt'
	];

	let loading = $state(false);
	let error = $state('');

	let stats = {
		total: 0,
		thisMonth: 0,
		thisWeek: 0
	};

	const categroies = [
		{ id: 0, value: 'food' },
		{ id: 1, value: 'rent' },
		{ id: 2, value: 'transportation' },
		{ id: 3, value: 'entertainment' },
		{ id: 4, value: 'shopping' },
		{ id: 5, value: 'healthcare' },
		{ id: 6, value: 'utilities' },
		{ id: 7, value: 'education' },
		{ id: 8, value: 'other' }
	];

	onMount(() => {
		fetchExpenses();
	});

	async function fetchExpenses() {
		try {
			loading = true;

			expenses = await databases.listDocuments(DATABASE_ID, EXPENSES_COLLECTION_ID);

			loading = false;
		} catch (error) {}
	}

	$inspect(expenses);

	async function handleSubmit(event) {
		event.preventDefault();

		const now = new Date().toISOString();

		let expenseData = {
			userID: currentUser.user.$id,
			category: expense_form.data.currentCategory,
			description: expense_form.data.currentDescription,
			amount: expense_form.data.currentAmount, //parseFloat(currentAmount),
			date: now,
			createdAt: now,
			updatedAt: now
		};

		if (edit === null) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    EXPENSES_COLLECTION_ID,
                    ID.unique(),
                    expenseData,
                    [
                        Permission.read(Role.user(currentUser.user.$id)),
                        Permission.update(Role.user(currentUser.user.$id)),
                        Permission.delete(Role.user(currentUser.user.$id))
                    ]
                );
            } catch (error) {

                console.error("error in creating",error);

            }
		} else {

            try {


			let result =  await databases.updateDocument(DATABASE_ID, EXPENSES_COLLECTION_ID, edit["$id"], {
				//...expenseData,
                category: expense_form.data.currentCategory,
                description: expense_form.data.currentDescription,
                amount: expense_form.data.currentAmount, //parseFloat(currentAmount),
				updatedAt: now
			});

                //edit["amount"] = 101.0;
            Object.assign(edit,result)

			console.log('update it',result);
			console.log('form',edit);
                

            } catch (error) {
                console.error("error in updating it",error);

            } 
		}
		//await fetchExpenses();
		expense_form.open = false;

		expense_form.data.currentAmount = 0.0;
		expense_form.data.currentDescription = '';
		expense_form.data.currentCategory = '';
	}

	async function deleteExpense(expenseId) {
		try {
			await databases.deleteDocument(DATABASE_ID, EXPENSES_COLLECTION_ID, expenseId);
			await fetchExpenses();
		} catch (error) {
			console.log(error); }
	}
</script>

<div>
	{#if currentUser.user}
		welcome {currentUser.user.name}
	{/if}
</div>

<div>
	<h3>stats overview</h3>
	total expense:<br />
	this month expense: <br />
	this week expense:<br />
</div>

<!---->

<button
	onclick={() => {
		expense_form.open = true;
	}}
>
	Add expense
</button>

<dialog open={expense_form.open}>
	<article>
		<header>
			<button
				aria-label="Close"
				rel="prev"
				onclick={() => { expense_form.open = false;
				}}
			></button>
			<p>
				<strong>Add expenses</strong>
			</p>
		</header>

		<form onsubmit={handleSubmit}>

            {#if edit}
			<label for="amount">Amount</label>
			<input
				type="number"
				id="amount"
				bind:value={expense_form.data.currentAmount}
				step="0.01"
				required
			/>

			<label for="description">Description</label>
            <input type="text" id="description" bind:value={expense_form.data.currentDescription}/>

			<label for="categroy">Categroy</label>
			<select id="categroy" bind:value={expense_form.data.currentCategory}>
				{#each categroies as category}
					<option value={category.value}>
						{category.value}
					</option>
				{/each}
			</select>

			<div role="group">
				<button type="button"> cancel</button>
				<button type="submit">Submit</button>
			</div>

            {/if}
		</form>
	</article>
</dialog>

<div>
	<h3>expense form</h3>
	<!-- add expense button -->
	<!-- add expense form -->
</div>

<!-- expense list-->


{JSON.stringify(edit)}

{#if loading}
	loading...
{:else}
	<table>
		<thead>
			<tr>
				<td></td>
				{#each expenseAttr as i}
					<td>{i}</td>
				{/each}
			</tr>
		</thead>



		<tbody>
			{#each expenses.documents as expense (expense['$id'])}
				<tr>
					<td>
						<div role="group">
							<button
								onclick={() => {
									expense_form.open = true;
									edit = expense;///['$id'];
									expense_form.data.currentAmount = expense['amount'];
									expense_form.data.currentDescription = expense['description'];
									expense_form.data.currentCategory = expense['category'];
								}}
								>✏️
							</button>
							<button
								class="secondary"
								onclick={() => {
									deleteExpense(expense['$id']);
								}}>X</button
							>
						</div>
					</td>
					{#each expenseAttr as i}
						<td>{expense[i]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
