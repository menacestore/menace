export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Loading...</p>
      </div>
    </div>
  );
}
