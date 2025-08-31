import { Permission } from "node-appwrite";
import { commentCollection } from "../name";
import { createCollectionIfNotExists } from "./collectionHelper";

export default async function createCommentCollection() {
    await createCollectionIfNotExists({
        collectionId: commentCollection,
        name: "Comments",
        permissions: [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ],
        attributes: [
            { key: "content", type: "string", size: 10000, required: true },
            { key: "authorId", type: "string", size: 50, required: true },
            { key: "typeId", type: "string", size: 50, required: true },
            { key: "type", type: "enum", enumValues: ["question", "answer"], required: true },
        ],
        indexes: [], // No indexes for now
    });
}
