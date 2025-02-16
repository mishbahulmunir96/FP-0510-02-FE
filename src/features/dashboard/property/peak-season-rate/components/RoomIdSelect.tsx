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
  import { useSession } from 'next-auth/react';
  import { FC } from 'react';
  
  // Define the room type based on your API response
  interface Room {
    id: number;
    name: string;
  }
  
  // Properly type the setFieldValue prop
  interface FormSelectProps {
    setFieldValue: (field: string, value: string) => void;
  }
  
  export const RoomIdSelect: FC<FormSelectProps> = ({ setFieldValue }) => {
    const session = useSession();
    const { data, isPending } = useGetRoomsTenant({
      take: 100,
    });
  
    return (
      <Select onValueChange={(value) => setFieldValue('roomId', value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Room" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Your Room List</SelectLabel>
            {data?.data.map((room: Room) => (
              <SelectItem key={room.id} value={String(room.id)}>
                {room.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };