// src\app\signup\page.tsx
export default function SignupPage() {
  return (
    <main className="h-screen flex items-center justify-center">
      <a
        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook`}
        className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition"
      >
        Sign up with Facebook
      </a>
    </main>
  );
}
