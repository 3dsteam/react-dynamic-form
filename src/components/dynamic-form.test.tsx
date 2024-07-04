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

describe("Field Mode", () => {
    describe("When mode is not set", () => {
        beforeEach(() => {
            render(<DynamicForm fields={[{ name: "username", type: EFieldType.TEXT }]} onSubmit={onSubmit} />);
        });

        it("renders the Syncfusion field by default", () => {
            expect(screen.getByTestId("username-syncfusion-field")).toBeInTheDocument();
        });
    });

    describe("When mode is set to 'syncfusion'", () => {
        beforeEach(() => {
            render(
                <DynamicForm
                    fields={[{ name: "username", type: EFieldType.TEXT }]}
                    mode="syncfusion"
                    onSubmit={onSubmit}
                />,
            );
        });

        it("renders the Syncfusion field", () => {
            expect(screen.getByTestId("username-syncfusion-field")).toBeInTheDocument();
        });
    });

    describe("When mode is set to 'ionic'", () => {
        beforeEach(() => {
            render(
                <DynamicForm fields={[{ name: "username", type: EFieldType.TEXT }]} mode="ionic" onSubmit={onSubmit} />,
            );
        });

        it("renders the Ionic field", () => {
            expect(screen.getByTestId("username-ionic-field")).toBeInTheDocument();
        });
    });
});

describe("Hidden buttons", () => {
    beforeEach(() => {
        render(<DynamicForm fields={[]} onSubmit={onSubmit} buttons={{ hidden: true }} />);
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
                    onSubmit={onSubmit}
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
                    onSubmit={onSubmit}
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
                    onSubmit={onSubmit}
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
                    onSubmit={onSubmit}
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
});
