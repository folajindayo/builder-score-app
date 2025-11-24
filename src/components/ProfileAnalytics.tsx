export const ProfileAnalytics = ({ views, interactions }: { views: number; interactions: number }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-blue-50 p-4 rounded-lg">
      <p className="text-2xl font-bold text-blue-600">{views}</p>
      <p className="text-sm text-gray-600">Profile Views</p>
    </div>
    <div className="bg-green-50 p-4 rounded-lg">
      <p className="text-2xl font-bold text-green-600">{interactions}</p>
      <p className="text-sm text-gray-600">Interactions</p>
    </div>
  </div>
);

