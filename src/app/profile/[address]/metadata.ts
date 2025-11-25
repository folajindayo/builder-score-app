import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { address: string } }): Promise<Metadata> {
  return {
    title: `Builder Profile - ${params.address}`,
    description: 'View builder score, credentials, and activity',
    openGraph: {
      title: `Builder Profile - ${params.address}`,
      description: 'View builder score, credentials, and activity',
      type: 'profile',
    },
  };
}

