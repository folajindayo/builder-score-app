/**
 * ScoreCard Component Tests
 */

import { render, screen } from '@testing-library/react';
import { ScoreCard } from '../components/ScoreCard';

describe('ScoreCard', () => {
  it('displays score', () => {
    render(<ScoreCard score={85} level="Elite" address="0x123" />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('displays level', () => {
    render(<ScoreCard score={85} level="Elite" address="0x123" />);
    expect(screen.getByText('Elite')).toBeInTheDocument();
  });

  it('truncates address', () => {
    render(<ScoreCard score={85} level="Elite" address="0x1234567890" />);
    expect(screen.getByText('0x1234567890')).toBeInTheDocument();
  });
});

