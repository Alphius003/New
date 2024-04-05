import React, { useState, useEffect } from 'react';
import './course.css';
import { useNavigate } from 'react-router-dom';

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:4000/events');
        if (response.ok) {
          const eventData = await response.json();
          setEvents(eventData);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

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
    navigate('/Create');
  };

  const handleEditEvent = (eventId) => {
    navigate(`/EditEvent/${eventId}`);
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
      <h2>Events</h2>
      <div className="event-container">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.name}</h3>
            <p><strong>Start Date:</strong> {event.startDate}</p>
            <p><strong>End Date:</strong> {event.endDate}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Mode of Course:</strong> {event.mode}</p>
            {event.mode === "online" && <p><strong>Meeting Link:</strong> {event.meetingLink}</p>}
            {event.mode === "offline" && <p><strong>Venue:</strong> {event.venue}</p>}
            <div>
              <button className="btn" type="submit">View Registrations</button>
              <button className="btn" type="submit" onClick={() => handleEditEvent(event.id)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Event;
