export const ActivityTimeline = ({ events }: { events: Array<{ date: string; title: string; description: string }> }) => (
  <div className="space-y-4">
    {events.map((event, idx) => (
      <div key={idx} className="flex gap-4">
        <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">{event.title}</p>
          <p className="text-sm text-gray-600">{event.description}</p>
          <p className="text-xs text-gray-500 mt-1">{event.date}</p>
        </div>
      </div>
    ))}
  </div>
);

