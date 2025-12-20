import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Select, Button } from '../common';

// SlotType enum matching backend
const SLOT_TYPES = [
  { value: '0', label: 'Lecture' },
  { value: '1', label: 'Lab' },
  { value: '2', label: 'Tutorial' },
];

const ScheduleForm = ({
  isOpen,
  onClose,
  onSubmit,
  schedule = null,
  sections = [],
  rooms = [],
  timeSlots = [],
  instructors = [],
  isLoading = false,
}) => {
  const isEditing = Boolean(schedule?.scheduleSlotId || schedule?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sectionId: '',
      roomId: '',
      timeSlotId: '',
      instructorId: '',
      slotType: '0',
    },
  });

  useEffect(() => {
    if (schedule && (schedule.scheduleSlotId || schedule.id)) {
      reset({
        sectionId: (schedule.sectionId || '')?.toString(),
        roomId: (schedule.roomId || '')?.toString(),
        timeSlotId: (schedule.timeSlotId || '')?.toString(),
        instructorId: (schedule.instructorId || '')?.toString(),
        slotType: (schedule.slotType ?? 0)?.toString(),
      });
    } else {
      reset({
        sectionId: '',
        roomId: '',
        timeSlotId: '',
        instructorId: '',
        slotType: '0',
      });
    }
  }, [schedule, reset]);

  const handleFormSubmit = (data) => {
    const sectionIdNum = Number(data.sectionId);
    const roomIdNum = Number(data.roomId);
    const timeSlotIdNum = Number(data.timeSlotId);
    const instructorIdNum = Number(data.instructorId);
    const slotTypeNum = Number(data.slotType);

    // Validate all required fields
    if (isNaN(sectionIdNum) || sectionIdNum <= 0) {
      return;
    }
    if (isNaN(roomIdNum) || roomIdNum <= 0) {
      return;
    }
    if (isNaN(timeSlotIdNum) || timeSlotIdNum <= 0) {
      return;
    }
    if (isNaN(instructorIdNum) || instructorIdNum <= 0) {
      return;
    }

    const submitData = {
      sectionId: sectionIdNum,
      roomId: roomIdNum,
      timeSlotId: timeSlotIdNum,
      instructorId: instructorIdNum,
      slotType: slotTypeNum,
    };
    onSubmit(submitData);
  };

  // Helper to format day name
  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || 'Unknown';
  };

  // Helper to format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${period}`;
    }
    return timeStr;
  };

  const sectionOptions = [
    { value: '', label: 'Select Section' },
    ...sections.map((section) => ({
      value: (section.sectionId || section.id)?.toString() || '',
      label: `${section.sectionName || 'Section'} - ${section.courseName || section.course?.courseName || ''} (${section.semester || ''})`,
    })),
  ];

  const roomOptions = [
    { value: '', label: 'Select Room' },
    ...rooms.map((room) => ({
      value: (room.roomId || room.id)?.toString() || '',
      label: `${room.building || ''} ${room.roomNumber || ''} (Cap: ${room.capacity || 0})`,
    })),
  ];

  const timeSlotOptions = [
    { value: '', label: 'Select Time Slot' },
    ...timeSlots.map((slot) => ({
      value: (slot.timeSlotId || slot.id)?.toString() || '',
      label: `${getDayName(slot.day)} ${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
    })),
  ];

  const instructorOptions = [
    { value: '', label: 'Select Instructor' },
    ...instructors.map((instructor) => ({
      value: (instructor.instructorId || instructor.id)?.toString() || '',
      label: instructor.fullName || `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'Unknown',
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Schedule Slot' : 'Add New Schedule Slot'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Select
          label="Section"
          options={sectionOptions}
          error={errors.sectionId?.message}
          {...register('sectionId', { required: 'Section is required' })}
        />

        <Select
          label="Instructor"
          options={instructorOptions}
          error={errors.instructorId?.message}
          {...register('instructorId', { required: 'Instructor is required' })}
        />

        <Select
          label="Room"
          options={roomOptions}
          error={errors.roomId?.message}
          {...register('roomId', { required: 'Room is required' })}
        />

        <Select
          label="Time Slot"
          options={timeSlotOptions}
          error={errors.timeSlotId?.message}
          {...register('timeSlotId', { required: 'Time slot is required' })}
        />

        <Select
          label="Slot Type"
          options={SLOT_TYPES}
          error={errors.slotType?.message}
          {...register('slotType')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? 'Update' : 'Create'} Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleForm;
