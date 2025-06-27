import { IFieldGroup } from "../models/group";
import { EFieldType, IFieldType } from "../models/field";
import { ISeparatorField } from "../models/separator";

const flatValuesFromStructured = (values: Record<string, unknown>): Record<string, unknown> => {
    const flatValues: Record<string, unknown> = {};

    const setFlatValues = (obj: Record<string, unknown>, parentKey?: string) => {
        for (const key in obj) {
            const newKey = parentKey ? `${parentKey}___${key}` : key;
            if (
                typeof obj[key] === "object" &&
                obj[key] !== null &&
                !Array.isArray(obj[key]) &&
                !(obj[key] instanceof Date)
            ) {
                setFlatValues(obj[key] as Record<string, unknown>, newKey);
            } else {
                flatValues[newKey] = obj[key];
            }
        }
    };

    setFlatValues(values);
    return flatValues;
};

const getStructuredValues = (
    fields: (IFieldType | IFieldGroup)[],
    values: Record<string, unknown>,
    nullOnUndefined = true,
): Record<string, unknown> => {
    const structuredValues: Record<string, unknown> = {};

    if (nullOnUndefined) {
        // Recursive function to set null values
        const setNullValues = (fields: (IFieldType | IFieldGroup | ISeparatorField)[], prefix?: string) => {
            fields.forEach((field) => {
                // Skip separator fields
                if ("type" in field && field.type === EFieldType.SEPARATOR) return;
                const name = prefix ? (field.name ? prefix + "___" + field.name : prefix) : field.name;
                if ("fields" in field) setNullValues(field.fields, name);
                else if (values[name!] === undefined) values[name!] = null;
            });
        };
        // Check if null on undefined
        setNullValues(fields);
    }

    // Recursive function to set group values
    const setGroupValues = (key: string, keyGroup: string, parent: Record<string, unknown>) => {
        const [group, keyValue] = keyGroup.split(/___(.*)/s);
        if (!parent[group]) parent[group] = {};
        // Check if key is a group
        if (keyValue.includes("___")) setGroupValues(key, keyValue, parent[group] as Record<string, unknown>);
        else (parent[group] as Record<string, unknown>)[keyValue] = values[key];
    };

    // Loop through values
    for (const key in values) {
        // Add values to structured object
        if (key.includes("___")) setGroupValues(key, key, structuredValues);
        else structuredValues[key] = values[key];
    }

    // Return structured values
    return structuredValues;
};

export { flatValuesFromStructured, getStructuredValues };
