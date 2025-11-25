// Component tests (commits 141-155)
import { render, screen } from '@testing-library/react';
import { SocialLinks } from '@/components/SocialLinks';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { AchievementBadges } from '@/components/AchievementBadges';
import { PrivacySettings } from '@/components/PrivacySettings';
import { ShareProfile } from '@/components/ShareProfile';
import { ProfileAnalytics } from '@/components/ProfileAnalytics';
import { ImageUpload } from '@/components/ImageUpload';

describe('Profile Components', () => {
  it('should render SocialLinks', () => {
    render(<SocialLinks website="https://example.com" twitter="testuser" github="testuser" />);
    expect(screen.getByText('🌐')).toBeInTheDocument();
  });

  it('should render ActivityTimeline', () => {
    const events = [{ date: '2024-01-01', title: 'Test', description: 'Test event' }];
    render(<ActivityTimeline events={events} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should render AchievementBadges', () => {
    const badges = [{ name: 'First', icon: '🎯', earned: true }];
    render(<AchievementBadges badges={badges} />);
    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('should render PrivacySettings', () => {
    render(<PrivacySettings settings={{ publicProfile: true }} onChange={() => {}} />);
    expect(screen.getByText('Public Profile')).toBeInTheDocument();
  });

  it('should render ShareProfile', () => {
    render(<ShareProfile address="0x123" />);
    expect(screen.getByText('Share Profile')).toBeInTheDocument();
  });

  it('should render ProfileAnalytics', () => {
    render(<ProfileAnalytics views={100} interactions={50} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should render ImageUpload', () => {
    render(<ImageUpload onUpload={() => {}} />);
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });
});

