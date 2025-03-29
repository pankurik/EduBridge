import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import FileViewer from 'react-file-viewer';
import apiService from '../../services/apiService'; // Ensure this path is correct
import config from '../../config'; // Import the configuration
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileWord, faFileExcel, faFileImage, faFileVideo,
  faFileAudio, faFile, faDownload
} from '@fortawesome/free-solid-svg-icons';
import './FileDetails.css';  // Import the new CSS file

function getFileIcon(filename) {
  const fileExtension = filename.split('.').pop().toLowerCase();
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

const FileDetails = () => {
  const { id } = useParams(); // Get the file ID from URL parameters
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewerError, setViewerError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const supportedDocViewerTypes = ['pdf', 'html'];
  const supportedFileViewerTypes = ['docx', 'xlsx', 'pptx', 'txt', 'csv', 'md', 'jpeg', 'jpg', 'png', 'gif', 'mp4'];

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        // Fetch file metadata
        const metadata = await apiService.fetchFileMetadata(id);
        const { filename_disk, title, description, user_name, modified_on } = metadata;
        setMetadata({ title, description, user_name, modified_on, filename_disk });
        const extension = filename_disk.split('.').pop().toLowerCase();
        setFileType(extension);

        // Fetch file URL
        const url = `${config.BASE_URL}/file-url/${id}`;
        setFileUrl(url);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching file details:', err);
      }
      setIsLoading(false);
    };

    fetchFileDetails();
  }, [id]); // Dependency array ensures this effect runs only when fileId changes

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography variant="h6">Error loading file: {error}</Typography>;

  const documents = [{ uri: fileUrl }];

  return (
    <Box className="file-details-container">
      <Box className="main-content">
        {fileUrl ? (
          <Box className="file-viewer">
            {supportedDocViewerTypes.includes(fileType) ? (
              <DocViewer 
                documents={documents} 
                pluginRenderers={DocViewerRenderers}
                style={{ width: '100%', height: '100%' }}
                onError={(e) => {
                  console.error('Error in DocViewer:', e);
                  setViewerError('docviewer');
                }}
              />
            ) : supportedFileViewerTypes.includes(fileType) ? (
              <FileViewer
                fileType={fileType}
                filePath={fileUrl}
                onError={(e) => {
                  console.error('Error in FileViewer:', e);
                  setViewerError('fileviewer');
                }}
              />
            ) : (
              <Typography variant="body1" className="unsupported-message">
                Can't view this file type here. Work in progress for this file extension.
              </Typography>
            )}
            {viewerError}
          </Box>
        ) : (
          <Typography variant="body1">No file found.</Typography>
        )}
      </Box>
      <Box className="sidebar">
        {metadata && (
          <>
            <FontAwesomeIcon icon={getFileIcon(metadata.filename_disk)} size="2x" className="file-icon" />
            <Typography variant="h5" className="file-details-title">{metadata.title || 'Detail not available'}</Typography>
            <Typography variant="body2" className="description-preview">{metadata.description}</Typography>
            <Box className="metadata">
              <Typography variant="body2" className="metadata-item">Author: {metadata.user_name || 'Unknown'}</Typography>
              <Typography variant="body2" className="metadata-item">Modified on: {new Date(metadata.modified_on).toLocaleString()}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faDownload} />}
              className="download-button"
              href={fileUrl}
              download
            >
              Download this file instead
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default FileDetails;


