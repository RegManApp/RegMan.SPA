import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', credits: 3 });
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await courseService.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enroll(courseId);
      loadCourses();
    } catch (error) {
      alert('Failed to enroll');
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      await courseService.unenroll(courseId);
      loadCourses();
    } catch (error) {
      alert('Failed to unenroll');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await courseService.create(formData);
      setShowForm(false);
      setFormData({ name: '', description: '', credits: 3 });
      loadCourses();
    } catch (error) {
      alert('Failed to create course');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this course?')) {
      try {
        await courseService.delete(id);
        loadCourses();
      } catch (error) {
        alert('Failed to delete course');
      }
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>Courses</h1>
        {isAdmin() && (
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Course'}
          </button>
        )}
      </div>

      {showForm && (
        <form className="course-form" onSubmit={handleCreateCourse}>
          <input
            type="text"
            placeholder="Course Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Credits"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            min="1"
            max="6"
            required
          />
          <button type="submit" className="btn-primary">Create Course</button>
        </form>
      )}

      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <h3><Link to={`/courses/${course.id}`}>{course.name}</Link></h3>
            <p>{course.description}</p>
            <span className="course-credits">{course.credits} Credits</span>
            <div className="course-actions">
              {course.isEnrolled ? (
                <button className="btn-secondary" onClick={() => handleUnenroll(course.id)}>Unenroll</button>
              ) : (
                <button className="btn-primary" onClick={() => handleEnroll(course.id)}>Enroll</button>
              )}
              {isAdmin() && (
                <button className="btn-danger" onClick={() => handleDelete(course.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
