import React, { useEffect, useState } from 'react';
import apiService from '../../services/apiService'; // Adjust the path as necessary


const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        const loadCourses = async () => {
            setIsLoading(true); // Set loading to true when the operation begins
            try {
                const response = await apiService.fetchCourses();
                // Validate that the response contains data and it is an array
                if (response && Array.isArray(response.data)) {
                    setCourses(response.data); // Only set courses if data is an array
                } else {
                    setCourses([]); // Set courses to an empty array if data is not an array
                }
                setIsLoading(false); // Set loading to false when data is received
            } catch (error) {
                console.error('Failed to fetch courses:', error);
                setCourses([]); // Ensure courses is set to an empty array on error
                setIsLoading(false); // Ensure loading is set to false even if there is an error
            }
        };

        loadCourses();
    }, []);

    if (isLoading) {
        return <div className="courses-container">Loading...</div>; // Display a loading indicator
    }

    if (courses.length === 0) {
        return <div className="courses-container">No courses available.</div>; // Display when no courses are available
    }

    return (
        <div className="courses-container">
            {courses.map((course) => (
                <div key={course.id} className="course-block">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                </div>
            ))}
        </div>
    );
};

export default CoursesPage;


