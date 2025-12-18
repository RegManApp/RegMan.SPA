import { cn } from '../../utils/helpers';

const sizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const Spinner = ({ size = 'md', className }) => {
  return (
    <svg
      className={cn('animate-spin text-primary-600', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const Loading = ({ text = 'Loading...', fullScreen = false, className }) => {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Spinner size="lg" />
      <p className="text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
        {content}
      </div>
    );
  }

  return content;
};

export const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loading />
  </div>
);

export const LoadingSkeleton = ({ lines = 3, className }) => (
  <div className={cn('animate-pulse space-y-3', className)}>
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
        style={{ width: `${100 - i * 15}%` }}
      />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded mb-1 flex gap-2 px-4 items-center">
        {[...Array(cols)].map((_, j) => (
          <div
            key={j}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"
          />
        ))}
      </div>
    ))}
  </div>
);

export default Spinner;
