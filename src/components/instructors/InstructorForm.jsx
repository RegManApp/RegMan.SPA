import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal, Input, Select, Button } from '../common';
import { createInstructorSchema, updateInstructorSchema } from '../../utils/validators';

const InstructorForm = ({
  isOpen,
  onClose,
  onSubmit,
  instructor = null,
  departments = [],
  isLoading = false,
}) => {
  const isEditing = Boolean(instructor?.id);
  const schema = isEditing ? updateInstructorSchema : createInstructorSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      address: '',
      city: '',
      hireDate: new Date().toISOString().split('T')[0],
      departmentId: '',
    },
  });

  useEffect(() => {
    if (instructor) {
      reset({
        firstName: instructor.firstName || '',
        lastName: instructor.lastName || '',
        phoneNumber: instructor.phoneNumber || '',
        dateOfBirth: instructor.dateOfBirth ? instructor.dateOfBirth.split('T')[0] : '',
        address: instructor.address || '',
        city: instructor.city || '',
        hireDate: instructor.hireDate ? instructor.hireDate.split('T')[0] : '',
        departmentId: instructor.departmentId || '',
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
        hireDate: new Date().toISOString().split('T')[0],
        departmentId: '',
      });
    }
  }, [instructor, reset]);

  const handleFormSubmit = (data) => {
    // Clean up the data
    const submitData = { ...data };
    if (submitData.departmentId === '') {
      submitData.departmentId = null;
    } else {
      submitData.departmentId = Number(submitData.departmentId);
    }
    onSubmit(submitData);
  };

  const departmentOptions = [
    { value: '', label: 'Select Department (Optional)' },
    ...departments.map((dept) => ({
      value: dept.id,
      label: dept.name,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Instructor' : 'Add New Instructor'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {!isEditing && (
          <>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
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

        <Input
          label="Address"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="Hire Date"
            type="date"
            error={errors.hireDate?.message}
            {...register('hireDate')}
          />
        </div>

        <Select
          label="Department"
          options={departmentOptions}
          error={errors.departmentId?.message}
          {...register('departmentId')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? 'Update Instructor' : 'Create Instructor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InstructorForm;
