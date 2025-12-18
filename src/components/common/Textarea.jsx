import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className,
  textareaClassName,
  required,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'block w-full rounded-lg border shadow-sm transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-800',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'px-3 py-2 text-sm resize-none',
          textareaClassName
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn(
          'mt-1 text-sm',
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
