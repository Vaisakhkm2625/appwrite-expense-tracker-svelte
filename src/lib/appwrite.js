import { Client , Account, Databases } from 'appwrite';
import { 
    PUBLIC_APPWRITE_ENDPOINT,
    PUBLIC_APPWRITE_PROJECT_ID, 
    PUBLIC_APPWRITE_COLLECTION_ID,
    PUBLIC_APPWRITE_DATABASE_ID
} from '$env/static/public';

export const client = new Client();

client
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const EXPENSES_COLLECTION_ID = PUBLIC_APPWRITE_COLLECTION_ID;
export const DATABASE_ID = PUBLIC_APPWRITE_DATABASE_ID;
export {ID} from 'appwrite';
