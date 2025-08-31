import { db } from "../name";
import { databases } from "./config";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
    try {
        // Check if database exists
        await databases.get(db);
    } catch {
        try {
            // Create database if not exists
            await databases.create(db, "Database");

            // Create collections **sequentially**
            await createAnswerCollection();
            await createCommentCollection();
            await createQuestionCollection();
            await createVoteCollection();
        } catch (error) {
            console.error("Error creating database or collections:", error);
        }
    }

    return databases;
}
