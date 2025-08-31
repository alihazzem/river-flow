import { IndexType, Permission } from "node-appwrite";
import { questionCollection } from "../name";
import { createCollectionIfNotExists } from "./collectionHelper";

export default async function createQuestionCollection() {
    await createCollectionIfNotExists({
        collectionId: questionCollection,
        name: "Questions",
        permissions: [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ],
        attributes: [
            { key: "title", type: "string", size: 100, required: true },
            { key: "content", type: "string", size: 10000, required: true },
            { key: "authorId", type: "string", size: 50, required: true },
            { key: "tags", type: "string", size: 50, required: true, array: true },
            { key: "attachmentId", type: "string", size: 50, required: false },
        ],
        indexes: [
            { key: "title_index", type: IndexType.Fulltext, attributes: ["title"] },
            { key: "content_index", type: IndexType.Fulltext, attributes: ["content"] },
        ]
    });
}
