import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      const response = await courseService.getAll();
      setEnrolledCourses(response.data.filter(c => c.isEnrolled));
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.firstName || user?.email}!</h1>
      <div className="dashboard-section">
        <h2>Your Enrolled Courses</h2>
        {loading ? (
          <p>Loading...</p>
        ) : enrolledCourses.length > 0 ? (
          <div className="course-grid">
            {enrolledCourses.map(course => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <span className="course-credits">{course.credits} Credits</span>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
