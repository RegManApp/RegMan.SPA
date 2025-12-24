import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { timeSlotApi } from '../api/timeSlotApi';
import { Card, Button, Table } from '../components/common';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const RoomDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const handleDeleteTimeSlot = async (timeSlotId) => {
    if (!window.confirm(t('rooms.confirmDeleteTimeSlot'))) return;
    setDeletingId(timeSlotId);
    try {
      await timeSlotApi.delete(timeSlotId);
      setTimeSlots((prev) => prev.filter((ts) => ts.timeSlotId !== timeSlotId));
      toast.success(t('rooms.toasts.timeSlotDeleted'));
    } catch {
      toast.error(t('rooms.errors.deleteTimeSlotFailed'));
    }
    setDeletingId(null);
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await roomApi.getById(id);
        setRoom(res.data);
      } catch {
        toast.error(t('rooms.errors.detailsFetchFailed'));
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
      .catch(() => toast.error(t('rooms.errors.timeSlotsFetchFailed')))
      .finally(() => setTimeSlotsLoading(false));
  }, [id]);

  if (loading) return <div>{t('common.loading')}</div>;
  if (!room) return <div>{t('rooms.notFound')}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <Card>
        <h2 className="text-xl font-bold mb-4">{t('rooms.detailsTitle')}</h2>
        <div className="space-y-2">
          <div><strong>{t('rooms.fields.building')}:</strong> {room.building}</div>
          <div><strong>{t('rooms.fields.roomNumber')}:</strong> {room.roomNumber}</div>
          <div><strong>{t('rooms.fields.capacity')}:</strong> {room.capacity}</div>
          <div><strong>{t('rooms.fields.type')}:</strong> {room.type}</div>
        </div>
        <div className="mt-6 flex gap-2">
          <Button onClick={() => navigate('/rooms')}>{t('common.back')}</Button>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold mb-2">{t('rooms.timeSlotsTitle')}</h3>
        <Table
          columns={[
            { key: 'timeSlotId', header: t('common.id') },
            { key: 'day', header: t('timeSlots.fields.day') },
            { key: 'startTime', header: t('timeSlots.fields.startTime') },
            { key: 'endTime', header: t('timeSlots.fields.endTime') },
            {
              key: 'actions',
              header: t('common.actions'),
              render: (_, row) => (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteTimeSlot(row.timeSlotId)}
                  disabled={deletingId === row.timeSlotId}
                >
                  {deletingId === row.timeSlotId ? t('common.deleting') : t('common.delete')}
                </Button>
              ),
            },
          ]}
          data={timeSlots}
          isLoading={timeSlotsLoading}
          emptyMessage={t('rooms.noTimeSlots')}
        />
      </Card>
    </div>
  );
};

export default RoomDetailsPage;
