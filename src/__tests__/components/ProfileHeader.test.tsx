import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileHeader from "@/components/profile/ProfileHeader";

describe("ProfileHeader", () => {
  const mockProps = {
    address: "0x1234567890123456789012345678901234567890",
    score: 1250,
    rank: 42,
    username: "TestUser",
    badges: ["Early Adopter", "Top Contributor"],
  };

  it("renders user information correctly", () => {
    render(<ProfileHeader {...mockProps} />);

    expect(screen.getByText("TestUser")).toBeInTheDocument();
    expect(screen.getByText("1250")).toBeInTheDocument();
    expect(screen.getByText("Rank #42")).toBeInTheDocument();
  });

  it("displays truncated address", () => {
    render(<ProfileHeader {...mockProps} />);

    expect(screen.getByText("0x1234...7890")).toBeInTheDocument();
  });

  it("renders badges correctly", () => {
    render(<ProfileHeader {...mockProps} />);

    expect(screen.getByText("Early Adopter")).toBeInTheDocument();
    expect(screen.getByText("Top Contributor")).toBeInTheDocument();
  });

  it("does not render rank badge when rank is not provided", () => {
    const propsWithoutRank = { ...mockProps, rank: undefined };
    render(<ProfileHeader {...propsWithoutRank} />);

    expect(screen.queryByText(/Rank #/)).not.toBeInTheDocument();
  });

  it("uses address as fallback when username is not provided", () => {
    const propsWithoutUsername = { ...mockProps, username: undefined };
    render(<ProfileHeader {...propsWithoutUsername} />);

    expect(screen.getByText("0x1234...7890")).toBeInTheDocument();
  });

  it("renders empty badges array without errors", () => {
    const propsWithoutBadges = { ...mockProps, badges: [] };
    render(<ProfileHeader {...propsWithoutBadges} />);

    expect(screen.queryByText("Early Adopter")).not.toBeInTheDocument();
  });
});

