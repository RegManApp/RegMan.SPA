import { Link } from 'react-router-dom';
import { Card, Badge, Avatar, Button } from '../common';
import { getFullName, getStudentLevelColor, formatDate } from '../../utils/helpers';
import { getStudentLevelLabel } from '../../utils/constants';

const StudentCard = ({ student, onEdit, onDelete }) => {
  return (
    <Card hover className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              firstName={student.user?.firstName}
              lastName={student.user?.lastName}
              size="lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {getFullName(student.user?.firstName, student.user?.lastName)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {student.studentNumber}
              </p>
            </div>
          </div>
          <Badge className={getStudentLevelColor(student.studentLevel)}>
            {getStudentLevelLabel(student.studentLevel)}
          </Badge>
        </div>

        <div className="space-y-2 flex-grow">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Email: </span>
            <span className="text-gray-900 dark:text-white">
              {student.user?.email}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Enrolled: </span>
            <span className="text-gray-900 dark:text-white">
              {formatDate(student.enrollmentDate)}
            </span>
          </div>
          {student.city && (
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">City: </span>
              <span className="text-gray-900 dark:text-white">
                {student.city}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link to={`/students/${student.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(student)}
          >
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StudentCard;
