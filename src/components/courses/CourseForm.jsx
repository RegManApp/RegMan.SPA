import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { courseSchema } from '../../utils/validators';
import { Modal, Button, Input, Textarea } from '../common';
import CourseCategorySelect from './CourseCategorySelect';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../../hooks/useDirection';
import { cn } from '../../utils/helpers';

const CourseForm = ({
  isOpen,
  onClose,
  onSubmit,
  course,
  isLoading,
  isAdmin = true,
}) => {
  const isEditing = !!course?.id;
  const [categoryId, setCategoryId] = useState('');
  const { t } = useTranslation();
  const { isRtl } = useDirection();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      courseCode: '',
      courseName: '',
      description: '',
      creditHours: 3,
      courseCategoryId: undefined,
    },
  });

  useEffect(() => {
    if (course?.id) {
      reset({
        courseCode: course.courseCode || '',
        courseName: course.courseName || '',
        description: course.description || '',
        creditHours: course.creditHours || 3,
        courseCategoryId:
          typeof course.courseCategoryId === 'number'
            ? course.courseCategoryId
            : undefined,
      });
      setCategoryId(
        typeof course.courseCategoryId === 'number'
          ? String(course.courseCategoryId)
          : ''
      );
    } else {
      reset({
        courseCode: '',
        courseName: '',
        description: '',
        creditHours: 3,
        courseCategoryId: undefined,
      });
      setCategoryId('');
    }
  }, [course, reset]);

  const handleCategoryChange = (valueOrOption) => {
    // SearchableSelect calls onChange(option), not onChange(event).
    const rawValue = valueOrOption?.target?.value ??
      valueOrOption?.id ??
      valueOrOption?.Id ??
      valueOrOption?.value ??
      valueOrOption?.Value;

    const value = rawValue === null || rawValue === undefined ? '' : String(rawValue);
    setCategoryId(value);
    setValue('courseCategoryId', value === '' ? undefined : Number(value), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      // After schema + setValue, this should already be a number.
      courseCategoryId: data.courseCategoryId,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('courses.form.editTitle') : t('courses.form.createTitle')}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <input type="hidden" {...register('courseCategoryId')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('courses.form.fields.courseCode')}
            placeholder={t('courses.form.placeholders.courseCode')}
            error={errors.courseCode?.message}
            {...register('courseCode')}
          />
          <Input
            label={t('courses.form.fields.creditHours')}
            type="number"
            min={1}
            max={6}
            error={errors.creditHours?.message}
            {...register('creditHours', { valueAsNumber: true })}
          />
        </div>

        <Input
          label={t('courses.form.fields.courseName')}
          placeholder={t('courses.form.placeholders.courseName')}
          error={errors.courseName?.message}
          {...register('courseName')}
        />

        <CourseCategorySelect
          value={categoryId}
          onChange={handleCategoryChange}
          error={errors.courseCategoryId?.message}
          isAdmin={isAdmin}
          required
        />

        <Textarea
          label={t('courses.form.fields.description')}
          placeholder={t('courses.form.placeholders.description')}
          error={errors.description?.message}
          rows={3}
          {...register('description')}
        />

        <div className={cn('flex gap-3 pt-4', isRtl ? 'justify-start' : 'justify-end')}>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={isLoading}>
            {isEditing ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseForm;
