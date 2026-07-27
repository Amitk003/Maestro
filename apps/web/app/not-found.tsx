import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-purple-600 p-[1px] mx-auto mb-6">
          <div className="h-full w-full bg-zinc-950 rounded-[11px] flex items-center justify-center font-extrabold text-white text-xl">
            M
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white mb-3">404</h1>
        <p className="text-sm text-zinc-400 mb-8">This page is not on the menu.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
