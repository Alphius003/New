import React, { useState, useEffect } from 'react';
import './Home.css';
import NavigationBar from './Nav';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const { userID } = useParams();

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

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(`http://localhost:4000/registered-events/${userID}`);
        if (response.ok) {
          const data = await response.json();
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

  // Function to handle event registration
  const handleEventAction = async (eventID) => {
    try {
      const isRegistered = registeredEvents.includes(eventID);

      const response = await fetch(`http://localhost:4000/${isRegistered ? 'unregister-event' : 'register-events'}/${eventID}/${userID}`, {
        method: isRegistered ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        if (isRegistered) {
          setRegisteredEvents(registeredEvents.filter(id => id !== eventID));
          toast.success('Event unregistered successfully');
        } else {
          setRegisteredEvents([...registeredEvents, eventID]);
          toast.success('Event registered successfully');
        }
      } else {
        throw new Error(isRegistered ? 'Failed to unregister event' : 'Failed to register event');
      }
    } catch (error) {
      console.error('Error handling event action:', error);
      toast.error('Error handling event action');
    }
  };

  return (
    <div>
      <NavigationBar userID={userID} registeredEvents={registeredEvents} />
      {/* <h2>Events</h2> */}
      <div className="event-container">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <h3>{event.name}</h3>
            <p><strong>Start Date:</strong> {event.startDate}</p>
            <p><strong>End Date:</strong> {event.endDate}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Mode of Course:</strong> {event.mode}</p>
            {event.mode === "online" && <p><strong>Meeting Link:</strong> {event.meetingLink}</p>}
            {event.mode === "offline" && <p><strong>Venue:</strong> {event.venue}</p>}
            <div>
            <button 
            className={`form-group ${registeredEvents.includes(event._id) ? 'unregister-button' : 'register-button'}`}
            type="submit" onClick={() => handleEventAction(event._id)}>
                {registeredEvents.includes(event._id) ? 'Unregister' : 'Register'}
            </button>

            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventList;
