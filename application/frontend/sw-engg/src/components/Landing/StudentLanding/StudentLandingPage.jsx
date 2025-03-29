import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import apiService from '../../../services/apiService'; 
import FileView from './FileView'; 
import DiscussionList from '../../DiscussionForum/DiscussionList';
import MyDiscussions from '../../DiscussionForum/MyDiscussions';

const PopularCoursesCarousel = ({ files }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480, // Adjust breakpoint as needed
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  if (!Array.isArray(files) || files.length === 0) {
    return <div className="empty-state">No files available</div>;
  }

  return (
    <Slider {...settings}>
      {files.map((file) => (
        <div key={file.id} className="file-card">
          <img src={file.thumbnail} alt={file.title} className="file-thumbnail" />
          <div className="file-info">
            <h3>{file.title}</h3>
            <p>{file.description}</p>
            <div className="file-meta">
              <span>{file.category}</span>
              <span>{file.fileSize}</span>
              <span>{file.uploadDate}</span>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

const StudentLandingPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [showMyDiscussions, setShowMyDiscussions] = useState(false);
  const Name = sessionStorage.getItem('firstName');

  useEffect(() => {
    const fetchFilesData = async () => {
      try {
        const filesData = await apiService.fetchFolders();
        setFiles(filesData.data);
      } catch (error) {
        console.error('Error fetching files:', error);
        // Display error message to the user
      }
    };

    fetchFilesData();
  }, []);

  const exploreCourses = () => {
    navigate('/courses');
  };

  const toggleDiscussionsView = () => {
    setShowMyDiscussions(!showMyDiscussions);
  };

  return (
    <div className="landing-page">
      <section className="welcome-section">
        <h2 className="welcome-heading">{Name ? `Hello, ${Name}`: ''}</h2>
        <p className="welcome-description">Discover new courses and enhance your learning journey with us.</p>
        <button className="explore-button" onClick={exploreCourses}>Explore Courses</button>
      </section>

      <main className="split-view">
        <div className="course-content">
          <h2 className="section-heading">Course Materials</h2>
          <FileView />
        </div>
        <div className="discussion-content">
          <h2 className="section-heading">Discussions</h2>
          <button className="toggle-button" onClick={toggleDiscussionsView}>
            {showMyDiscussions ? 'Show All Discussions' : 'Show My Discussions'}
          </button>
          {showMyDiscussions ? <MyDiscussions /> : <DiscussionList />}
        </div>
      </main>

      <section className="featured-courses">
        <h2 className="section-heading">Popular Files</h2>
        <PopularCoursesCarousel files={files} />
      </section>

      <footer className="landing-footer">
        <p className="footer-text">© 2024 Your Learning Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Custom arrow components for Slider
const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <i className="fas fa-chevron-left"></i>
    </div>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <i className="fas fa-chevron-right"></i>
    </div>
  );
};

export default StudentLandingPage;

