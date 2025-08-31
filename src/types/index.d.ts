import { IndexType } from "node-appwrite";

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