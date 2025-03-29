import React, { useState, useEffect } from 'react';

import apiService from '../../services/apiService';

function Homepage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [folders, setFolders] = useState([]); // State to hold folders
  const [selectedFolderId, setSelectedFolderId] = useState(''); // State to hold the selected folder ID

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await apiService.fetchFolders();
      setFolders(fetchedData); // Store fetched folders in state
      console.log('folders',folders)
    };

    fetchData();
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    if (!selectedFolderId) {
      alert('Please select a folder to upload to.');
      return;
    }

    setIsUploading(true);

    try {
      const response = await apiService.uploadFile(selectedFile, selectedFolderId); // Assume uploadFile service can handle folder ID
      console.log('File uploaded successfully:', response.data);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed.');
    } finally {
      setIsUploading(false);
      setSelectedFile(null); // Reset the selected file after upload or failure
      // Optionally reset selected folder ID here as well
    }
  };

  return (
    <div className="homepage-container">
      {/* Dropdown for selecting folder */}
      <select value={selectedFolderId} onChange={(e) => setSelectedFolderId(e.target.value)} className="folder-dropdown">
        <option value="">Select a folder</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>

      {/* Upload Section */}
      <div className="upload-section">
        <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} id="file-upload" />
        <label htmlFor="file-upload" className="custom-file-upload">Upload File</label>
        {selectedFile && <span className="file-name">{selectedFile.name}</span>}
        <button onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}

export default Homepage;
