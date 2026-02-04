import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <h1 className="logo">EduTrack</h1>
                <div className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                        end
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/courses"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Courses
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        Profile
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
