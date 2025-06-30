import ResultsRatio from "@/components/repertoire/movepopularity/ResultsRatio";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("ResultsRatio", () => {
    it("renders correct bars with proper percentages and titles", () => {
        render(<ResultsRatio white={35} draws={40} black={25} />);

        const white = screen.getByTitle("35.00%");
        expect(white).toHaveStyle("flex-basis: 35%");
        expect(white).toHaveTextContent("35.00%");

        const draw = screen.getByTitle("40.00%");
        expect(draw).toHaveStyle("flex-basis: 40%");
        expect(draw).toHaveTextContent("40.00%");

        const black = screen.getByTitle("25.00%");
        expect(black).toHaveStyle("flex-basis: 25%");
        expect(black).toHaveTextContent("25.00%");
    });

    it("hides label if percentage is below 25", () => {
        render(<ResultsRatio white={5} draws={15} black={80} />);

        expect(screen.getByTitle("5.00%")).toHaveTextContent("");
        expect(screen.getByTitle("15.00%")).toHaveTextContent("");
        expect(screen.getByTitle("80.00%")).toHaveTextContent("80.00%");
    });

    it("renders only the non-zero segments", () => {
        render(<ResultsRatio white={0} draws={49} black={51} />);

        expect(screen.queryByTitle("0.00%")).not.toBeInTheDocument();
        expect(screen.getByTitle("49.00%")).toBeInTheDocument();
        expect(screen.getByTitle("51.00%")).toBeInTheDocument();
    });
});
