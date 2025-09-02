import type { ValidationError } from "@/types";

export function flattenValidationError(validationError?: ValidationError) {
    const flat: { [key: string]: string } = {};
    if (!validationError?.properties) return flat;

    Object.entries(validationError.properties).forEach(([field, value]) => {
        if (value?.errors?.length) flat[field] = value.errors[0];
    });

    return flat;
}
