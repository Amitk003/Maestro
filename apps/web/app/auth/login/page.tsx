import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Welcome to Maestro</h1>
          <p className="mt-2 text-sm text-zinc-600">Sign in to continue</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              One-time password
            </label>
            <input
              type="text"
              placeholder="Enter OTP"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            Sign in with OTP
          </button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-zinc-500">or</span>
            </div>
          </div>
          <button className="mt-6 w-full rounded-lg border px-4 py-2 text-sm hover:bg-zinc-50">
            Continue with Google
          </button>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-500">
          <Link href="/" className="underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
