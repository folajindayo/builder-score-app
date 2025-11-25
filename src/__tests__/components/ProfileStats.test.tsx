import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileStats from "@/components/profile/ProfileStats";

describe("ProfileStats", () => {
  const mockStats = [
    { label: "Total Score", value: "1,250", trend: "up" as const, trendValue: "+15%" },
    { label: "Rank", value: "#42", trend: "neutral" as const },
    { label: "Projects", value: 12 },
    { label: "Contributions", value: 89, trend: "down" as const, trendValue: "-5%" },
  ];

  it("renders all stats correctly", () => {
    render(<ProfileStats stats={mockStats} />);

    expect(screen.getByText("Total Score")).toBeInTheDocument();
    expect(screen.getByText("1,250")).toBeInTheDocument();
    expect(screen.getByText("Rank")).toBeInTheDocument();
    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("displays trend indicators correctly", () => {
    render(<ProfileStats stats={mockStats} />);

    expect(screen.getByText("↑ +15%")).toBeInTheDocument();
    expect(screen.getByText("↓ -5%")).toBeInTheDocument();
  });

  it("handles stats without trends", () => {
    const statsWithoutTrends = [
      { label: "Score", value: 100 },
      { label: "Rank", value: 10 },
    ];

    render(<ProfileStats stats={statsWithoutTrends} />);

    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.queryByText(/↑|↓/)).not.toBeInTheDocument();
  });

  it("renders correct trend colors", () => {
    const { container } = render(<ProfileStats stats={mockStats} />);

    const upTrend = container.querySelector(".text-green-600");
    const downTrend = container.querySelector(".text-red-600");

    expect(upTrend).toBeInTheDocument();
    expect(downTrend).toBeInTheDocument();
  });
});

