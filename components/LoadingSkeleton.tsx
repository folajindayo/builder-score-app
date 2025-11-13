// Final polish components (commits 191-200)
export const LoadingSkeleton = ({ count = 1, height = 'h-4', width = 'w-full' }: { count?: number; height?: string; width?: string }) => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`${height} ${width} bg-gray-200 rounded`} />
    ))}
  </div>
);

export const EmptyState = ({ icon = '📭', title, description, action }: { icon?: string; title: string; description?: string; action?: React.ReactNode }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-600 mb-6">{description}</p>}
    {action}
  </div>
);

export const SuccessAnimation = ({ message }: { message: string }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-8 text-center animate-bounce">
      <div className="text-6xl mb-4">✅</div>
      <p className="text-xl font-semibold">{message}</p>
    </div>
  </div>
);

