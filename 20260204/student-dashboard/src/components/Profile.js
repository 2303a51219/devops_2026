import React from 'react';

function Profile() {
    return (
        <div className="page profile">
            <div className="card profile-card">
                <div className="profile-header">
                    <div className="avatar-placeholder">SC</div>
                    <div className="profile-identity">
                        <h2>Sushruth</h2>
                        <p className="student-id">Student ID: 12345678</p>
                    </div>
                </div>
                <div className="profile-details">
                    <div className="detail-item">
                        <span className="label">Major</span>
                        <span className="value">Computer Science</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Email</span>
                        <span className="value">sushruth@university.edu</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Phone</span>
                        <span className="value">(555) 123-4567</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Admission Year</span>
                        <span className="value">2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
