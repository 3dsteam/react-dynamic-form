import { IInputFieldProps } from "../input-field";
import { GenericField } from "./generic-field";
import { EFieldType } from "../../models/field";
import { IonCheckbox, IonInput, IonItem, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";

export const IonicField = (props: Omit<IInputFieldProps, "mode">) => {
    if (
        props.field.type === EFieldType.TEXT ||
        props.field.type === EFieldType.EMAIL ||
        props.field.type === EFieldType.PASSWORD ||
        props.field.type === EFieldType.NUMBER
    ) {
        let inputType = "text";
        if (props.field.type === EFieldType.PASSWORD) inputType = "password";
        else if (props.field.type === EFieldType.EMAIL) inputType = "email";
        else if (props.field.type === EFieldType.NUMBER) inputType = "number";
        return (
            <IonItem>
                <IonInput
                    id={props.field.name + "-ionic-field"}
                    data-testid={props.field.name + "-ionic-field"}
                    // Set ALL other properties
                    {...props.field.props}
                    // Identifier
                    type={inputType as "text" | "password" | "email" | "number"}
                    name={props.field.name}
                    label={props.field.label}
                    placeholder={props.field.placeholder}
                    // Value
                    value={(props.value as string) ?? null}
                    onIonInput={(args) => props.onChange(args.detail.value)}
                />
            </IonItem>
        );
    } else if (props.field.type === EFieldType.TEXTAREA) {
        return (
            <IonItem>
                <IonTextarea
                    id={props.field.name + "-ionic-field"}
                    data-testid={props.field.name + "-ionic-field"}
                    // Set ALL other properties
                    {...props.field.props}
                    // Identifier
                    name={props.field.name}
                    label={props.field.label}
                    placeholder={props.field.placeholder}
                    // Value
                    value={(props.value as string) ?? null}
                    onIonInput={(args) => props.onChange(args.detail.value)}
                />
            </IonItem>
        );
    } else if (props.field.type === EFieldType.DATE) {
        return <>Wip</>;
    } else if (props.field.type === EFieldType.SELECT) {
        return (
            <IonItem>
                <IonSelect
                    id={props.field.name + "-ionic-field"}
                    data-testid={props.field.name + "-ionic-field"}
                    // Set ALL other properties
                    {...props.field.props}
                    // Identifier
                    name={props.field.name}
                    label={props.field.label}
                    placeholder={props.field.placeholder}
                    // Value
                    value={(props.value as string) ?? null}
                    onIonChange={(args) => props.onChange(args.detail.value)}
                >
                    {// Each options prop
                    (props.field.props?.options as { text: string; value: string }[] | undefined)?.map((option) => (
                        <IonSelectOption
                            data-testid={props.field.name + "-ionic-field-option"}
                            key={option.value}
                            value={option.value}
                        >
                            {option.text}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
        );
    } else if (props.field.type === EFieldType.CHECKBOX) {
        return (
            <IonItem>
                <IonCheckbox
                    id={props.field.name + "-ionic-field"}
                    data-testid={props.field.name + "-ionic-field"}
                    // Set ALL other properties
                    {...props.field.props}
                    // Identifier
                    name={props.field.name}
                    // Value
                    checked={props.value as boolean}
                    onIonChange={(args) => props.onChange(args.detail.checked)}
                >
                    {props.field.label}
                </IonCheckbox>
            </IonItem>
        );
    }

    // Generic field
    return <GenericField {...props} />;
};
