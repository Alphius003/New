import React, { useState, useEffect } from 'react';

const RegisteredEvents = ({ userID }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(`http://localhost:4000/Registered-Events/${userID}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setRegisteredEvents(data);
        } else {
          console.error('Failed to fetch registered events');
        }
      } catch (error) {
        console.error('Error fetching registered events:', error);
      }
    };

    fetchRegisteredEvents();
  }, [userID]);

  return (
    <div>
      <h2>Registered Events</h2>
      <ul>
        {registeredEvents.map(event => (
          <li key={event._id}>
          <strong>Event ID:</strong> {event.eventID}, <strong>User ID:</strong> {event.userID}
        </li>
        
        ))}
      </ul>
    </div>
  );
};

export default RegisteredEvents;
