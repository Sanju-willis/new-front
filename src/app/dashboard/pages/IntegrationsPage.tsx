// src\app\dashboard\pages\IntegrationsPage.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function IntegrationsPage() {
  const router = useRouter();

  const platforms = [
    { name: 'Facebook', id: 'facebook' },
    { name: 'Instagram', id: 'instagram' },
    { name: 'YouTube', id: 'youtube' },
    { name: 'TikTok', id: 'tiktok' },
    { name: 'LinkedIn', id: 'linkedin' },
    { name: 'Google Analytics', id: 'google_analytics' },
  ];

 const handleConnect = (id: string) => {
  if (id === 'facebook' || id === 'instagram') {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook`;
  } else {
    alert(`TODO: Connect ${id}`);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Integrations</h1>
      <p className="text-muted-foreground mb-6">
        Connect your social media and analytics platforms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map(({ name, id }) => (
          <div
            key={id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <span className="font-medium">{name}</span>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
              onClick={() => handleConnect(id)}
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
