import { EFieldType } from "../models/field";
import { IFieldGroup } from "../models/group";
import { InputField } from "./input-field";
import { SeparatorField } from "./separator-field";

interface InputFieldGroupProps extends IFieldGroup {
    prefix?: string;
}

export const InputFieldGroup = (group: InputFieldGroupProps) => {
    const groupName = group.prefix ? (group.name ? group.prefix + "___" + group.name : group.prefix) : group.name;

    return (
        <div data-testid={"group-" + groupName} className={group.className}>
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
                        {"fields" in field ? (
                            <InputFieldGroup {...{ ...field, prefix: groupName }} />
                        ) : field.type === EFieldType.SEPARATOR ? (
                            <SeparatorField {...field} />
                        ) : (
                            <InputField {...{ ...field, prefix: groupName }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
