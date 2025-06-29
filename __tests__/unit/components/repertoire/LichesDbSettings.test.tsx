/**
 * @jest-environment jsdom
 */
import LichessDbSettings from "@/components/repertoire/movepopularity/LichessDbSettings";
import { MovePopualritySettings } from "@/lib/types/types";
import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/lib/actions/repertoire", () => ({
    updateRepertoireField: jest.fn(),
}));

jest.mock("@/lib/hooks/useChange", () => ({
    __esModule: true,
    default: (callback: () => void) => {
        callback();
    },
}));

const initialSettings: MovePopualritySettings = {
    timeControls: ["rapid"],
    ratings: [1900, 2100],
};

const mockSetSettings = jest.fn();

const renderComponent = (settings = initialSettings) => {
    const { container } = render(
        <LichessDbSettings
            settings={settings}
            setSettings={mockSetSettings}
            repertoireId="rep1"
        />
    );
    return container;
};

describe("LichessDbSettings", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders both sections correctly", () => {
        renderComponent();
        expect(screen.getByText("Include time controls:")).toBeInTheDocument();
        expect(
            screen.getByText("Include players with avg. ratings of:")
        ).toBeInTheDocument();
        expect(screen.getByText("1900")).toBeInTheDocument();
        expect(screen.getByText("2100")).toBeInTheDocument();
    });

    it("calls setSettings when a time control is toggled", () => {
        const container = renderComponent({
            ...initialSettings,
            timeControls: ["rapid", "classical"],
        });

        const timeControlDivs = container.querySelectorAll(".svg-container");
        expect(timeControlDivs.length).toBeGreaterThan(0);

        fireEvent.click(timeControlDivs[0]);

        expect(mockSetSettings).toHaveBeenCalled();
    });

    it("calls setSettings when a rating is toggled", () => {
        renderComponent();

        const rating = screen.getByText("1900");
        fireEvent.click(rating);

        expect(mockSetSettings).toHaveBeenCalled();
    });

    it("does not change timeControls when unselecting the only selected time control", () => {
        const container = renderComponent({
            ...initialSettings,
            timeControls: ["rapid"],
        });

        const activeDiv = Array.from(
            container.querySelectorAll(".svg-container")
        ).find((el) => el.className.includes("time-control-active"));

        expect(activeDiv).toBeDefined();
        fireEvent.click(activeDiv!);

        expect(mockSetSettings).toHaveBeenCalled();

        const updater = mockSetSettings.mock.calls[0][0];
        const result = updater({
            timeControls: ["rapid"],
            ratings: [1900, 2100],
        });

        expect(result).toEqual({
            timeControls: ["rapid"],
            ratings: [1900, 2100],
        });
    });

    it("does not change ratings when unselecting the only selected rating", () => {
        renderComponent({
            timeControls: ["rapid", "classical"],
            ratings: [1900],
        });

        const rating = screen.getByText("1900");
        fireEvent.click(rating);

        expect(mockSetSettings).toHaveBeenCalled();

        const updater = mockSetSettings.mock.calls[0][0];
        const result = updater({
            timeControls: ["rapid", "classical"],
            ratings: [1900],
        });

        expect(result).toEqual({
            timeControls: ["rapid", "classical"],
            ratings: [1900],
        });
    });
});
