import getOrCreateDB from "./dbSetup";
import getOrCreateStorage from "./storageSetup";

let initialized = false;

export async function initServer() {
    if (initialized) return; // prevent multiple inits

    try {
        // Initialize database and storage in parallel
        await Promise.all([
            getOrCreateDB(),
            getOrCreateStorage(),
        ]);

        initialized = true;
        console.log("Server initialized successfully.");
    } catch (error) {
        console.error("Error during server initialization:", error);
    }
}
