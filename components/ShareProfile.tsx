import { Button } from './Button';

export const ShareProfile = ({ address }: { address: string }) => {
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${address}`;
  
  const share = () => {
    if (navigator.share) {
      navigator.share({ title: 'Builder Profile', url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return <Button onClick={share} variant="secondary">Share Profile</Button>;
};

