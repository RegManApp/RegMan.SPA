import { cn } from '../../utils/helpers';
import { getInitials } from '../../utils/helpers';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

const Avatar = ({
  src,
  alt,
  firstName,
  lastName,
  size = 'md',
  className,
}) => {
  const initials = getInitials(firstName, lastName);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || `${firstName} ${lastName}`}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
        'flex items-center justify-center font-semibold',
        sizes[size],
        className
      )}
    >
      {initials || '?'}
    </div>
  );
};

export default Avatar;
