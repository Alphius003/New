import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import './user.css';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
function Adduser() {
  const [formData, setFormData] = useState({
    userID: '',
    firstName: '',
    lastName: '',
    dob: '',
    mailID: '',
    gender: '',
    skills:'',
    experience:'',
    designation:'',
    role: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useHistory

  const [events] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleCourseClick = () => {
    navigate('/Courses'); 
  };

  const handleLogout = () => {
    navigate('/'); 
  };
  const handleCreateEventClick = () => {
    navigate('/Create'); // Navigate to the CreateEvent page
  };
  const handleAddUser = async () => {
    const emptyFields = Object.values(formData).some(value => value === '');
    if (emptyFields) {
      toast.error('Fill out all the fields');
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          role: 'user' // Add the role field here
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add user');
      }

      console.log('User added successfully!');
      setErrorMessage('User added successfully! Please change the password.');
      setTimeout(() => {
        setErrorMessage('');
        navigate('/Dashboard'); // Navigate to admin dashboard route
      }, 3000);
    } catch (error) {
      console.error('Error adding user:', error.message);
      setErrorMessage(error.message);
      if (error.message === 'User already exists') {
      }
    }
  };
  return (
    <div>
     <div className="navbar-container">
      <nav className="navbar">
        <ul className="nav-menu">
          <li className="nav-item">
            <button href="#" className="nav-link">Home</button>
          </li>
          <li className='nav-item'>
            <button className="nav-link">Add User</button>
          </li>
          <li className="nav-item">
            <button onClick={handleCreateEventClick} className="nav-link">Create Event</button>
          </li>
          <li className="nav-item">
            <button className="nav-link" onClick={handleCourseClick}>Course ({events.length})</button>
          </li>
          <li className="nav-item">
            <button className="nav-link" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
    <div className="admin-container">
      {/* <h2>Admin Panel</h2> */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-container">
        <label htmlFor="userID" className="form-label">UserID:</label>
        <input type="text" id="userID" name="userID" value={formData.userID} onChange={handleInputChange} className="form-input" required />

        <label htmlFor="firstName" className="form-label">First Name:</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-input" required />

        <label htmlFor="lastName" className="form-label">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-input" required />

        <label htmlFor="dob" className="form-label">Date of Birth:</label>
        <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleInputChange} className="form-input" required />

        <label htmlFor="mailID" className="form-label">Email:</label>
        <input type="email" id="mailID" name="mailID" value={formData.mailID} onChange={handleInputChange} className="form-input" required />

        <label htmlFor="gender" className="form-label">Gender:</label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="form-input" required>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label htmlFor="skills" className="form-label">Skills:</label>
    <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleInputChange} className="form-input" required />

    <label htmlFor="experience" className="form-label">Experience:</label>
    <input type="text" id="experience" name="experience" value={formData.experience} onChange={handleInputChange} className="form-input" required />

    <label htmlFor="designation" className="form-label">Designation:</label>
    <input type="text" id="designation" name="designation" value={formData.designation} onChange={handleInputChange} className="form-input" required />

        <label htmlFor="role" className="form-label">Role:</label>
        <select id="role" name="role" value={formData.role} onChange={handleInputChange} className="form-input" required>
          <option value="">Select</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button onClick={handleAddUser} className="form-button">Add User</button>
      </div>
    </div>
    </div>
  );
}

export default Adduser;
