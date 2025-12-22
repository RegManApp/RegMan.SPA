import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { timeSlotApi } from '../api/timeSlotApi';
import { Card, Button, Table } from '../components/common';
import toast from 'react-hot-toast';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const handleDeleteTimeSlot = async (timeSlotId) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) return;
    setDeletingId(timeSlotId);
    try {
      await timeSlotApi.delete(timeSlotId);
      setTimeSlots((prev) => prev.filter((ts) => ts.timeSlotId !== timeSlotId));
      toast.success('Time slot deleted');
    } catch {
      toast.error('Failed to delete time slot');
    }
    setDeletingId(null);
  };

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

  useEffect(() => {
    if (!id) return;
    setTimeSlotsLoading(true);
    timeSlotApi.getByRoom(id)
      .then(res => setTimeSlots(Array.isArray(res.data) ? res.data : res.data.items || []))
      .catch(() => toast.error('Failed to fetch time slots for this room'))
      .finally(() => setTimeSlotsLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!room) return <div>Room not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
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
      <Card>
        <h3 className="text-lg font-semibold mb-2">Time Slots for this Room</h3>
        <Table
          columns={[
            { key: 'timeSlotId', header: 'ID' },
            { key: 'day', header: 'Day' },
            { key: 'startTime', header: 'Start Time' },
            { key: 'endTime', header: 'End Time' },
            {
              key: 'actions',
              header: 'Actions',
              render: (_, row) => (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteTimeSlot(row.timeSlotId)}
                  disabled={deletingId === row.timeSlotId}
                >
                  {deletingId === row.timeSlotId ? 'Deleting...' : 'Delete'}
                </Button>
              ),
            },
          ]}
          data={timeSlots}
          isLoading={timeSlotsLoading}
          emptyMessage="No time slots for this room."
        />
      </Card>
    </div>
  );
};

export default RoomDetailsPage;
