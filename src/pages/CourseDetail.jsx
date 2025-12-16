import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const response = await courseService.getById(id);
      setCourse(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await courseService.update(id, formData);
      setEditing(false);
      loadCourse();
    } catch (error) {
      alert('Failed to update course');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="course-detail">
      {editing ? (
        <form onSubmit={handleUpdate} className="course-form">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <input
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            min="1"
            max="6"
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h1>{course.name}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            <span>Credits: {course.credits}</span>
            <span>Enrolled Students: {course.enrolledCount || 0}</span>
          </div>
          {isAdmin() && (
            <div className="course-actions">
              <button className="btn-primary" onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}
        </>
      )}
      <button className="btn-secondary" onClick={() => navigate('/courses')}>Back to Courses</button>
    </div>
  );
};

export default CourseDetail;
