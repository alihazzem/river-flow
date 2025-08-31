import { db } from "../name";
import { databases } from "./config";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";

export default async function getOrCreateDB() {
    try {
        await databases.get(db);
    } catch {
        try {
            await databases.create(db, "Database");

            // Creating collections
            await Promise.all([
                createAnswerCollection(),
                createCommentCollection(),
                createQuestionCollection(),
                createVoteCollection(),
            ])
        } catch (error) {
            console.log("Error creating database: ", error);
        }
    }

    return databases;
}