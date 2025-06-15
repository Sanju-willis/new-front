// src\app\signup\page.tsx
'use client';

export default function SignupPage() {
  const providers = [
    { name: 'Facebook', id: 'facebook', color: 'bg-blue-600', url: '/signup/facebook' },
    { name: 'Google', id: 'google', color: 'bg-red-600', url: '/signup/google' },
    { name: 'LinkedIn', id: 'linkedin', color: 'bg-blue-800', url: '/signup/linkedin' },
    { name: 'TikTok', id: 'tiktok', color: 'bg-black', url: '/signup/tiktok' },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Sign up to Aenigm3</h1>

      <div className="w-full max-w-sm space-y-4">
        {providers.map((provider) => (
          <a
            key={provider.id}
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${provider.url}`}
            className={`w-full block text-center text-white py-3 rounded-md shadow-md hover:opacity-90 transition ${provider.color}`}
          >
            Sign up with {provider.name}
          </a>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500">More login methods coming soon...</p>
    </main>
  );
}
