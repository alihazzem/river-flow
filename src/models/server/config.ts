import { Client, Avatars, Databases, Storage, Users } from 'node-appwrite';
import env from '@/app/env';

const client = new Client();

client
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    ;

if (typeof window === "undefined") {
    if (env.nodeEnv === "development" && env.appwrite.devKey) {
        client.setKey(env.appwrite.devKey);
    } else if (env.appwrite.apiKey) {
        client.setKey(env.appwrite.apiKey); // production server-side key
    }
}

const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client);

export { client, databases, avatars, storage, users };