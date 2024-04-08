import React from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';


const NavigationBar = ({ userID }) => {
    const navigate = useNavigate(); 
const handleLogout = () => {
    navigate('/'); 
  };
  const handleRegister = () => {
    navigate(`/Registered-Events/${userID}`);
  };
  const handlecomplete = () => {
    navigate(`/completed-events/${userID}`);
  };
    return (
        <div className="navbar-container">
            <nav className="navbar">
                <ul className="nav-menu">
                    <li className="nav-item">
                        <button href="#" className="nav-link">Home</button>
                    </li>
                    <li className='nav-item'>
                    <Link to={`/Registered-Events/${userID}`}/>
                        <button className="nav-link"
                         onClick={handleRegister}
                         >Registered Event</button>
                        {/* </Link> */}
                    </li>
                    <li className="nav-item"> <Link to={`/completed-events/${userID}`}/>
                    <button className="nav-link" onClick={handlecomplete}>Completed Events</button>
                    </li>
                    <li className="nav-item">
                        <Link to={`/profile/${userID}`} ><button className="nav-link">Profile</button> </Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NavigationBar;
