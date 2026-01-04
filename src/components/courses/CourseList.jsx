import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import {
  Table,
  TablePagination,
  Button,
  Badge,
  SearchInput,
  EmptyState,
  ConfirmModal,
} from '../common';

const CourseList = ({
  courses,
  isLoading,
  onEdit,
  onDelete,
  searchQuery,
  onSearchChange,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  isAdmin,
  categories = [],
  categoryFilter = '',
  onCategoryFilter = () => {},
}) => {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, course: null });

  const columns = [
    {
      key: 'courseCode',
      header: t('courses.table.code'),
      sortable: true,
    },
    {
      key: 'courseName',
      header: t('courses.table.courseName'),
      sortable: true,
      render: (value, course) => (
        <div>
          <Link
            to={`/courses/${course.id}`}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            {value}
          </Link>
          {course.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {course.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'creditHours',
      header: t('courses.table.credits'),
      sortable: true,
    },
    {
      key: 'categoryName',
      header: t('courses.table.category'),
      sortable: true,
      render: (value) => value ? (
        <Badge variant="secondary" size="sm">
          <TagIcon className="w-3 h-3 mr-1" />
          {value}
        </Badge>
      ) : '-',
    },
    {
      key: 'enrollmentCount',
      header: t('courses.table.enrolled'),
      render: (value) => (
        <div className="flex items-center gap-2">
          <UserGroupIcon className="w-4 h-4 text-gray-400" />
          <span>{value || 0}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: t('courses.table.actions'),
      render: (_, course) => (
        <div className="flex items-center gap-2">
          <Link to={`/courses/${course.id}`}>
            <Button variant="ghost" size="sm" icon={EyeIcon}>
              {t('courses.viewDetails')}
            </Button>
          </Link>
          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={PencilIcon}
                onClick={() => onEdit?.(course)}
              >
                {t('common.edit')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={TrashIcon}
                className="text-red-600 hover:text-red-700"
                onClick={() => setDeleteModal({ isOpen: true, course })}
              >
                {t('common.delete')}
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const handleConfirmDelete = async () => {
    if (deleteModal.course) {
      await onDelete?.(deleteModal.course.id);
      setDeleteModal({ isOpen: false, course: null });
    }
  };

  if (!isLoading && courses.length === 0 && !searchQuery) {
    return (
      <EmptyState
        title={t('courses.page.empty.title')}
        description={isAdmin ? t('courses.page.emptyAdminHint') : t('courses.page.emptyStudentHint')}
        action={
          isAdmin && <Button onClick={() => onEdit?.({})}>{t('dashboard.admin.quickActions.createCourse')}</Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          onClear={() => onSearchChange('')}
          placeholder={t('courses.page.searchPlaceholder')}
          className="w-full sm:w-80"
        />
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={e => onCategoryFilter(e.target.value)}
            className="w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t('courses.page.allCategories')}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
        {isAdmin && (
          <Button onClick={() => onEdit?.({})}>{t('dashboard.admin.quickActions.createCourse')}</Button>
        )}
      </div>

      <Table
        columns={columns}
        data={courses}
        isLoading={isLoading}
        emptyMessage={t('courses.page.empty.descriptionFiltered')}
      />

      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, course: null })}
        onConfirm={handleConfirmDelete}
        title={t('courses.confirmDeleteTitle')}
        message={t('courses.confirmDeleteMessage', {
          courseName:
            deleteModal.course?.courseName || t('courses.confirmDeleteNameFallback'),
        })}
        confirmText={t('common.delete')}
        variant="danger"
      />
    </div>
  );
};

export default CourseList;
