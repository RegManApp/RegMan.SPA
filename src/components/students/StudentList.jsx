import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
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
import { getFullName, getStudentLevelColor, formatDate } from '../../utils/helpers';
import { getStudentLevelLabel } from '../../utils/constants';

const StudentList = ({
  students,
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
}) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });

  const columns = [
    {
      key: 'studentNumber',
      header: 'Student #',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
              {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {getFullName(student.user?.firstName, student.user?.lastName)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {student.user?.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'enrollmentDate',
      header: 'Enrollment Date',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'studentLevel',
      header: 'Level',
      sortable: true,
      render: (value) => (
        <Badge className={getStudentLevelColor(value)}>{getStudentLevelLabel(value)}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, student) => (
        <div className="flex items-center gap-2">
          <Link to={`/students/${student.id}`}>
            <Button variant="ghost" size="sm" icon={EyeIcon}>
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={PencilIcon}
            onClick={() => onEdit?.(student)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={TrashIcon}
            className="text-red-600 hover:text-red-700"
            onClick={() => setDeleteModal({ isOpen: true, student })}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleConfirmDelete = async () => {
    if (deleteModal.student) {
      await onDelete?.(deleteModal.student.id);
      setDeleteModal({ isOpen: false, student: null });
    }
  };

  if (!isLoading && students.length === 0 && !searchQuery) {
    return (
      <EmptyState
        title="No students found"
        description="Get started by adding your first student."
        action={
          <Button onClick={() => onEdit?.({})}>Add Student</Button>
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
          placeholder="Search students..."
          className="w-full sm:w-80"
        />
        <Button onClick={() => onEdit?.({})}>Add Student</Button>
      </div>

      <Table
        columns={columns}
        data={students}
        isLoading={isLoading}
        emptyMessage="No students match your search criteria."
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
        onClose={() => setDeleteModal({ isOpen: false, student: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${getFullName(deleteModal.student?.user?.firstName, deleteModal.student?.user?.lastName)}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default StudentList;
