import { Card, Avatar, Badge, Button, Table } from '../common';
import { formatDate, getFullName } from '../../utils/helpers';
import { getDayOfWeekLabel } from '../../utils/constants';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

const InstructorDetails = ({
  instructor,
  onEdit,
  onBack,
}) => {
  if (!instructor) return null;

  const scheduleColumns = [
    {
      key: 'courseName',
      header: 'Course',
      render: (_, schedule) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{schedule.courseName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{schedule.courseCode}</p>
        </div>
      ),
    },
    {
      key: 'dayOfWeek',
      header: 'Day',
      render: (value) => getDayOfWeekLabel(value),
    },
    {
      key: 'time',
      header: 'Time',
      render: (_, schedule) => `${schedule.startTime} - ${schedule.endTime}`,
    },
    {
      key: 'roomNumber',
      header: 'Room',
    },
    {
      key: 'semester',
      header: 'Semester',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              firstName={instructor.firstName}
              lastName={instructor.lastName}
              size="xl"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getFullName(instructor.firstName, instructor.lastName)}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {instructor.email}
              </p>
              {instructor.departmentName && (
                <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  {instructor.departmentName}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" icon={ArrowLeftIcon} onClick={onBack}>
              Back
            </Button>
            <Button icon={PencilIcon} onClick={() => onEdit?.(instructor)}>
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
            <p className="mt-1 text-gray-900 dark:text-white">{instructor.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
            <p className="mt-1 text-gray-900 dark:text-white">{instructor.phoneNumber || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</h4>
            <p className="mt-1 text-gray-900 dark:text-white">{formatDate(instructor.dateOfBirth)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h4>
            <p className="mt-1 text-gray-900 dark:text-white">{instructor.address || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">City</h4>
            <p className="mt-1 text-gray-900 dark:text-white">{instructor.city || '-'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hire Date</h4>
            <p className="mt-1 text-gray-900 dark:text-white">{formatDate(instructor.hireDate)}</p>
          </div>
        </div>
      </Card>

      {instructor.schedules && instructor.schedules.length > 0 && (
        <Card title="Teaching Schedule">
          <Table
            columns={scheduleColumns}
            data={instructor.schedules}
            emptyMessage="No scheduled classes."
          />
        </Card>
      )}
    </div>
  );
};

export default InstructorDetails;
