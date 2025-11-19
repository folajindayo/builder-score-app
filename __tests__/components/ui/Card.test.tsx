import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders children correctly", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("applies correct padding styles", () => {
      const { container, rerender } = render(<Card padding="sm">Content</Card>);
      expect(container.firstChild).toHaveClass("p-3");

      rerender(<Card padding="lg">Content</Card>);
      expect(container.firstChild).toHaveClass("p-6");
    });

    it("applies hover styles when hover prop is true", () => {
      const { container } = render(<Card hover>Content</Card>);
      expect(container.firstChild).toHaveClass("hover:shadow-md");
    });
  });

  describe("CardHeader", () => {
    it("renders children correctly", () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText("Header content")).toBeInTheDocument();
    });
  });

  describe("CardTitle", () => {
    it("renders as h3 element", () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      expect(container.querySelector("h3")).toBeInTheDocument();
    });

    it("applies correct text styles", () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      expect(container.firstChild).toHaveClass("text-lg");
      expect(container.firstChild).toHaveClass("font-semibold");
    });
  });

  describe("CardDescription", () => {
    it("renders as paragraph", () => {
      const { container } = render(<CardDescription>Description</CardDescription>);
      expect(container.querySelector("p")).toBeInTheDocument();
    });

    it("applies correct text styles", () => {
      const { container } = render(<CardDescription>Description</CardDescription>);
      expect(container.firstChild).toHaveClass("text-sm");
    });
  });

  describe("CardContent", () => {
    it("renders children correctly", () => {
      render(<CardContent>Content</CardContent>);
      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("CardFooter", () => {
    it("renders children correctly", () => {
      render(<CardFooter>Footer</CardFooter>);
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("applies flex layout", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.firstChild).toHaveClass("flex");
    });
  });

  describe("Full Card Example", () => {
    it("renders complete card structure", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card Description")).toBeInTheDocument();
      expect(screen.getByText("Card Content")).toBeInTheDocument();
      expect(screen.getByText("Card Footer")).toBeInTheDocument();
    });
  });
});

