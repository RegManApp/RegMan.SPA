import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { Card, Button } from '../components/common';
import toast from 'react-hot-toast';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomApi.getById(id);
        setRoom(res.data);
      } catch {
        toast.error('Failed to fetch room details');
      }
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!room) return <div>Room not found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <h2 className="text-xl font-bold mb-4">Room Details</h2>
        <div className="space-y-2">
          <div><strong>Building:</strong> {room.building}</div>
          <div><strong>Room Number:</strong> {room.roomNumber}</div>
          <div><strong>Capacity:</strong> {room.capacity}</div>
          <div><strong>Type:</strong> {room.type}</div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={() => navigate('/rooms')}>Back to List</Button>
        </div>
      </Card>
    </div>
  );
};

export default RoomDetailsPage;
