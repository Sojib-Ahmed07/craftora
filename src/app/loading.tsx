export default function UniversalGlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-xs transition-opacity duration-150">
      <div className="flex flex-col items-center space-y-4">
        {/* Clean, minimalist loading spinner ring */}
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-950" />
        <p className="text-xs font-medium text-neutral-500 tracking-wide animate-pulse">
          Syncing workspace components...
        </p>
      </div>
    </div>
  );
}