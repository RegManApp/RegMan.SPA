import { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        adminService.getUsers(),
        adminService.getStats()
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await adminService.deleteUser(id);
        loadData();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await adminService.assignRole(userId, role);
      loadData();
    } catch (error) {
      alert('Failed to assign role');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <span>{stats.totalUsers}</span>
          </div>
          <div className="stat-card">
            <h3>Total Courses</h3>
            <span>{stats.totalCourses}</span>
          </div>
          <div className="stat-card">
            <h3>Total Enrollments</h3>
            <span>{stats.totalEnrollments}</span>
          </div>
        </div>
      )}

      <h2>Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.roles?.join(', ') || 'User'}</td>
              <td>
                <select onChange={(e) => handleRoleChange(user.id, e.target.value)} defaultValue="">
                  <option value="" disabled>Assign Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
                <button className="btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
