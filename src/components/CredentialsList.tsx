/**
 * CredentialsList Component
 */

'use client';

import { Credential } from '../lib/types/builder.types';
import { formatDate } from '../lib/utils/format.utils';

interface CredentialsListProps {
  credentials: Credential[];
}

export function CredentialsList({ credentials }: CredentialsListProps) {
  if (credentials.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No credentials found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Credentials</h3>
      {credentials.map((credential) => (
        <div key={credential.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-bold">{credential.name}</p>
              <p className="text-sm text-gray-500">{credential.issuer}</p>
            </div>
            {credential.verified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Issued: {formatDate(credential.issuedAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

