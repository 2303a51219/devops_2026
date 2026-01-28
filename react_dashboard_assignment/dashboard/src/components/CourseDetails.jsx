import React from 'react';

const CourseCard = ({ title, duration, instructor, level }) => {
    const cardStyle = {
        background: 'var(--card-bg)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    };

    return (
        <div
            style={cardStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}
        >
            <div style={{
                fontSize: '0.8rem',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600
            }}>
                {level}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{title}</h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>⏱ {duration}</span> • <span>👨‍🏫 {instructor}</span>
            </div>
            <button style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#818cf8',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
            }}>
                Continue Learning
            </button>
        </div>
    );
};

const CourseDetails = () => {
    const courses = [
        { title: "React Fundamentals", duration: "4h 30m", instructor: "Sarah Drasner", level: "Beginner" },
        { title: "Advanced Hooks", duration: "3h 15m", instructor: "Kent C. Dodds", level: "Intermediate" },
        { title: "State Management Redux", duration: "6h 00m", instructor: "Dan Abramov", level: "Advanced" },
        { title: "CSS for JS Developers", duration: "5h 45m", instructor: "Josh Comeau", level: "All Levels" },
    ];

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem',
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem' }}>Your Courses</h2>
            <div style={gridStyle}>
                {courses.map((course, index) => (
                    <CourseCard key={index} {...course} />
                ))}
            </div>
        </div>
    );
};

export default CourseDetails;
