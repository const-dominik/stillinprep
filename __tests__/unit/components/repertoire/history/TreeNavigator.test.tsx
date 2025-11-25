import TreeNavigator from "@/components/repertoire/history/TreeNavigator";
import { fireEvent } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import { create_e4_e5_Nf3, TestProviders } from "../../../utils";

describe("Tree navigator", () => {
    it("changes line on arrow click", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <TestProviders
                current={e5}
                last={Nf3}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <TreeNavigator />,
            </TestProviders>
        );

        const rightArrow = screen.getByText("→");
        fireEvent.click(rightArrow);

        expect(setCurrentNode).toHaveBeenCalledWith(Nf3);

        const leftArrow = screen.getByText("←");
        fireEvent.click(leftArrow);

        expect(setCurrentNode).toHaveBeenCalledWith(e4);
    });

    it("doesn't change line when we're on the tree edges (right)", () => {
        const [e4] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <TestProviders
                current={e4}
                last={e4}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <TreeNavigator />,
            </TestProviders>
        );

        const rightArrow = screen.getByText("→");
        fireEvent.click(rightArrow);

        expect(setCurrentNode).not.toHaveBeenCalled();
        expect(setLastNode).not.toHaveBeenCalled();
    });

    it("doesn't change line when we're on the tree edges (left)", () => {
        const [e4] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <TestProviders
                current={e4.parent}
                last={e4}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <TreeNavigator />,
            </TestProviders>
        );

        const leftArrow = screen.getByText("←");
        fireEvent.click(leftArrow);

        expect(setCurrentNode).not.toHaveBeenCalled();
        expect(setLastNode).not.toHaveBeenCalled();
    });

    it("changes current node when using arrows", () => {
        const [e4, e5, Nf3] = create_e4_e5_Nf3();
        const setCurrentNode = jest.fn();
        const setLastNode = jest.fn();

        render(
            <TestProviders
                current={e5}
                last={Nf3}
                mockSetLast={setLastNode}
                mockSetRoot={setCurrentNode}
            >
                <TreeNavigator />,
            </TestProviders>
        );

        fireEvent.keyDown(document, { key: "ArrowLeft" });

        expect(setCurrentNode).toHaveBeenCalledWith(e4);

        fireEvent.keyDown(document, { key: "ArrowRight" });
        expect(setCurrentNode).toHaveBeenCalledWith(Nf3);
    });
});
