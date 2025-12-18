import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createStudentSchema, updateStudentSchema } from '../../utils/validators';
import { STUDENT_LEVELS, getStudentLevelLabel } from '../../utils/constants';
import { Modal, Button, Input, Select } from '../common';

const StudentForm = ({
  isOpen,
  onClose,
  onSubmit,
  student,
  isLoading,
}) => {
  const isEditing = !!student?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isEditing ? updateStudentSchema : createStudentSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      address: '',
      city: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      studentLevel: 0,
    },
  });

  useEffect(() => {
    if (student?.id) {
      reset({
        firstName: student.user?.firstName || '',
        lastName: student.user?.lastName || '',
        phoneNumber: student.user?.phoneNumber || '',
        dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
        address: student.address || '',
        city: student.city || '',
        studentLevel: student.studentLevel ?? 0,
      });
    } else {
      reset({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        city: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        studentLevel: 0,
      });
    }
  }, [student, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      studentLevel: Number(data.studentLevel),
    });
  };

  const levelOptions = STUDENT_LEVELS.map((level) => ({
    value: level.value,
    label: level.label,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {!isEditing && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="student@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />
          <Input
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Address"
            placeholder="123 Main St"
            error={errors.address?.message}
            {...register('address')}
          />
          <Input
            label="City"
            placeholder="New York"
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isEditing && (
            <Input
              label="Enrollment Date"
              type="date"
              error={errors.enrollmentDate?.message}
              {...register('enrollmentDate')}
            />
          )}
          <Select
            label="Student Level"
            options={levelOptions}
            error={errors.studentLevel?.message}
            {...register('studentLevel', { valueAsNumber: true })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? 'Update Student' : 'Create Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;
