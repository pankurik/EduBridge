import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft, faChevronRight, faInfoCircle, faDownload, faTimes,
    faFilePdf, faFileWord, faFileExcel, faFileImage, faFileVideo,
    faFileAudio, faFile
} from '@fortawesome/free-solid-svg-icons';
import apiService from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';
import './FilesCarousel.css';

// Function to determine the icon based on file type
const getFileIcon = (filename_download) => {
    const fileExtension = filename_download.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'pdf': return faFilePdf;
        case 'doc':
        case 'docx': return faFileWord;
        case 'xls':
        case 'xlsx': return faFileExcel;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return faFileImage;
        case 'mp4':
        case 'avi':
        case 'mov': return faFileVideo;
        case 'mp3':
        case 'wav':
        case 'aac': return faFileAudio;
        default: return faFile; // Generic file icon for unknown types
    }
};

// Components for navigation arrows in the slider
const PrevArrow = ({ className, style, onClick }) => (
    <div className={className} style={{ ...style, display: "block", left: 25, zIndex: 1 }} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
    </div>
);

const NextArrow = ({ className, style, onClick }) => (
    <div className={className} style={{ ...style, display: "block", right: 25, zIndex: 1 }} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} />
    </div>
);

// Modal component for displaying file details
const Modal = ({ file, onClose }) => (
    <div className="modal">
        <div className="modal-content">
            <span className="close-button" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></span>
            <p>{file.description || "No description provided."}</p>
        </div>
    </div>
);

// Main component for displaying files in a carousel
const PopularFilesCarousel = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const filesData = await apiService.fetchAllFiles();
                const sortedFiles = filesData.data.sort((a, b) => new Date(b.modified_on) - new Date(a.modified_on)).slice(0, 10);
                setFiles(sortedFiles.map(file => ({
                    ...file,
                    downloadUrl: `http://3.137.218.130:8055/assets/${file.id}?download` // Correctly formatted download URL
                })));
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFiles();
    }, []);

    const handleInfoClick = (file) => {
        setSelectedFile(file);
        setModalOpen(true);
    };

    const truncateDescription = (description) => {
        if (description) {
            const words = description.split(' ');
            if (words.length > 30) {
                return words.slice(0, 30).join(' ') + '...';
            }
            return description;
        }
        return '';
    };

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 }
            }
        ]
    };

    const handleDownloadClick = async (fileId) => {
    try {
        await apiService.downloadFile(fileId);
        console.log('File downloaded successfully');
    } catch (error) {
        console.error('Failed to download file:', error);
    }
    };

    return (
        <div className="carousel-container">
            <h2 className="carousel-title">Recent Files</h2>
            <Slider {...settings}>
                {files.map((file) => (
                    <div key={file.id} className="file-card">
                        <div className="file-info">
                            <div className="file-title-container" onClick={() => navigate(`/files/${file.id}`)}>
                                <FontAwesomeIcon icon={getFileIcon(file.filename_download)} className="file-icon" />
                                <h3 className="file-title" style={{ cursor: 'pointer' }}>{file.title}</h3>
                            </div>
                            <div className="file-details">
                                <p className="description-preview">{truncateDescription(file.description)}</p>
                                <p className="author-name">Author: {file.user_name}</p>
                                <p className="modified-date">Modified on: {new Date(file.modified_on).toLocaleString()}</p>
                                <div className="action-buttons">
                                    <button className="info-button" onClick={() => handleInfoClick(file)}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                    </button>
                                    <button className='download-link' onClick={() => handleDownloadClick(file.id)}><FontAwesomeIcon icon={faDownload} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            {modalOpen && <Modal file={selectedFile} onClose={() => setModalOpen(false)} />}
        </div>
    );
};

export default PopularFilesCarousel;