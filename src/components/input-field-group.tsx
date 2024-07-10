import { IFieldGroup } from "../models/group";
import { InputField } from "./input-field";

export const InputFieldGroup = (group: IFieldGroup) => {
    return (
        <div data-testid={"group-" + group.name} className={group.className}>
            {(group.title || group.description) && (
                <div>
                    {/* Group Title */}
                    {group.title && (
                        <p style={{ fontSize: "large", fontWeight: "bold" }} className={group.title.className}>
                            {group.title.content}
                        </p>
                    )}
                    {/* Group description */}
                    {group.description && <p className={group.description.className}>{group.description.content}</p>}
                </div>
            )}
            {/* Each fields */}
            {group.fields.map((field, index) => {
                return (
                    <div key={index}>
                        {/* Check if the field is a group */}
                        {"fields" in field ? <InputFieldGroup {...field} /> : <InputField {...field} />}
                    </div>
                );
            })}
        </div>
    );
};
