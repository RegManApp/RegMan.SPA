import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import OfficeHoursPage from './OfficeHoursPage';
import BookOfficeHourPage from './BookOfficeHourPage';

const OfficeHoursHubPage = () => {
  const { isStudent } = useAuth();
  const canProvide = !isStudent();

  const [activeTab, setActiveTab] = useState(canProvide ? 'my-office-hours' : 'book');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Office Hours</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and book office hours</p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {canProvide && (
          <button
            type="button"
            onClick={() => setActiveTab('my-office-hours')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'my-office-hours'
                ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            My Office Hours
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'book'
              ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
              : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Book Office Hours
        </button>
      </div>

      {activeTab === 'my-office-hours' && canProvide ? <OfficeHoursPage /> : null}
      {activeTab === 'book' ? <BookOfficeHourPage /> : null}
    </div>
  );
};

export default OfficeHoursHubPage;
