import { createContext } from "react";

interface IDynamicFormContext {
    mode: "syncfusion";
    values: Record<string, unknown>;
    onChange: (name: string, value: unknown) => void;
    errors: Record<string, string>;
}

const DynamicFormContext = createContext<IDynamicFormContext>({
    mode: "syncfusion",
    values: {},
    onChange: () => {},
    errors: {},
});

export default DynamicFormContext;
