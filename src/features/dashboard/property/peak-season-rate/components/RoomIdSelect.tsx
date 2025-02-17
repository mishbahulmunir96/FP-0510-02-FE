import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetRoomsTenant } from '@/hooks/api/room/useGetRoomsTenant';
import { Room } from '@/types/property';
import { FC } from 'react';

interface FcFormSelectProps {
  setFieldValue: (field: string, value: string) => void;
  defaultValue?: string;
  isDisabled?: boolean;
}

export const RoomIdSelect: FC<FcFormSelectProps> = ({
  setFieldValue,
  defaultValue,
  isDisabled = false
}) => {
  const { data, isPending } = useGetRoomsTenant({
    take: 100,
  });

  const rooms = data?.data ?? [];

  return (
    <Select
      onValueChange={(value) => setFieldValue('roomId', value)}
      defaultValue={defaultValue}
      disabled={isDisabled || isPending}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isPending ? "Loading..." : "Select Room"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Room List</SelectLabel>
          {rooms.length > 0 && rooms.map((room) => (
            <SelectItem 
              key={room.id} 
              value={String(room.id)}
            >
              {room.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

