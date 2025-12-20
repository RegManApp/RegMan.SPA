import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { scheduleApi, instructorApi, sectionApi, roomApi, timeSlotApi } from '../api';
import { ScheduleList, ScheduleForm, Timetable } from '../components/schedules';
import { PageHeader, Button, Card } from '../components/common';

const SchedulesPage = () => {
  const { user, isAdmin, isInstructor } = useAuth();
  
  const [schedules, setSchedules] = useState([]);
  const [sections, setSections] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [dayFilter, setDayFilter] = useState('');

  // Form modal state
  const [formModal, setFormModal] = useState({ isOpen: false, schedule: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (isInstructor() && !isAdmin()) {
        // Get instructor's schedules
        const instructorRes = await instructorApi.getAll({ userId: user?.id });
        const instructorData = instructorRes?.data || instructorRes;
        const items = instructorData?.items || (Array.isArray(instructorData) ? instructorData : []);
        const instructorId = items[0]?.instructorId || items[0]?.id;
        if (instructorId) {
          const res = await scheduleApi.getByInstructor(instructorId);
          response = res?.data || res;
        } else {
          response = [];
        }
      } else {
        const res = await scheduleApi.getAll();
        response = res?.data || res;
      }
      
      const scheduleItems = Array.isArray(response) ? response : response?.items || [];
      setSchedules(scheduleItems);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      toast.error('Failed to load schedules');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, isInstructor, user?.id]);

  const fetchFormData = useCallback(async () => {
    try {
      const [sectionsRes, roomsRes, timeSlotsRes, instructorsRes] = await Promise.all([
        sectionApi.getAll(),
        roomApi.getAll(),
        timeSlotApi.getAll(),
        instructorApi.getAll(),
      ]);
      
      // Handle axios interceptor response format
      const sectionsData = sectionsRes?.data || sectionsRes;
      const roomsData = roomsRes?.data || roomsRes;
      const timeSlotsData = timeSlotsRes?.data || timeSlotsRes;
      const instructorsData = instructorsRes?.data || instructorsRes;
      
      setSections(Array.isArray(sectionsData) ? sectionsData : sectionsData?.items || []);
      setRooms(Array.isArray(roomsData) ? roomsData : roomsData?.items || []);
      setTimeSlots(Array.isArray(timeSlotsData) ? timeSlotsData : timeSlotsData?.items || []);
      
      // Normalize instructors
      const rawInstructors = Array.isArray(instructorsData) ? instructorsData : instructorsData?.items || [];
      setInstructors(rawInstructors.map(i => ({
        ...i,
        id: i.id || i.instructorId,
        instructorId: i.instructorId || i.id,
      })));
    } catch (error) {
      console.error('Failed to fetch form data:', error);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    if (isAdmin()) {
      fetchFormData();
    }
  }, [fetchSchedules, fetchFormData, isAdmin]);

  const handleDayFilterChange = (value) => {
    setDayFilter(value);
  };

  const handleEdit = (schedule) => {
    if (schedule?.scheduleSlotId || schedule?.id) {
      setFormModal({ isOpen: true, schedule });
    } else {
      setFormModal({ isOpen: true, schedule: null });
    }
  };

  const handleCloseForm = () => {
    setFormModal({ isOpen: false, schedule: null });
  };

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // Schedule slots can only be created/deleted, not updated
      // For editing, we delete the old one and create a new one
      if (formModal.schedule?.scheduleSlotId || formModal.schedule?.id) {
        const existingId = formModal.schedule.scheduleSlotId || formModal.schedule.id;
        await scheduleApi.delete(existingId);
      }
      await scheduleApi.create(data);
      toast.success('Schedule saved successfully');
      handleCloseForm();
      fetchSchedules();
    } catch (error) {
      console.error('Failed to save schedule:', error);
      toast.error(error.message || 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      await scheduleApi.delete(scheduleId);
      toast.success('Schedule deleted successfully');
      fetchSchedules();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast.error(error.message || 'Failed to delete schedule');
    }
  };

  // Filter schedules by day
  const filteredSchedules = dayFilter !== ''
    ? schedules.filter(s => s.dayOfWeek === Number(dayFilter))
    : schedules;

  const tabs = [
    { id: 'list', label: 'List View' },
    { id: 'timetable', label: 'Timetable View' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedules"
        description="View and manage class schedules"
        action={
          isAdmin() && (
            <Button onClick={() => handleEdit({})}>
              Add Schedule
            </Button>
          )
        }
      />

      <Card>
        <div className="mb-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'list' ? (
          <ScheduleList
            schedules={filteredSchedules}
            isLoading={isLoading}
            onEdit={isAdmin() ? handleEdit : undefined}
            onDelete={isAdmin() ? handleDelete : undefined}
            dayFilter={dayFilter}
            onDayFilterChange={handleDayFilterChange}
          />
        ) : (
          <Timetable
            schedules={schedules}
            isLoading={isLoading}
          />
        )}
      </Card>

      {isAdmin() && (
        <ScheduleForm
          isOpen={formModal.isOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          schedule={formModal.schedule}
          sections={sections}
          rooms={rooms}
          timeSlots={timeSlots}
          instructors={instructors}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default SchedulesPage;
