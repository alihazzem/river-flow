import { Permission } from "node-appwrite";
import { voteCollection } from "../name";
import { createCollectionIfNotExists } from "./collectionHelper";

export default async function createVoteCollection() {
    await createCollectionIfNotExists(
        voteCollection,
        "Votes",
        [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ],
        [
            { key: "type", type: "enum", enumValues: ["question", "answer"], required: true },
            { key: "typeId", type: "string", size: 50, required: true },
            { key: "voteStatus", type: "enum", enumValues: ["upVoted", "downVoted"], required: true },
            { key: "votedById", type: "string", size: 50, required: true },
        ],
        [] // No indexes for now
    );
}
