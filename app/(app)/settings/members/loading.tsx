export default function MembersSettingsLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="flex gap-3">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4 h-5 w-48 animate-pulse rounded bg-slate-200" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
