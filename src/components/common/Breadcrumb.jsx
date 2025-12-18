import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { cn } from '../../utils/helpers';

const Breadcrumb = ({ items = [], className }) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from path if no items provided
  const breadcrumbs = items.length > 0 ? items : location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + arr.slice(0, index + 1).join('/'),
      current: index === arr.length - 1,
    }));

  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbs.map((item) => (
          <li key={item.href} className="flex items-center">
            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
            {item.current ? (
              <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.href}
                className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
