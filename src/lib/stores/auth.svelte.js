import {account, ID } from '$lib/appwrite';
import { error } from '@sveltejs/kit';

/** @type {any | null} */
export const currentUser = $state({
   user: null
});



// export function getUser(){
//     return currentUser
// }
//
export async function initAuth() {

    try {
        const session = await account.get();
        currentUser.user = session;
        return session

    } catch(error) {
        console.error("Error init auth:", error)
        currentUser.user = null;
        return currentUser;
    }

}

export async function login(email,password) {

    try {

        await account.createEmailPasswordSession(email, password);
        await initAuth();

    } catch(error) {
        console.error("Login failed: ",error);
        throw error
    }

}

export async function register(email,password,name) {

    try {

        await account.create(ID.unique(),email,password,name);
        //await initAuth();
        await login(email,password);

    } catch(error) {
        console.error("Login failed: ",error);
        throw error

    }

}

export async function logout() {
	try {
		await account.deleteSession('current')
        currentUser.user = null;
	} catch (error) {
		console.error('Logout error:', error)
	}
}

