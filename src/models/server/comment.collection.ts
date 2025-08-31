import { Permission } from "node-appwrite";
import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
    // Creating collection
    await databases.createCollection(db, commentCollection, "Comments", [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);

    // Creating attributes
    await Promise.all([
        databases.createStringAttribute(db, commentCollection, "content", 10000, true),
        databases.createStringAttribute(db, commentCollection, "authorId", 50, true),
        databases.createEnumAttribute(db, commentCollection, "type", ["question", "answer"], true),
        databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
    ]);
}