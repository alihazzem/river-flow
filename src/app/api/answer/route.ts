import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import type { UserPrefs } from "@/types";

export async function POST(request: NextRequest) {
    try {
        const { content, questionId, authorId } = await request.json();

        if (!content || !questionId || !authorId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await databases.createDocument(
            db,
            answerCollection,
            ID.unique(),
            { content, questionId, authorId }
        );

        // Safely update reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId);
        await users.updatePrefs(authorId, {
            reputation: (prefs?.reputation || 0) + 1,
        });

        return NextResponse.json(
            { message: "Answer created successfully" },
            { status: 201 }
        );
    } catch (error) {
        const err = error as { code?: number; status?: number; message?: string };
        return NextResponse.json(
            { error: err.message || "Unexpected error" },
            { status: err.code || err.status || 500 }
        );
    }
};

export async function DELETE(request: NextRequest) {
    try {
        const { answerId } = await request.json();

        const answer = await databases.getDocument(db, answerCollection, answerId);
        if (!answer) {
            return NextResponse.json(
                { error: "Answer not found" },
                { status: 404 }
            );
        }

        // Delete document properly
        await databases.deleteDocument(db, answerCollection, answerId);

        // Decrease reputation
        const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
        await users.updatePrefs(answer.authorId, {
            reputation: Math.max(0, (prefs?.reputation || 0) - 1),
        });

        return NextResponse.json(
            { message: "Answer deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        const err = error as { code?: number; status?: number; message?: string };
        return NextResponse.json(
            { error: err.message || "Unexpected error" },
            { status: err.code || err.status || 500 }
        );
    }
};


