import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
    // Creating collection
    await databases.createCollection(db, voteCollection, "Votes", [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);

    // Creating attributes
    await Promise.all([
        databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true),
        databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
        databases.createEnumAttribute(db, voteCollection, "voteStatus", ["upVoted", "downVoted"], true),
        databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
    ]);
}
