import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructorLandingPage.css';
import Modal from '../../DiscussionForum/Modal';
import apiService from '../../../services/apiService';
import { Box, Paper, Typography } from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CommentIcon from '@mui/icons-material/Comment';
import PhotoCarousel from './PhotoCarousel';
import CoursesCarousel from './CoursesCarousel';
import FilesCarousel from './FilesCarousel';
import { TabContext } from '../../context/TabContext';
import { SearchContext } from '../../context/SearchContext';

const InstructorLandingPage = (props) => {
    const { activeTab, setActiveTab } = useContext(TabContext);
    const { searchTerm } = useContext(SearchContext);
    const [files, setFiles] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [courses, setCourses] = useState([]); // State for courses
    const navigate = useNavigate();
    const role = sessionStorage.getItem('role'); // Fetching role from sessionStorage

    const fetchFiles = async () => {
        try {
            const filesData = await apiService.fetchAllFiles();
            console.log('Fetched files:', filesData);
            setFiles(filesData.data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const coursesData = await apiService.fetchCourses();
            console.log('Fetched courses:', coursesData);
            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {

        fetchDiscussionsFromApi(searchTerm);
    }, [searchTerm]);

    const fetchDiscussionsFromApi = async (term = '') => {
        try {
            let response;
            if (term) {
                response = await apiService.searchDiscussions(term);
            } else {
                response = await apiService.fetchDiscussions();
                console.log('Expected response structure:',response)
            }
            if (response && response.discussion && response.replies) {
                const discussionsWithRepliesCount = response.discussion.map(discussion => {
                    const repliesCount = response.replies.filter(reply => reply.discussion_id === discussion.id).length;
                    return { ...discussion, repliesCount };
                });
                setDiscussions(discussionsWithRepliesCount);
            } else {
                console.error('Unexpected response structure:', response);
            }
        } catch (error) {
            console.error('Error fetching discussions:', error);
        }
    };

    const handleDiscussionClick = (id) => {
        navigate(`/discussion/${id}`);
    };

    const handleTabClick = (tab) => setActiveTab(tab);
    const closeModal = () => props.setModal(false);

    return (
        <div className="instructor-landing-page">
            {props.modalOpen && (
                <Modal toggleModal={() => props.toggleModal()} modalType={props.modalType} />
            )}

            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tab1')}
                >
                    Content
                </button>
                <button
                    className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tab2')}
                >
                    Discussions
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'tab1' ? (
                    <div>
                        <PhotoCarousel photos={files} />
                        <CoursesCarousel courses={courses} /> {/* Integrate CoursesCarousel */}
                        <FilesCarousel files={files} /> {/* Include PopularFilesCarousel */}
                    </div>
                ) : (
                    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
                        {discussions.map((discussion) => (
                            <Paper key={discussion.id} elevation={2} sx={{ p: 2, mb: 2, cursor: 'pointer' }}
                                   onClick={() => handleDiscussionClick(discussion.id)}>
                                <Typography variant="h6" sx={{ mb: 1 }}>{discussion.title}</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>{discussion.content}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ThumbUpAltIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                                    <Typography sx={{ mx: 2 }}>{discussion.likes}</Typography>
                                    <ThumbDownAltIcon sx={{ mr: 0.5, color: 'secondary.main' }} />
                                    <Typography sx={{ mx: 2 }}>{discussion.dislikes}</Typography>
                                    <CommentIcon sx={{ ml: 2, mr: 0.5, color: 'action.active' }} />
                                    <Typography>{discussion.repliesCount}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}
            </div>
        </div>
    );
};

export default InstructorLandingPage;
