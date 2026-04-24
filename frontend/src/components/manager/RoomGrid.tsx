import { Room } from '@/components/manager/types';
import { StatusBadge } from '@/components/manager/StatusBadge';

interface RoomGridProps {
  rooms: Room[];
}

export function RoomGrid({ rooms }: RoomGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
      {rooms.map((room) => (
        <div key={room.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Phòng {room.roomNumber}</p>
          <p className="text-xs text-slate-500">
            {room.type} - Tầng {room.floor}
          </p>
          <div className="mt-2">
            <StatusBadge status={room.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
