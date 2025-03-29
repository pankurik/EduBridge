import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileUpload } from 'react-icons/fa'; // Import the file upload icon

import apiService from "../../../services/apiService"; // Ensure this is correct

const UploadContentPage = ({ onSuccess, onClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleTagInputKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.value !== '') {
      setTags([...tags, event.target.value]);
      event.target.value = '';
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));

    try {
      await apiService.uploadFile(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div {...getRootProps()} className="dropzone">
          <FaFileUpload className="upload-icon" /> {/* Add the file upload icon */}
          <input {...getInputProps()} />
          <p>Drag & drop a file here, or click to select a file</p>
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="tag-input-container">
          <input
            type="text"
            placeholder="Add a tag and press Enter..."
            onKeyDown={handleTagInputKeyDown}
          />
          <div className="tag-container">
            {tags.map((tag, index) => (
              <div key={index} className="tag">
                {tag} <span onClick={() => removeTag(index)}>&times;</span>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" onClick={handleSubmit}>Upload</button>
      </div>
    </div>
  );
};

export default UploadContentPage;





