import React, { useState } from 'react';
import './NavBar.css';
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const [events] = useState([]);
  const navigate = useNavigate(); 
  const handleAddUser = () => {
    navigate('/User'); 
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
  // const [setDisplayCourses] = useState(false);
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <ul className="nav-menu">
          <li className="nav-item">
            <button href="#" className="nav-link">Home</button>
          </li>
          <li className='nav-item'>
            <button className="nav-link" onClick={handleAddUser}>Add User</button>
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
  );
};

export default NavBar;
