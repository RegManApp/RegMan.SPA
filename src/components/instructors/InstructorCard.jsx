import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Badge, Button } from '../common';
import { formatDate, getFullName } from '../../utils/helpers';
import { PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

const InstructorCard = ({ instructor, onEdit }) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <Avatar
          firstName={instructor.firstName}
          lastName={instructor.lastName}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {instructor.fullName || getFullName(instructor.firstName, instructor.lastName)}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {instructor.email}
          </p>
          {instructor.departmentName && (
            <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {instructor.departmentName}
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Hire Date</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(instructor.hireDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={EyeIcon}
          onClick={() => navigate(`/instructors/${instructor.id}`)}
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={PencilIcon}
          onClick={() => onEdit?.(instructor)}
          className="flex-1"
        >
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default InstructorCard;
