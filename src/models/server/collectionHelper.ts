import { db } from "../name";
import { databases } from "./config";
import type { CollectionOptions } from "@/types";

export async function createCollectionIfNotExists(options: CollectionOptions) {
    const { collectionId, name, permissions, attributes, indexes } = options;

    // Check if collection exists
    let collectionExists = true;
    try {
        await databases.getCollection(db, collectionId);
    } catch (error: unknown) {
        if ((error as { code?: number }).code === 404) collectionExists = false;
        else throw error;
    }

    if (!collectionExists) {
        await databases.createCollection(db, collectionId, name, permissions);
    }

    // Create attributes sequentially
    for (const attr of attributes) {
        let exists = true;
        try {
            await databases.getAttribute(db, collectionId, attr.key);
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 404) exists = false;
            else throw error;
        }

        if (!exists) {
            if (attr.type === "string") {
                await databases.createStringAttribute(
                    db,
                    collectionId,
                    attr.key,
                    attr.size || 100,
                    attr.required || false,
                    undefined,
                    attr.array || false
                );
            } else if (attr.type === "enum" && attr.enumValues) {
                await databases.createEnumAttribute(
                    db,
                    collectionId,
                    attr.key,
                    attr.enumValues,
                    attr.required || false,
                    undefined,
                    attr.array || false
                );
            }
        }
    }

    // Create indexes sequentially
    const existingIndexes = await databases.listIndexes(db, collectionId);

    for (const index of indexes) {
        if (!existingIndexes.indexes.some(i => i.key === index.key)) {
            await databases.createIndex(db, collectionId, index.key, index.type, index.attributes);
        }
    }
}
