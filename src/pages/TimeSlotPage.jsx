import React, { useEffect, useState } from "react";
import { timeSlotApi } from "../api/timeSlotApi";
import { roomApi } from "../api/roomApi";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Table from "../components/common/Table";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import toast from "react-hot-toast";

const defaultForm = {
  roomId: "",
  day: "Monday",
  startTime: "08:00",
  endTime: "09:00",
};

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TimeSlotPage = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const res = await timeSlotApi.getAll();
      setTimeSlots(Array.isArray(res.data) ? res.data : res.data.items || []);
    } catch {
      toast.error("Failed to fetch time slots");
    }
    setLoading(false);
  };

  const fetchRooms = async () => {
    try {
      const res = await roomApi.getAll();
      setRooms(Array.isArray(res.data) ? res.data : res.data.items || []);
    } catch {
      toast.error("Failed to fetch rooms");
    }
  };

  useEffect(() => {
    fetchTimeSlots();
    fetchRooms();
  }, []);

  const handleOpenModal = () => {
    setForm(defaultForm);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setForm(defaultForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await timeSlotApi.create({
        roomId: form.roomId,
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
      });
      toast.success("Time slot created");
      fetchTimeSlots();
      handleCloseModal();
    } catch {
      toast.error("Failed to create time slot");
    }
  };

  return (
    <Card title="Time Slots">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleOpenModal}>Add Time Slot</Button>
      </div>
      <Table
        columns={[
          { Header: "ID", accessor: "timeSlotId" },
          { Header: "Day", accessor: "day" },
          { Header: "Start Time", accessor: "startTime" },
          { Header: "End Time", accessor: "endTime" },
        ]}
        data={timeSlots}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title="Add Time Slot">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Room
            <select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              className="block w-full border rounded p-2"
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.building} - {room.roomNumber}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            Day
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="block w-full border rounded p-2"
              required
            >
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <Input label="Start Time" name="startTime" value={form.startTime} onChange={handleChange} required type="time" />
          <Input label="End Time" name="endTime" value={form.endTime} onChange={handleChange} required type="time" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default TimeSlotPage;
