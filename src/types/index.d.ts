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

export interface AuthResponse {
    success: boolean;
    error?: AppwriteException | null;
}

export interface UserPrefs extends Models.DefaultPreferences {
    reputation: number;
}

export interface IAuthStore {
    session: Models.Session | null;
    jwt: string | null;
    user: Models.User<UserPrefs> | null;
    hydrated: boolean;

    setHydrated(): void;
    verifySession(): Promise<AuthResponse>;
    login(email: string, password: string): Promise<{
        success: boolean;
        error?: AppwriteException | null;
    }>;
    register(email: string, password: string, name: string): Promise<AuthResponse>;
    logout(): Promise<void>;
}