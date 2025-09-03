import { IndexType } from "node-appwrite";
import { AppwriteException, Models } from "appwrite";

export type Attribute = {
    key: string;
    type: "string" | "enum";   // supports string and enum
    size?: number;             // for string attributes
    required?: boolean;
    array?: boolean;
    enumValues?: string[];     // for enum attributes
};

export type Index = {
    key: string;
    type: IndexType;
    attributes: string[];
};

export type CollectionOptions = {
    collectionId: string;
    name: string;
    permissions: string[];
    attributes: Attribute[];
    indexes: Index[];
};

export type ValidationError = {
    errors: string[];
    properties?: {
        [key: string]: ValidationError;
    };
};

export interface AuthResponse {
    success: boolean;
    validationError?: ValidationError;
    error?: AppwriteException | null;
}

export interface UserPrefs extends Models.DefaultPreferences {
    reputation: number;
}

export interface IAuthStore {
    session: Models.Session | null;
    user: safeUser | null;
    hydrated: boolean;

    setHydrated(): void;
    verifySession(): Promise<AuthResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    register(email: string, password: string, name: string): Promise<AuthResponse>;
    logout(): Promise<void>;
}

export interface RegisterFormState {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    setField: (field: keyof Omit<RegisterFormState, 'setField'>, value: string) => void;
    reset: () => void;
}

export interface LoginFormState {
    email: string;
    password: string;
    setField: (field: "email" | "password", value: string) => void;
    reset: () => void;
}

export interface QuestionForm extends Models.Document {
    title: string;
    content: string;
    tags: string[];
    attachmentId: string;
    authorId: string;
}

export interface QuestionCard extends Models.Document {
    title: string;
    content: string;
    totalVotes: number;
    totalAnswers: number;
    tags: string[];
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
}

export interface CommentDoc extends Models.Document {
    content: string;
    authorId: string;
    author: { name: string };
}

export interface AnswerDoc extends Models.Document {
    content: string;
    authorId: string;
    author: {
        $id: string;
        name: string;
        reputation: number;
    };
    upvotesDocuments: Models.DocumentList<VoteDoc>;
    downvotesDocuments: Models.DocumentList<VoteDoc>;
    comments: Models.DocumentList<CommentDoc>;
}

export interface VoteDoc extends Models.Document {
    votedById: string; // user id who voted
    type: "question" | "answer"; // what was voted on
    typeId: string; // id of the question or answer
    voteStatus: "upvoted" | "downvoted"; // vote direction
}