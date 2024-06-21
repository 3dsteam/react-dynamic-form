import { IField } from "../models/field";
import { SyncfusionField } from "./fields/syncfusion-field";
import { IonicField } from "./fields/ionic-field";

export interface IInputFieldProps {
    field: IField;
    value: unknown;
    onChange: (value: unknown) => void;
    /**
     * Rendering the field in a different mode
     * @default "syncfusion"
     */
    mode: "syncfusion" | "ionic";
}

export const InputField = (props: IInputFieldProps) => {
    // Check custom render
    if (props.field.template) {
        return props.field.template(props);
    }
    // Check mode
    else if (!props.mode || props.mode === "syncfusion") {
        return <SyncfusionField {...props} />;
    } else if (props.mode === "ionic") {
        return <IonicField {...props} />;
    }
};
