import { useState, useEffect } from 'react';
import SearchableSelect from '../common/SearchableSelect';
import { courseCategoryApi } from '../../api';
import { normalizeCategories } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

const CourseCategorySelect = ({
  value,
  onChange,
  error,
  isAdmin = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const response = await courseCategoryApi.getAll();
      const data = response.data || response || [];
      setCategories(normalizeCategories(Array.isArray(data) ? data : data.items || []));
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const options = categories;

  return (
    <SearchableSelect
      label={t('courses.form.fields.courseCategory')}
      value={value}
      onChange={onChange}
      options={options}
      getOptionLabel={cat => cat.name}
      getOptionValue={cat => cat.id}
      error={error}
      placeholder={t('courses.form.placeholders.courseCategory')}
      required={props.required}
      disabled={isLoading}
      {...props}
    />
  );
};

export default CourseCategorySelect;
