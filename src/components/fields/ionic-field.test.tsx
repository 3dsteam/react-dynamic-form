import { beforeEach, describe } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { IonicField } from "./ionic-field";
import { EFieldType } from "../../models/field";
import { IonApp } from "@ionic/react";

const onChange = vi.fn();

describe("Text field", () => {
    beforeEach(() => {
        render(
            <IonApp>
                <IonicField
                    field={{
                        name: "username",
                        type: EFieldType.TEXT,
                    }}
                    value="lorem ipsum"
                    onChange={onChange}
                />
            </IonApp>,
        );
    });

    it("renders the input field", () => {
        expect(screen.getByTestId("username-ionic-field")).toBeInTheDocument();
    });

    it("renders the input field with the value", () => {
        expect(screen.getByTestId("username-ionic-field")).toHaveValue("lorem ipsum");
    });

    describe("When the value changes", () => {
        beforeEach(async () => {
            // Wait for the input to be rendered
            await vi.waitFor(() => {
                expect(screen.getByTestId("username-ionic-field").querySelector("input")).toBeInTheDocument();
            });
            // Change the value
            fireEvent.input(screen.getByTestId("username-ionic-field").querySelector("input")!, {
                target: { value: "dolor sit amet" },
            });
        });

        it("calls the onChange callback", () => {
            expect(onChange).toHaveBeenCalledWith("dolor sit amet");
        });
    });
});

describe("Password field", () => {
    beforeEach(() => {
        render(
            <IonApp>
                <IonicField
                    field={{
                        name: "password",
                        type: EFieldType.PASSWORD,
                    }}
                    value="my-password"
                    onChange={onChange}
                />
            </IonApp>,
        );
    });

    it("renders the input field", () => {
        expect(screen.getByTestId("password-ionic-field")).toBeInTheDocument();
    });

    it("renders field with password type", () => {
        expect(screen.getByTestId("password-ionic-field")).toHaveAttribute("type", "password");
    });

    it("renders the input field with the value", () => {
        expect(screen.getByTestId("password-ionic-field")).toHaveValue("my-password");
    });

    describe("When the value changes", () => {
        beforeEach(async () => {
            // Wait for the input to be rendered
            await vi.waitFor(() => {
                expect(screen.getByTestId("password-ionic-field").querySelector("input")).toBeInTheDocument();
            });
            // Change the value
            fireEvent.input(screen.getByTestId("password-ionic-field").querySelector("input")!, {
                target: { value: "my-password-2" },
            });
        });

        it("calls the onChange callback", () => {
            expect(onChange).toHaveBeenCalledWith("my-password-2");
        });
    });
});

describe("Email field", () => {
    beforeEach(() => {
        render(
            <IonApp>
                <IonicField
                    field={{
                        name: "email",
                        type: EFieldType.EMAIL,
                    }}
                    value="lorem.ipsum@gmail.com"
                    onChange={onChange}
                />
            </IonApp>,
        );
    });

    it("renders the input field", () => {
        expect(screen.getByTestId("email-ionic-field")).toBeInTheDocument();
    });

    it("renders field with email type", () => {
        expect(screen.getByTestId("email-ionic-field")).toHaveAttribute("type", "email");
    });

    it("renders the input field with the value", () => {
        expect(screen.getByTestId("email-ionic-field")).toHaveValue("lorem.ipsum@gmail.com");
    });

    describe("When the value changes", () => {
        beforeEach(async () => {
            // Wait for the input to be rendered
            await vi.waitFor(() => {
                expect(screen.getByTestId("email-ionic-field").querySelector("input")).toBeInTheDocument();
            });
            // Change the value
            fireEvent.input(screen.getByTestId("email-ionic-field").querySelector("input")!, {
                target: { value: "dolor.sit.amet@gmail.com" },
            });
        });

        it("calls the onChange callback", () => {
            expect(onChange).toHaveBeenCalledWith("dolor.sit.amet@gmail.com");
        });
    });
});

describe("Number field", () => {
    beforeEach(() => {
        render(
            <IonApp>
                <IonicField
                    field={{
                        name: "age",
                        type: EFieldType.NUMBER,
                    }}
                    value={25}
                    onChange={onChange}
                />
            </IonApp>,
        );
    });

    it("renders the input field", () => {
        expect(screen.getByTestId("age-ionic-field")).toBeInTheDocument();
    });

    it("renders field with number type", () => {
        expect(screen.getByTestId("age-ionic-field")).toHaveAttribute("type", "number");
    });

    it("renders the input field with the value", () => {
        expect(screen.getByTestId("age-ionic-field")).toHaveValue(25);
    });

    describe("When the value changes", () => {
        beforeEach(async () => {
            // Wait for the input to be rendered
            await vi.waitFor(() => {
                expect(screen.getByTestId("age-ionic-field").querySelector("input")).toBeInTheDocument();
            });
            // Change the value
            fireEvent.input(screen.getByTestId("age-ionic-field").querySelector("input")!, {
                target: { value: 29 },
            });
        });

        it("calls the onChange callback", () => {
            expect(onChange).toHaveBeenCalledWith("29");
        });
    });
});

describe("Textarea field", () => {
    beforeEach(() => {
        render(
            <IonApp>
                <IonicField
                    field={{
                        name: "notes",
                        type: EFieldType.TEXTAREA,
                    }}
                    value="Lorem ipsum dolor sit amet"
                    onChange={onChange}
                />
            </IonApp>,
        );
    });

    it("renders the input field", () => {
        expect(screen.getByTestId("notes-ionic-field")).toBeInTheDocument();
    });

    it("renders the input field with the value", () => {
        expect(screen.getByTestId("notes-ionic-field")).toHaveValue("Lorem ipsum dolor sit amet");
    });

    describe("When the value changes", () => {
        beforeEach(async () => {
            // Wait for the input to be rendered
            await vi.waitFor(() => {
                expect(screen.getByTestId("notes-ionic-field").querySelector("textarea")).toBeInTheDocument();
            });
            // Change the value
            fireEvent.input(screen.getByTestId("notes-ionic-field").querySelector("textarea")!, {
                target: { value: "Dolor sit amet" },
            });
        });

        it("calls the onChange callback", () => {
            expect(onChange).toHaveBeenCalledWith("Dolor sit amet");
        });
    });
});

describe.todo("Date field");

describe("Select field", () => {
    beforeEach(() => {
        render(
            <IonApp>
                <IonicField
                    field={{
                        name: "country",
                        type: EFieldType.SELECT,
                        props: {
                            options: [
                                { value: "us", text: "United States" },
                                { value: "it", text: "Italy" },
                                { value: "es", text: "Spain" },
                                { value: "fr", text: "France" },
                            ],
                        },
                    }}
                    value="it"
                    onChange={onChange}
                />
            </IonApp>,
        );
    });

    it("renders the select field", () => {
        expect(screen.getByTestId("country-ionic-field")).toBeInTheDocument();
    });

    it("renders the select field with the value", () => {
        expect(screen.getByTestId("country-ionic-field")).toHaveValue("it");
    });

    it("renders the options", () => {
        expect(screen.getAllByTestId("country-ionic-field-option")).toHaveLength(4);
    });

    describe.todo("When the value changes");
});

describe("Checkbox field", () => {
    beforeEach(async () => {
        render(
            <IonApp>
                <IonicField
                    field={{
                        name: "privacy",
                        type: EFieldType.CHECKBOX,
                    }}
                    value={true}
                    onChange={onChange}
                />
            </IonApp>,
        );
        // Wait for the input to be rendered
        await vi.waitFor(() => {
            expect(screen.getByTestId("privacy-ionic-field").querySelector("input")).toBeInTheDocument();
        });
    });

    it("renders the input field", () => {
        expect(screen.getByTestId("privacy-ionic-field")).toBeInTheDocument();
    });

    it("renders the input field with the value", () => {
        expect(screen.getByTestId("privacy-ionic-field").querySelector("input")!).toHaveValue("on");
    });

    describe("When the value changes", () => {
        beforeEach(async () => {
            // Change the value
            fireEvent.click(screen.getByTestId("privacy-ionic-field").querySelector("input")!);
        });

        it("calls the onChange callback", () => {
            expect(onChange).toHaveBeenCalledWith(false);
        });
    });
});
