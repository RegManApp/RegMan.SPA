import { Link } from 'react-router-dom';
import {
  Card,
  Badge,
  Avatar,
  Button,
  Table,
} from '../common';
import { getFullName, getStatusColor, formatDate } from '../../utils/helpers';

const StudentDetails = ({ student, onEdit, onBack }) => {
  if (!student) return null;

  const enrollmentColumns = [
    {
      key: 'course',
      header: 'Course',
      render: (_, enrollment) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {enrollment.course?.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {enrollment.course?.courseCode}
          </p>
        </div>
      ),
    },
    {
      key: 'enrollmentDate',
      header: 'Enrolled On',
      render: (value) => formatDate(value),
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (value) => value || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge className={getStatusColor(value)}>{value}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              firstName={student.user?.firstName}
              lastName={student.user?.lastName}
              size="xl"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getFullName(student.user?.firstName, student.user?.lastName)}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {student.studentNumber}
              </p>
              <Badge className={`${getStatusColor(student.status)} mt-2`}>
                {student.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={() => onEdit?.(student)}>
              Edit Student
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white">
              {student.user?.email}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Date of Birth
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white">
              {formatDate(student.dateOfBirth)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Enrollment Date
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white">
              {formatDate(student.enrollmentDate)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Role
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white">
              {student.user?.role || 'Student'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Courses
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white">
              {student.enrollments?.length || 0}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Account Created
            </h4>
            <p className="mt-1 text-gray-900 dark:text-white">
              {formatDate(student.user?.createdAt)}
            </p>
          </div>
        </div>
      </Card>

      {/* Enrollments */}
      <Card title="Course Enrollments">
        {student.enrollments && student.enrollments.length > 0 ? (
          <Table
            columns={enrollmentColumns}
            data={student.enrollments}
            emptyMessage="No enrollments found."
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            This student is not enrolled in any courses.
          </p>
        )}
      </Card>
    </div>
  );
};

export default StudentDetails;
