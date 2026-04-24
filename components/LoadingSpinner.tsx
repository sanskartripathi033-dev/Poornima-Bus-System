'use client';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
      {/* Animated bus icon */}
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[#FABE15] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-[#004892] flex items-center justify-center shadow-lg">
          <span className="text-white text-sm font-black">PU</span>
        </div>
      </div>
      <p className="text-slate-500 text-sm font-bold tracking-[0.2em] uppercase animate-pulse">{text}</p>
    </div>
  );
}
