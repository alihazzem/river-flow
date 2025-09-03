import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { type, typeId, voteStatus, votedById } = await request.json();

        const response = await databases.listDocuments(
            db,
            voteCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", votedById)
            ]
        );

        if (response.documents.length > 0) {
            await databases.deleteDocument(db, voteCollection, response.documents[0].$id);

            // Decrease the reputation of the question/answer author
            const questionOrAnswer = await databases.getDocument(
                db,
                type === "question" ? questionCollection : answerCollection,
                typeId
            );

            const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorId);

            await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                prefs: {
                    reputation:
                        response.documents[0].voteStatus === "upvoted"
                            ? (authorPrefs.reputation) - 1
                            : (authorPrefs.reputation) + 1,
                }
            });
        }

        if (response.documents[0]?.voteStatus !== voteStatus) {
            await databases.createDocument(
                db,
                voteCollection,
                ID.unique(),
                {
                    type,
                    typeId,
                    voteStatus,
                    votedById,
                }
            );
        }

        const questionOrAnswer = await databases.getDocument(
            db,
            type === "question" ? questionCollection : answerCollection,
            typeId
        );

        const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorId)

        if (response.documents[0]) {
            await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                prefs: {
                    reputation:
                        // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                        response.documents[0].voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) - 1
                            : Number(authorPrefs.reputation) + 1,
                }
            });
        } else {
            await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                prefs: {
                    reputation:
                        // that means prev vote was "upvoted" and new value is "downvoted" so we have to decrease the reputation
                        voteStatus === "upvoted"
                            ? Number(authorPrefs.reputation) + 1
                            : Number(authorPrefs.reputation) - 1,
                }
            });
        }

        const [upVoted, downVoted] = await Promise.all([
            databases.listDocuments(
                db,
                voteCollection,
                [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                    Query.equal("votedById", votedById),
                    Query.equal("voteStatus", "upVoted"),
                    Query.limit(1)
                ]
            ),
            databases.listDocuments(
                db,
                voteCollection,
                [
                    Query.equal("type", type),
                    Query.equal("typeId", typeId),
                    Query.equal("votedById", votedById),
                    Query.equal("voteStatus", "downVoted"),
                    Query.limit(1)
                ]
            )
        ])

        return NextResponse.json(
            {
                data: {
                    document: null,
                    voteResult: upVoted.total - downVoted.total
                },
                message: response.documents[0] ? "Vote Status Updated" : "Voted",
            },
            { status: 201 }
        )

    } catch (error) {
        const err = error as { code?: number; status?: number; message?: string };
        return NextResponse.json(
            { error: err.message || "Unexpected error" },
            { status: err.code || err.status || 500 }
        );
    }
}