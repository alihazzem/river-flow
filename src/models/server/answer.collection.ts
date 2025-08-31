import { Permission } from "node-appwrite";
import { answerCollection } from "../name";
import { createCollectionIfNotExists } from "./collectionHelper";

export default async function createAnswerCollection() {
    await createCollectionIfNotExists({
        collectionId: answerCollection,
        name: "Answers",
        permissions: [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ],
        attributes: [
            { key: "content", type: "string", size: 10000, required: true },
            { key: "questionId", type: "string", size: 50, required: true },
            { key: "authorId", type: "string", size: 50, required: true },
        ],
        indexes: [], // No indexes for now
    });
}
