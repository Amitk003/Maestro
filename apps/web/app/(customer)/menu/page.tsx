export default function MenuPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Menu</h1>
      <p className="mt-2 text-zinc-600">
        Tell us what you feel like eating and we will build the perfect meal for
        you.
      </p>
      <div className="mt-8">
        <label className="block text-sm font-medium">
          What are you in the mood for?
        </label>
        <textarea
          placeholder="Example: 30 minutes, light high-protein, pre-show dinner, upbeat mood"
          className="mt-2 w-full rounded-lg border p-4 text-sm"
          rows={4}
        />
        <button className="mt-4 rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-700">
          Create my meal
        </button>
      </div>
    </div>
  );
}
