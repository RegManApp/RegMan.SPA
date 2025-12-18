import { cn } from '../../utils/helpers';
import { InboxIcon } from '@heroicons/react/24/outline';

const EmptyState = ({
  icon: Icon = InboxIcon,
  title = 'No data found',
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
