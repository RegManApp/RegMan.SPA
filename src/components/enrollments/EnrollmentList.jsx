import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  Table,
  TablePagination,
  Button,
  Badge,
  SearchInput,
  EmptyState,
  ConfirmModal,
  Select,
} from '../common';
import { getFullName, getStatusColor, formatDate } from '../../utils/helpers';
import { ENROLLMENT_STATUSES, getEnrollmentStatusLabel, GRADES } from '../../utils/constants';

const EnrollmentList = ({
  enrollments,
  isLoading,
  onEdit,
  onDelete,
  onUpdateGrade,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  isAdmin,
}) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, enrollment: null });
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Helper to get enrollment ID (backend returns enrollmentId, normalize to id)
  const getEnrollmentId = (enrollment) => enrollment.enrollmentId || enrollment.id;

  // Helper to check enrollment status (handles both number and string from backend)
  // Backend enum: Pending=0, Enrolled=1, Dropped=2, Completed=3, Declined=4
  const isStatusEnrolled = (status) => status === 1 || status === 'Enrolled';
  const isStatusPending = (status) => status === 0 || status === 'Pending';
  const isStatusCompleted = (status) => status === 3 || status === 'Completed';

  const handleSort = (field) => {
    if (!field) return;
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEnrollments = useMemo(() => {
    const list = Array.isArray(enrollments) ? [...enrollments] : [];
    if (!sortField) return list;

    const getValue = (enrollment) => {
      if (!enrollment) return null;
      switch (sortField) {
        case 'enrollmentDate': {
          const raw = enrollment.enrollmentDate || enrollment.enrolledAt;
          const ts = raw ? new Date(raw).getTime() : null;
          return Number.isFinite(ts) ? ts : null;
        }
        case 'status': {
          const status = enrollment.status;
          // Sort by label for stable UX across numeric/string enums
          return getEnrollmentStatusLabel(status).toString();
        }
        default:
          return enrollment[sortField] ?? null;
      }
    };

    list.sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = aVal < bVal ? -1 : 1;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [enrollments, sortField, sortDirection]);

  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (_, enrollment) => {
        // Handle both admin view (nested student object) and direct fields
        const studentName = enrollment.student?.fullName || 
                           getFullName(enrollment.student?.user?.firstName, enrollment.student?.user?.lastName) ||
                           enrollment.studentName || '-';
        const studentEmail = enrollment.student?.email || enrollment.studentEmail || '';
        return (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {studentName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {studentEmail}
            </p>
          </div>
        );
      },
    },
    {
      key: 'course',
      header: 'Course',
      render: (_, enrollment) => {
        // Handle both nested and flat structure
        const courseId = enrollment.courseId || enrollment.section?.course?.courseId;
        const courseName = enrollment.courseName || enrollment.section?.course?.name || enrollment.course?.courseName || '-';
        const courseCode = enrollment.courseCode || enrollment.section?.course?.code || enrollment.course?.courseCode || '';
        return (
          <div>
            <Link
              to={courseId ? `/courses/${courseId}` : '#'}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {courseName}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {courseCode}
            </p>
          </div>
        );
      },
    },
    {
      key: 'semester',
      header: 'Semester',
      render: (_, enrollment) => enrollment.semester || enrollment.section?.semester || '-',
    },
    {
      key: 'enrollmentDate',
      header: 'Enrolled On',
      sortable: true,
      render: (_, enrollment) => formatDate(enrollment.enrollmentDate || enrollment.enrolledAt),
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (_, enrollment) => {
        const value = enrollment.grade;
        // Only allow grade updates for Enrolled students
        const canUpdateGrade = isAdmin && isStatusEnrolled(enrollment.status);
        if (canUpdateGrade) {
          return (
            <select
              value={value || ''}
              onChange={(e) => onUpdateGrade?.(getEnrollmentId(enrollment), e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              <option value="">-</option>
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          );
        }
        return value || '-';
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (_, enrollment) => {
        const status = enrollment.status;
        return (
          <Badge className={getStatusColor(status)}>{getEnrollmentStatusLabel(status)}</Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, enrollment) => {
        const enrollmentId = getEnrollmentId(enrollment);
        const isEnrolled = isStatusEnrolled(enrollment.status);
        const isPending = isStatusPending(enrollment.status);
        return (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={PencilIcon}
                  onClick={() => onEdit?.({ ...enrollment, id: enrollmentId, enrollmentId })}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={TrashIcon}
                  className="text-red-600 hover:text-red-700"
                  onClick={() => setDeleteModal({ isOpen: true, enrollment: { ...enrollment, id: enrollmentId } })}
                >
                  Drop
                </Button>
              </>
            )}
            {!isAdmin && (isEnrolled || isPending) && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteModal({ isOpen: true, enrollment: { ...enrollment, id: enrollmentId } })}
              >
                Drop
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleConfirmDelete = async () => {
    if (deleteModal.enrollment) {
      await onDelete?.(deleteModal.enrollment.id || deleteModal.enrollment.enrollmentId);
      setDeleteModal({ isOpen: false, enrollment: null });
    }
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    ...ENROLLMENT_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
    })),
  ];

  if (!isLoading && enrollments.length === 0 && !searchQuery && !statusFilter) {
    return (
      <EmptyState
        title="No enrollments found"
        description={
          isAdmin
            ? "Get started by enrolling students in courses."
            : "You are not enrolled in any courses yet."
        }
        action={
          isAdmin ? (
            <Button onClick={() => onEdit?.({})}>Create Enrollment</Button>
          ) : (
            <Link to="/courses">
              <Button>Browse Courses</Button>
            </Link>
          )
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
            placeholder="Search enrollments..."
            className="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={statusOptions}
            className="w-full sm:w-40"
          />
        </div>
        {isAdmin && (
          <Button onClick={() => onEdit?.({})}>Create Enrollment</Button>
        )}
      </div>

      <Table
        columns={columns}
        data={sortedEnrollments}
        isLoading={isLoading}
        emptyMessage="No enrollments match your search criteria."
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
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
        onClose={() => setDeleteModal({ isOpen: false, enrollment: null })}
        onConfirm={handleConfirmDelete}
        title="Drop Enrollment"
        message={`Are you sure you want to drop this enrollment? ${
          isAdmin
            ? `This will remove ${getFullName(
                deleteModal.enrollment?.student?.user?.firstName,
                deleteModal.enrollment?.student?.user?.lastName
              )} from ${deleteModal.enrollment?.course?.courseName}.`
            : 'This action cannot be undone.'
        }`}
        confirmText="Drop"
        variant="danger"
      />
    </div>
  );
};

export default EnrollmentList;
