import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-xl font-bold">Maestro</div>
        <nav className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Sign in
          </Link>
          <Link
            href="/customer/menu"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            View Menu
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Your restaurant runs itself.
          </h1>
          <p className="mt-6 text-lg text-zinc-600">
            Maestro predicts what happens next and acts before you have to.
            Customers get personal service. Kitchens run smooth. Staff know what
            to do. Managers see everything.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/customer/menu"
              className="rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-700"
            >
              Order Now
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full border px-6 py-3 text-zinc-900 hover:bg-zinc-50"
            >
              Staff Login
            </Link>
          </div>
        </div>

        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3 className="font-semibold">For Customers</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Describe what you feel like eating. Maestro builds the perfect
              meal for you and tracks it live.
            </p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="font-semibold">For Staff</h3>
            <p className="mt-2 text-sm text-zinc-600">
              A ranked list of what to do next. No guessing. No shouting across
              the room.
            </p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="font-semibold">For Managers</h3>
            <p className="mt-2 text-sm text-zinc-600">
              A live map of your restaurant. AI agents that negotiate to keep
              everything running smooth.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
