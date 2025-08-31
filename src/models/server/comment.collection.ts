import { Permission } from "node-appwrite";
import { commentCollection } from "../name";
import { createCollectionIfNotExists } from "./collectionHelper";

export default async function createCommentCollection() {
    await createCollectionIfNotExists(
        commentCollection,
        "Comments",
        [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ],
        [
            { key: "content", type: "string", size: 10000, required: true },
            { key: "authorId", type: "string", size: 50, required: true },
            { key: "typeId", type: "string", size: 50, required: true },
            { key: "type", type: "enum", enumValues: ["question", "answer"], required: true },
        ],
        [] // No indexes for now
    );
}
