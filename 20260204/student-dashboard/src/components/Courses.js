import React from 'react';

function Courses() {
    const courses = [
        { id: 1, code: "CS101", name: "Introduction to React", instructor: "Dr. Smith", progress: 60 },
        { id: 2, code: "CS102", name: "Advanced CSS", instructor: "Prof. Johnson", progress: 85 },
        { id: 3, code: "CS201", name: "Data Structures", instructor: "Dr. Brown", progress: 40 },
        { id: 4, code: "SE301", name: "Software Engineering", instructor: "Prof. Davis", progress: 10 }
    ];

    return (
        <div className="page courses">
            <header className="page-header">
                <h2>Enrolled Courses</h2>
            </header>
            <div className="courses-list">
                {courses.map(course => (
                    <div key={course.id} className="card course-card">
                        <div className="course-info">
                            <span className="course-code">{course.code}</span>
                            <h3>{course.name}</h3>
                            <p className="instructor">Instructor: {course.instructor}</p>
                        </div>
                        <div className="course-progress">
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <span className="progress-text">{course.progress}% Complete</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Courses;
