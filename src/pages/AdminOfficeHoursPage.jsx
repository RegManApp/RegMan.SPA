import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { officeHourApi } from '../api/officeHourApi';

const AdminOfficeHoursPage = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en-US';

  const [officeHours, setOfficeHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const range = useMemo(() => {
    const startOfWeek = getStartOfWeek(currentWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  }, [currentWeek]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await officeHourApi.getAllOfficeHours({
          fromDate: range.startOfWeek.toISOString(),
          toDate: range.endOfWeek.toISOString(),
        });
        setOfficeHours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error(t('errors.generic'));
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [range.startOfWeek, range.endOfWeek, t]);

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleDateString(locale, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return String(value ?? '');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('officeHours.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('officeHours.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const prev = new Date(currentWeek);
              prev.setDate(prev.getDate() - 7);
              setCurrentWeek(prev);
            }}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('common.previous')}
          </button>
          <button
            type="button"
            onClick={() => setCurrentWeek(new Date())}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('common.today')}
          </button>
          <button
            type="button"
            onClick={() => {
              const next = new Date(currentWeek);
              next.setDate(next.getDate() + 7);
              setCurrentWeek(next);
            }}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('common.next')}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {formatDate(range.startOfWeek)} – {formatDate(range.endOfWeek)}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t('common.loading')}
        </div>
      ) : officeHours.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t('officeHours.empty.title')}
        </div>
      ) : (
        <div className="grid gap-4">
          {officeHours.map((oh) => (
            <div
              key={oh.officeHourId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(oh.date)}
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {oh.startTime} – {oh.endTime}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {oh?.instructor?.fullName ? oh.instructor.fullName : ''}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('common.status')}: {String(oh.status)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('officeHours.sections.bookings')}: {oh?.bookings?.length ?? 0}
                  </div>
                </div>
              </div>

              {oh?.notes ? (
                <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                  {oh.notes}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOfficeHoursPage;
