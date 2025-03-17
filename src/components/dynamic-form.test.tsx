import { act, fireEvent, render, screen } from "@testing-library/react";
import { DynamicForm } from "./dynamic-form";
import { EFieldType } from "../models/field";
import { EConditionRuleOperator } from "../models/condition";
import { beforeEach, describe, expect } from "vitest";
import { useState } from "react";

// Callback functions
const onChanges = vi.fn();
const onSubmit = vi.fn();

describe("Main", () => {
    beforeEach(() => {
        render(<DynamicForm fields={[]} />);
    });

    it("renders the form", () => {
        expect(screen.getByTestId("dynamic-form")).toBeInTheDocument();
    });

    it("renders the buttons", () => {
        expect(screen.getByTestId("buttons-container")).toBeInTheDocument();
    });
});

describe("Default values", () => {
    /**
     * Test with React component
     * This is used to avoid the infinite loop with values and onChanges
     */
    const TestComponent = () => {
        const [values, setValues] = useState<Record<string, unknown>>({ username: "lorem.ipsum" });
        // Render the component
        return (
            <DynamicForm
                values={values}
                fields={[
                    {
                        name: "username",
                        type: EFieldType.TEXT,
                        validations: { required: true },
                    },
                ]}
                onChanges={(values) => {
                    setValues(values);
                    // Call the onChanges callback
                    onChanges(values, true);
                }}
            />
        );
    };

    beforeEach(() => {
        render(<TestComponent />);
    });

    it("renders the default value", () => {
        expect(screen.getByTestId("username-syncfusion-field")).toHaveValue("lorem.ipsum");
    });

    describe("When values changes", () => {
        beforeEach(() => {
            act(() =>
                fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                    target: { value: "dolor.sit.amet" },
                }),
            );
        });

        it("calls onChanges callback", () => {
            expect(onChanges).toHaveBeenCalledWith({ username: "dolor.sit.amet" }, true);
        });
    });
});

describe("Set null on undefined", () => {
    beforeEach(() => {
        render(
            <DynamicForm
                fields={[
                    { name: "username", type: EFieldType.TEXT },
                    { name: "password", type: EFieldType.PASSWORD },
                    {
                        name: "privacy",
                        fields: [
                            { name: "username", type: EFieldType.TEXT },
                            { name: "date", type: EFieldType.DATE },
                        ],
                    },
                ]}
                onSubmit={onSubmit}
                buttons={{
                    template: ({ onSubmit }) => (
                        <button data-testid="mock-on-submit" onClick={onSubmit}>
                            Submit
                        </button>
                    ),
                }}
            />,
        );

        // Fill some fields
        act(() => {
            fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                target: { value: "lorem" },
            });
            fireEvent.change(screen.getByTestId("privacy___username-syncfusion-field"), {
                target: { value: "lorem ipsum" },
            });
        });

        // Click on the submit button
        act(() => fireEvent.click(screen.getByTestId("mock-on-submit")));
    });

    it("calls the onSubmit callback with null values", () => {
        expect(onSubmit).toHaveBeenCalledWith({
            username: "lorem",
            password: null,
            privacy: { username: "lorem ipsum", date: null },
        });
    });
});

describe("Field Mode", () => {
    describe("When mode is not set", () => {
        beforeEach(() => {
            render(<DynamicForm fields={[{ name: "username", type: EFieldType.TEXT }]} />);
        });

        it("renders the Syncfusion field by default", () => {
            expect(screen.getByTestId("username-syncfusion-field")).toBeInTheDocument();
        });
    });

    describe("When mode is set to 'syncfusion'", () => {
        beforeEach(() => {
            render(<DynamicForm fields={[{ name: "username", type: EFieldType.TEXT }]} mode="syncfusion" />);
        });

        it("renders the Syncfusion field", () => {
            expect(screen.getByTestId("username-syncfusion-field")).toBeInTheDocument();
        });
    });
});

describe("Hidden buttons", () => {
    beforeEach(() => {
        render(<DynamicForm fields={[]} buttons={{ hidden: true }} />);
    });

    it("doesn't render the buttons", () => {
        expect(screen.queryByTestId("buttons-container")).not.toBeInTheDocument();
    });
});

describe("Render conditions", () => {
    describe("When fields have render conditions", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[
                        { name: "username", type: EFieldType.TEXT },
                        {
                            name: "password",
                            type: EFieldType.PASSWORD,
                            conditions: {
                                condition: "and",
                                rules: [
                                    {
                                        field: "username",
                                        operator: EConditionRuleOperator.IS_NOT_EMPTY,
                                        value: null,
                                    },
                                ],
                            },
                        },
                    ]}
                />,
            );
        });

        it("doesn't render the password field", () => {
            expect(screen.queryByTestId("password-syncfusion-field")).not.toBeInTheDocument();
        });

        describe("When username is filled", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                        target: { value: "lorem.ipsum" },
                    }),
                );
            });

            it("renders the password field", () => {
                expect(screen.getByTestId("password-syncfusion-field")).toBeInTheDocument();
            });
        });
    });

    describe("When fields have render conditions with 'and' condition", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[
                        { name: "username", type: EFieldType.TEXT },
                        {
                            name: "password",
                            type: EFieldType.PASSWORD,
                            conditions: {
                                condition: "and",
                                rules: [
                                    { field: "username", operator: EConditionRuleOperator.IS_NOT_EMPTY, value: null },
                                    { field: "username", operator: EConditionRuleOperator.EQUAL, value: "lorem.ipsum" },
                                ],
                            },
                        },
                    ]}
                />,
            );
        });

        it("doesn't render the password field", () => {
            expect(screen.queryByTestId("password-syncfusion-field")).not.toBeInTheDocument();
        });

        describe("When username is filled with different value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("username-syncfusion-field"), { target: { value: "lorem" } }),
                );
            });

            it("doesn't render the password field", () => {
                expect(screen.queryByTestId("password-syncfusion-field")).not.toBeInTheDocument();
            });
        });

        describe("When username is filled with the correct value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                        target: { value: "lorem.ipsum" },
                    }),
                );
            });

            it("renders the password field", () => {
                expect(screen.getByTestId("password-syncfusion-field")).toBeInTheDocument();
            });
        });
    });

    describe("When fields have render conditions with 'or' condition", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[
                        { name: "username", type: EFieldType.TEXT },
                        {
                            name: "password",
                            type: EFieldType.PASSWORD,
                            conditions: {
                                condition: "or",
                                rules: [
                                    { field: "username", operator: EConditionRuleOperator.IS_NOT_EMPTY, value: null },
                                    { field: "username", operator: EConditionRuleOperator.EQUAL, value: "lorem.ipsum" },
                                ],
                            },
                        },
                    ]}
                />,
            );
        });

        it("doesn't render the password field", () => {
            expect(screen.queryByTestId("password-syncfusion-field")).not.toBeInTheDocument();
        });

        describe("When username is filled with different value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("username-syncfusion-field"), { target: { value: "lorem" } }),
                );
            });

            it("renders the password field", () => {
                expect(screen.getByTestId("password-syncfusion-field")).toBeInTheDocument();
            });
        });

        describe("When username is filled with the correct value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                        target: { value: "lorem.ipsum" },
                    }),
                );
            });

            it("renders the password field", () => {
                expect(screen.getByTestId("password-syncfusion-field")).toBeInTheDocument();
            });
        });
    });

    describe("When fields have render conditions with dynamic value", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[
                        { name: "password", type: EFieldType.PASSWORD },
                        { name: "confirm", type: EFieldType.PASSWORD },
                        {
                            name: "privacy",
                            type: EFieldType.CHECKBOX,
                            conditions: {
                                condition: "and",
                                rules: [
                                    { field: "password", operator: EConditionRuleOperator.IS_NOT_EMPTY, value: null },
                                    { field: "confirm", operator: EConditionRuleOperator.EQUAL, value: "{{password}}" },
                                ],
                            },
                        },
                    ]}
                />,
            );
        });

        it("doesn't render the privacy field", () => {
            expect(screen.queryByTestId("privacy-syncfusion-field")).not.toBeInTheDocument();
        });

        describe("When password and confirm are filled with different value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("password-syncfusion-field"), { target: { value: "lorem" } }),
                );
                act(() =>
                    fireEvent.change(screen.getByTestId("confirm-syncfusion-field"), { target: { value: "ipsum" } }),
                );
            });

            it("doesn't render the privacy field", () => {
                expect(screen.queryByTestId("privacy-syncfusion-field")).not.toBeInTheDocument();
            });
        });

        describe("When password and confirm are filled with same value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("password-syncfusion-field"), { target: { value: "lorem" } }),
                );
                act(() =>
                    fireEvent.change(screen.getByTestId("confirm-syncfusion-field"), { target: { value: "lorem" } }),
                );
            });

            it("renders the privacy field", () => {
                expect(screen.getByTestId("privacy-syncfusion-field")).toBeInTheDocument();
            });
        });
    });

    describe("When fields are grouped and have render conditions", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[
                        { name: "username", type: EFieldType.TEXT },
                        {
                            name: "group",
                            conditions: {
                                condition: "and",
                                rules: [
                                    {
                                        field: "username",
                                        operator: EConditionRuleOperator.IS_NOT_EMPTY,
                                        value: null,
                                    },
                                ],
                            },
                            fields: [
                                {
                                    name: "password",
                                    type: EFieldType.PASSWORD,
                                    conditions: {
                                        condition: "and",
                                        rules: [
                                            {
                                                field: "username",
                                                operator: EConditionRuleOperator.EQUAL,
                                                value: "lorem.ipsum",
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ]}
                />,
            );
        });

        it("doesn't render the password field", () => {
            expect(screen.queryByTestId("password-syncfusion-field")).not.toBeInTheDocument();
        });

        describe("When username is filled with different value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                        target: { value: "lorem" },
                    }),
                );
            });

            it("renders the group", () => {
                expect(screen.queryByTestId("group-group")).toBeInTheDocument();
            });

            it("doesn't render the password field", () => {
                expect(screen.queryByTestId("group___password-syncfusion-field")).not.toBeInTheDocument();
            });
        });

        describe("When username is filled with expected value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                        target: { value: "lorem.ipsum" },
                    }),
                );
            });

            it("renders the password field", () => {
                expect(screen.getByTestId("group___password-syncfusion-field")).toBeInTheDocument();
            });
        });
    });

    describe("When fields are grouped and have render conditions with dynamic value", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[
                        { name: "username", type: EFieldType.TEXT },
                        { name: "password", type: EFieldType.PASSWORD },
                        {
                            name: "check",
                            fields: [{ name: "confirm", type: EFieldType.PASSWORD }],
                        },
                        {
                            name: "privacy",
                            type: EFieldType.CHECKBOX,
                            conditions: {
                                condition: "and",
                                rules: [
                                    { field: "password", operator: EConditionRuleOperator.IS_NOT_EMPTY, value: null },
                                    // Same as: { field: "check___confirm", operator: EConditionRuleOperator.EQUAL, value: "{{password}}" },
                                    {
                                        field: "password",
                                        operator: EConditionRuleOperator.EQUAL,
                                        value: "{{check___confirm}}",
                                    },
                                    {
                                        field: "check___confirm",
                                        operator: EConditionRuleOperator.EQUAL,
                                        value: "{{password}}",
                                    },
                                ],
                            },
                        },
                    ]}
                />,
            );
        });

        it("doesn't render the privacy field", () => {
            expect(screen.queryByTestId("privacy-syncfusion-field")).not.toBeInTheDocument();
        });

        describe("When password and confirm are filled with different value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("password-syncfusion-field"), { target: { value: "lorem" } }),
                );
                act(() =>
                    fireEvent.change(screen.getByTestId("check___confirm-syncfusion-field"), {
                        target: { value: "ipsum" },
                    }),
                );
            });

            it("doesn't render the privacy field", () => {
                expect(screen.queryByTestId("privacy-syncfusion-field")).not.toBeInTheDocument();
            });
        });

        describe("When password and confirm are filled with same value", () => {
            beforeEach(() => {
                act(() =>
                    fireEvent.change(screen.getByTestId("password-syncfusion-field"), { target: { value: "lorem" } }),
                );
                act(() =>
                    fireEvent.change(screen.getByTestId("check___confirm-syncfusion-field"), {
                        target: { value: "lorem" },
                    }),
                );
            });

            it("renders the privacy field", () => {
                expect(screen.getByTestId("privacy-syncfusion-field")).toBeInTheDocument();
            });
        });
    });
});

describe("Group fields", () => {
    beforeEach(() => {
        render(
            <DynamicForm
                fields={[
                    {
                        name: "identification",
                        fields: [
                            {
                                name: "firstname",
                                type: EFieldType.TEXT,
                            },
                            {
                                name: "lastname",
                                type: EFieldType.TEXT,
                            },
                        ],
                    },
                    {
                        name: "contacts",
                        fields: [
                            {
                                name: "email",
                                fields: [
                                    {
                                        name: "email",
                                        type: EFieldType.EMAIL,
                                    },
                                ],
                            },
                            {
                                name: "phone",
                                type: EFieldType.TEXT,
                            },
                            {
                                fields: [
                                    {
                                        name: "address",
                                        type: EFieldType.TEXT,
                                    },
                                ],
                            },
                        ],
                    },
                ]}
                onSubmit={onSubmit}
                buttons={{
                    template: ({ onSubmit }) => (
                        <button data-testid="mock-on-submit" onClick={onSubmit}>
                            Submit
                        </button>
                    ),
                }}
            />,
        );
    });

    it("renders the identification group", () => {
        expect(screen.getByTestId("group-identification")).toBeInTheDocument();
    });

    it("renders the firstname field", () => {
        expect(screen.getByTestId("field-identification___firstname")).toBeInTheDocument();
    });

    it("renders the lastname field", () => {
        expect(screen.getByTestId("field-identification___lastname")).toBeInTheDocument();
    });

    it("renders the email group", () => {
        expect(screen.getByTestId("group-contacts___email")).toBeInTheDocument();
    });

    it("renders the email field", () => {
        expect(screen.getByTestId("field-contacts___email___email")).toBeInTheDocument();
    });

    it("renders the phone field", () => {
        expect(screen.getByTestId("field-contacts___phone")).toBeInTheDocument();
    });

    it("renders the address field", () => {
        expect(screen.getByTestId("field-contacts___address")).toBeInTheDocument();
    });

    describe("When user fills and submit the form", () => {
        beforeEach(() => {
            // Fill the form
            act(() => {
                fireEvent.change(screen.getByTestId("identification___firstname-syncfusion-field"), {
                    target: { value: "lorem" },
                });
                fireEvent.change(screen.getByTestId("identification___lastname-syncfusion-field"), {
                    target: { value: "ipsum" },
                });
                fireEvent.change(screen.getByTestId("contacts___email___email-syncfusion-field"), {
                    target: { value: "lorem.ipsum@gmail.com" },
                });
                fireEvent.change(screen.getByTestId("contacts___phone-syncfusion-field"), {
                    target: { value: "+391234567890" },
                });
                fireEvent.change(screen.getByTestId("contacts___address-syncfusion-field"), {
                    target: { value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
                });
            });
            // Fire onSubmit
            act(() => fireEvent.click(screen.getByTestId("mock-on-submit")));
        });

        it("calls the onSubmit callback with values", () => {
            expect(onSubmit).toHaveBeenCalledWith({
                identification: {
                    firstname: "lorem",
                    lastname: "ipsum",
                },
                contacts: {
                    email: { email: "lorem.ipsum@gmail.com" },
                    phone: "+391234567890",
                    address: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                },
            });
        });
    });
});

describe("Specific Test: Validation with preloaded values", () => {
    beforeEach(() => {
        const MyComponent = () => {
            const [values] = useState({ data: { username: "lorem.ipsum", email: "lorem.ipsum@gmail.com" } });
            // Render the form
            return (
                <DynamicForm
                    values={values.data}
                    fields={[
                        { name: "username", type: EFieldType.TEXT, validations: { required: true } },
                        { name: "password", type: EFieldType.PASSWORD, validations: { required: true } },
                        {
                            fields: [
                                { name: "email", type: EFieldType.EMAIL, validations: { required: true } },
                                { name: "phone", type: EFieldType.TEXT, validations: { required: true } },
                            ],
                        },
                        {
                            name: "privacy",
                            fields: [
                                { name: "privacy", type: EFieldType.CHECKBOX, validations: { required: true } },
                                { name: "date", type: EFieldType.DATE, validations: { required: true } },
                            ],
                        },
                    ]}
                    onSubmit={onSubmit}
                    buttons={{
                        template: ({ onSubmit }) => (
                            <button data-testid="mock-on-submit" onClick={onSubmit}>
                                Submit
                            </button>
                        ),
                    }}
                />
            );
        };
        // Render
        render(<MyComponent />);
    });

    describe("When user submits the form without filling required fields", () => {
        beforeEach(() => {
            // Fire onSubmit
            act(() => fireEvent.click(screen.getByTestId("mock-on-submit")));
        });

        it("doesn't call the onSubmit callback", () => {
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it("renders the error messages", () => {
            // Validation.This field is required is the default message of FormValidator
            // expect(screen.getByTestId("field-username-error")).toHaveTextContent("Validation.This field is required");
            expect(screen.getByTestId("field-password-error")).toHaveTextContent("Validation.This field is required");
            // expect(screen.getByTestId("field-email-error")).toHaveTextContent("Validation.This field is required");
            expect(screen.getByTestId("field-phone-error")).toHaveTextContent("Validation.This field is required");
            expect(screen.getByTestId("field-privacy___privacy-error")).toHaveTextContent(
                "Validation.This field is required",
            );
            expect(screen.getByTestId("field-privacy___date-error")).toHaveTextContent(
                "Validation.This field is required",
            );
        });
    });
});

describe("Validation form on init", () => {
    const onChanges = vi.fn();

    beforeEach(() => {
        render(
            <DynamicForm
                validateOnInit
                values={{ credentials: { username: "lorem.ipsum" } }}
                fields={[
                    {
                        name: "credentials",
                        fields: [
                            { name: "username", type: EFieldType.TEXT, validations: { required: true } },
                            { name: "password", type: EFieldType.PASSWORD, validations: { required: true } },
                        ],
                    },
                    { name: "privacy", type: EFieldType.CHECKBOX, validations: { required: true } },
                ]}
                onChanges={onChanges}
            />,
        );
    });

    it("calls onChanges callback with errors", () => {
        expect(onChanges).toHaveBeenCalledWith(
            {
                credentials: { username: "lorem.ipsum", password: null },
                privacy: null,
            },
            false,
        );
    });

    it("renders the error messages", () => {
        expect(screen.getByTestId("field-credentials___password-error")).toHaveTextContent(
            "Validation.This field is required",
        );
        expect(screen.getByTestId("field-privacy-error")).toHaveTextContent("Validation.This field is required");
    });
});

describe("Submit on clear", () => {
    describe("When submitOnClear is not set", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[{ name: "username", type: EFieldType.TEXT }]}
                    buttons={{ showBtnCancel: true }}
                    onSubmit={onSubmit}
                />,
            );

            // Fill some fields
            act(() => {
                fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                    target: { value: "lorem" },
                });
            });

            // Clear the form
            act(() => fireEvent.click(screen.getByTestId("btn-cancel")));
        });

        it("doesn't call the onSubmit callback", () => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    describe("When submitOnClear is set", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[{ name: "username", type: EFieldType.TEXT }]}
                    buttons={{ showBtnCancel: true }}
                    submitOnClear
                    onSubmit={onSubmit}
                />,
            );

            // Fill some fields
            act(() => {
                fireEvent.change(screen.getByTestId("username-syncfusion-field"), {
                    target: { value: "lorem" },
                });
            });

            // Clear the form
            act(() => fireEvent.click(screen.getByTestId("btn-cancel")));
        });

        it("calls the onSubmit callback with null values", () => {
            expect(onSubmit).toHaveBeenCalledWith({ username: null });
        });
    });
});

describe("Default TEXT field type", () => {
    beforeEach(() => {
        render(<DynamicForm fields={[{ name: "username" }]} />);
    });

    it("renders the field", () => {
        expect(screen.getByTestId("username-syncfusion-field")).toBeInTheDocument();
    });

    it("renders the TEXT field by default", () => {
        expect(screen.getByTestId("username-syncfusion-field")).toHaveAttribute("type", "text");
    });
});

describe("Default value of DATE type", () => {
    beforeEach(() => {
        render(
            <DynamicForm
                values={{ birthday: new Date(2020, 5, 23) }}
                fields={[{ name: "birthday", type: EFieldType.DATE, props: { format: "yyyy-MM-dd" } }]}
            />,
        );
    });

    it("renders the field", () => {
        expect(screen.getByTestId("birthday-syncfusion-field")).toBeInTheDocument();
    });

    it("renders the DATE field by default", () => {
        expect(screen.getByTestId("birthday-syncfusion-field")).toHaveValue("2020-06-23");
    });
});
