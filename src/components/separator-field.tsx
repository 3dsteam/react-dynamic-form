import { ISeparatorField } from "../models/separator";

export const SeparatorField = (props: ISeparatorField) => {
    return props.template?.() ?? <hr className={props.className} />;
};
