// src/app/dashboard/pages/IntegrationsPage.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function IntegrationsPage() {
  const router = useRouter();
  const { platforms } = useAuthStore();

  const platformsList = [
    { name: 'Facebook', id: 'facebook' },
    { name: 'Instagram', id: 'instagram' },
    { name: 'YouTube', id: 'youtube' },
    { name: 'TikTok', id: 'tiktok' },
    { name: 'LinkedIn', id: 'linkedin' },
    { name: 'Google Analytics', id: 'google' },
  ];

  const isConnected = (platformId: string) =>
    platforms?.some((p) => p.platform === platformId);

  const handleConnect = (id: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/connect/${id}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Integrations</h1>
      <p className="text-muted-foreground mb-6">
        Connect your social media and analytics platforms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformsList.map(({ name, id }) => {
          const connected = isConnected(id);

          return (
            <div
              key={id}
              className="border rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition"
            >
              <div>
                <span className="font-medium text-gray-800">{name}</span>
                {connected && (
                  <span className="ml-2 text-green-600 text-sm">Connected</span>
                )}
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition disabled:bg-gray-400"
                onClick={() => handleConnect(id)}
                disabled={connected}
              >
                {connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
