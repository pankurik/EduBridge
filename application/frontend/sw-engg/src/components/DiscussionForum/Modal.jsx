import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Breadcrumbs } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import './Modal.css';
import apiService from '../../services/apiService';
import { Dropdown, DropdownMenuItem, DropdownNestedMenuItem } from "./Dropdown";

function Modal(props) {
    const navigate = useNavigate();
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [uploadFileName, setUploadFileName] = useState('');
    const [uploadFileDescription, setUploadFileDescription] = useState('');
    const [uploadFile, setUploadFile] = useState([]);
    const [selectedCoursePath, setSelectedCoursePath] = useState('');
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const fetchedCourses = await apiService.fetchCourses();
                setCourses(fetchedCourses || []);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
            }
        };

        fetchCoursesData();
    }, []);

    const buildMenuItems = (courses, parentPath = '', parentIdPath = '') => {
    return courses.map(course => {
        const path = `${parentPath}${course.name}`;
        const idPath = `${parentIdPath}/${course.id}`;
        if (course.children && course.children.length > 0) {
            return <DropdownNestedMenuItem
                key={course.id}
                label={`${course.name}`}
                menu={buildMenuItems(course.children, `${path} / `, idPath)}
                onClick={() => {
                    setSelectedCoursePath(path);
                    setSelectedCourseId(course.id);
                }}
            />;
        } else {
            return <DropdownMenuItem
                key={course.id}
                onClick={() => {
                    setSelectedCoursePath(path);
                    setSelectedCourseId(course.id);
                }}
            >
                {`${course.name}`}
            </DropdownMenuItem>;
        }
    });
};

    const courseMenuItems = buildMenuItems(courses);

    const onDrop = useCallback(acceptedFiles => {
        setUploadFile(acceptedFiles);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    const submitPost = async () => {
        try {
            const formData = new FormData();
            formData.append('title', postTitle);
            formData.append('description', postDescription);
            formData.append('userEmail', sessionStorage.getItem('userEmail'));
            const data = await apiService.createDiscussion(postTitle,postDescription,sessionStorage.getItem('userEmail'));
            if (data) {
                navigate(`/discussion/${data.id}`);
                props.toggleModal();
            }
        } catch (error) {
            console.error('Error creating discussion:', error);
            setError('Failed to create discussion. Please try again.');
        }
    };

   const handleFileUpload = async () => {
    try {
        if (uploadFile.length === 0) {
            console.error("No file selected for upload");
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadFile[0]);
        formData.append('folderId', selectedCourseId); // Assuming `selectedCourseId` is the ID of the selected course
        formData.append('title', uploadFileName);
        formData.append('description', uploadFileDescription);
        formData.append('tags', 'exampleTag'); // Example tag, change as necessary
        formData.append('uploaded_by', sessionStorage.getItem('userId')); // Hardcoded user ID

        const response = await apiService.uploadFile(formData);
        if (response.data.success) {
            console.log("File uploaded successfully:", response.data);
            alert('File uploaded successfully!');
            props.toggleModal();
        } else {
            console.error("Failed to upload file:", response.data.message);
            alert('Failed to upload file.');
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file.');
    }
};

    return (
        <div className="modal-overlay" onClick={() => props.toggleModal()}>
            {props.modalType === 'Discussions' ? (
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <h2>Add Post</h2>
                    <TextField label="Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Description" value={postDescription} onChange={(e) => setPostDescription(e.target.value)} fullWidth margin="normal" multiline rows={4} />
                    <div className='buttonDiv'>
                        <Button onClick={submitPost} disabled={!postTitle || !postDescription} variant="contained">Post</Button>
                        <Button onClick={() => props.toggleModal()} variant="contained">Cancel</Button>
                    </div>
                </div>
            ) : (
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <h2>Upload File</h2>
                    <Dropdown trigger={<Button sx={{mt: 1, mb: 1}} variant="outlined">Select Path</Button>} menu={courseMenuItems} />
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="textPrimary">{selectedCoursePath || "No path selected"}</Typography>
                        <Typography color="textPrimary">{uploadFile.length > 0 ? uploadFile[0].name : "No file selected"}</Typography>
                    </Breadcrumbs>
                    <TextField label="File Name" value={uploadFileName} onChange={(e) => setUploadFileName(e.target.value)} fullWidth margin="normal" />
                    <TextField label="File Description" value={uploadFileDescription} onChange={(e) => setUploadFileDescription(e.target.value)} fullWidth margin="normal" multiline rows={4} />
                    <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        {isDragActive ? <p>Drop the files here...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
                    </div>
                    <div className='buttonDiv'>
                        <Button onClick={handleFileUpload} disabled={!uploadFileName || !uploadFileDescription || uploadFile.length === 0} variant="contained">Upload</Button>
                        <Button onClick={() => props.toggleModal()} variant="contained">Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Modal;
