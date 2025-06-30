import DepthControl from "@/components/repertoire/stockfish/DepthControl";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DepthControl", () => {
    const defaultProps = {
        depth: 15,
        setDepth: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("displays current depth value", () => {
        render(<DepthControl {...defaultProps} depth={20} />);

        expect(screen.getByText("20")).toBeInTheDocument();
        expect(screen.getByText("Depth:")).toBeInTheDocument();
        expect(
            screen.getByText("Depth affects engine performance!")
        ).toBeInTheDocument();
    });

    it("increases depth when + button is clicked", async () => {
        render(<DepthControl {...defaultProps} />);

        const plusButton = screen.getByText("+");
        await userEvent.click(plusButton);

        expect(defaultProps.setDepth).toHaveBeenCalledWith(16);
    });

    it("decreases depth when - button is clicked", async () => {
        render(<DepthControl {...defaultProps} />);

        const minusButton = screen.getByText("-");
        await userEvent.click(minusButton);

        expect(defaultProps.setDepth).toHaveBeenCalledWith(14);
    });
});
