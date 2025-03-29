import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft, faChevronRight, faInfoCircle, faDownload, faTimes,
    faFilePdf, faFileWord, faFileExcel, faFileImage, faFileVideo,
    faFileAudio, faFile
} from '@fortawesome/free-solid-svg-icons';
import './SearchResultsPage.css';

function getFileIcon(filename_download) {
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
}

function useQuery() {
    const { search } = useLocation();
    return new URLSearchParams(search);
}

const SearchResultsPage = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const searchTerm = query.get('search');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm) {
                setError('No search term provided');
                return;
            }

            setLoading(true);
            setError('');
            try {
                const data = await apiService.fetchSearchedFiles(searchTerm);
                console.log("API Response:", data);  // Ensure you can see what the actual response is
                if (data && Array.isArray(data.data)) {
                    setResults(data.data);
                } else {
                    setError('Data format is incorrect, expected an array inside the data property.');
                    console.error('Incorrect data format:', data);
                }
            } catch (error) {
                console.error('Failed to fetch search results:', error);
                setError('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchTerm]);

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

    return (
        <div>
            <h2>Search Results for: {decodeURIComponent(searchTerm)}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="search-results-container">
                    {results.length > 0 ? (
                        results.map((file, index) => (
                            <div key={index} className="search-result-card">
                                <div className="search-title-container" onClick={() => navigate(`/files/${file.id}`)}>
                                    <FontAwesomeIcon icon={getFileIcon(file.filename_download)} size="2x" className="file-icon"/>
                                    <h3>{file.title || 'Detail not available'}</h3>
                                </div>
                                <div className="search-info">
                                    <p className="description-preview">{truncateDescription(file.description)}</p>
                                    <p>Author: {file.user_name || 'Unknown'}</p>
                                    <p>Modified on: {new Date(file.modified_on).toLocaleString()}</p>
                                </div>
                                
                            </div>
                        ))
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            )}
        </div>
    ); 
};

export default SearchResultsPage;



