// src/models/server/storageSetup.ts
import { Permission } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
    try {
        // Check if the bucket already exists
        await storage.getBucket(questionAttachmentBucket);
    } catch {
        try {
            // Create bucket if it does not exist
            await storage.createBucket(
                questionAttachmentBucket,
                "Uploads",
                [
                    Permission.read("any"),
                    Permission.read("users"),
                    Permission.create("users"),
                    Permission.update("users"),
                    Permission.delete("users"),
                ],
                false,
                undefined,
                undefined,
                ["jpeg", "png", "jpg", "gif", "svg", "webp", "heic", "heif"]
            );
        } catch (error) {
            console.error("Error creating storage bucket:", error);
        }
    }
}
