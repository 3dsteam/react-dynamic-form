import { render, screen } from "@testing-library/react";
import { DynamicForm } from "./dynamic-form";
import { beforeEach, expect, it } from "vitest";

beforeEach(() => {
    render(<DynamicForm fields={[]} buttons={() => <></>} />);
});

it("renders the dynamic form component", () => {
    expect(screen.getByTestId("dynamic-form")).toBeInTheDocument();
});
