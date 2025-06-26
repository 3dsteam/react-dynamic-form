import { createContext } from "react";

interface IDynamicFormContext {
    values: Record<string, unknown>;
    onChange: (name: string, value: unknown) => void;
    errors: Record<string, string>;
}

const DynamicFormContext = createContext<IDynamicFormContext>({
    values: {},
    onChange: () => {},
    errors: {},
});

export default DynamicFormContext;
