import React, { useState, useEffect } from 'react';

const CompletedEvents = ({ events }) => {
  const [completedEvents, setCompletedEvents] = useState([]);

  useEffect(() => {
    // Filter completed events based on end date
    const now = new Date();
    const completed = events.filter(event => new Date(event.endDate) < now);
    setCompletedEvents(completed);
  }, [events]);

  return (
    <div>
      <h2>Completed Events</h2>
      <div className="completed-event-container">
        {completedEvents.map((event, index) => (
          <div key={index} className="completed-event-card">
            <h3>{event.name}</h3>
            <p><strong>Start Date:</strong> {event.startDate}</p>
            <p><strong>End Date:</strong> {event.endDate}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Mode of Course:</strong> {event.mode}</p>
            {event.mode === "online" && <p><strong>Meeting Link:</strong> {event.meetingLink}</p>}
            {event.mode === "offline" && <p><strong>Venue:</strong> {event.venue}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedEvents;
