import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MagneticButton from "../components/MagneticButton";
import ProductCard from "../components/ProductCard";
import { ToastProvider, useToast } from "../components/Toast";
import { Product } from "../types";

// Mock motion/react to prevent complex 3D CSS rendering errors off-browser
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe("Menswear Boutique UI Unit Tests Suite", () => {
  
  it("renders MagneticButton correctly and handles hover mouse pull callbacks", () => {
    const handleClick = jest.fn();
    render(
      <MagneticButton onClick={handleClick} id="test-mag-btn">
        COUTURE SHIELD
      </MagneticButton>
    );

    const button = screen.getByRole("button", { name: /COUTURE SHIELD/i });
    expect(button).toBeInTheDocument();
    
    // Simulate mouse move over the button boundary
    fireEvent.mouseMove(button, { clientX: 100, clientY: 100 });
    
    // Check click callback triggers successfully
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Reset mouse pos
    fireEvent.mouseLeave(button);
  });

  it("renders ProductCard interactive elements and supports 3D flip toggles", () => {
    const dummyProduct: Product = {
      id: "test-p",
      name: "Asymmetric Obsidian Overcoat",
      price: "$1,600",
      category: "Shirts",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
      sizes: ["S", "M", "L"],
      countInStock: 2,
      description: "An Obsidian test overcoat description"
    };

    // Render inside ToastProvider since ProductCard utilizes the useToast hook of the application
    render(
      <ToastProvider>
        <ProductCard product={dummyProduct} isLoggedIn={false} />
      </ToastProvider>
    );

    // Front of product check
    expect(screen.getByText("Asymmetric Obsidian Overcoat")).toBeInTheDocument();
    expect(screen.getByText("$1,600")).toBeInTheDocument();
    expect(screen.getByText("SHIRTS")).toBeInTheDocument();

    // Trigger Y-rotation flip specs toggle
    const flipButton = screen.getByRole("button", { name: /INTERACTIVE SPECIFICATIONS & STOCK/i });
    expect(flipButton).toBeInTheDocument();
    fireEvent.click(flipButton);

    // Back of product check
    expect(screen.getByText("An Obsidian test overcoat description")).toBeInTheDocument();
    
    // S, M, L options verified
    expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "L" })).toBeInTheDocument();
  });

  it("ToastProvider triggers beautiful active system notifications elegantly", () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <div>
          <button onClick={() => toast.showToast("Couture order complete", "success")}>
            TRIGGER TOAST
          </button>
          <button onClick={() => toast.showDefaultToast()}>
            DEEPAK BISHNOI TOAST
          </button>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Trigger standard custom success toast notification
    const triggerBtn = screen.getByRole("button", { name: "TRIGGER TOAST" });
    fireEvent.click(triggerBtn);
    expect(screen.getByText("Couture order complete")).toBeInTheDocument();

    // Trigger exact requested default developer attribution toast
    const devBtn = screen.getByRole("button", { name: "DEEPAK BISHNOI TOAST" });
    fireEvent.click(devBtn);
    expect(screen.getByText("Exclusive Feature Setup by Deepak Bishnoi.")).toBeInTheDocument();
  });
});
