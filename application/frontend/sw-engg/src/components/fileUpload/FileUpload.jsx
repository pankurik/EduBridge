// FileUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [path, setPath] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePathChange = (event) => {
    setPath(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !path) {
      alert('Please select a file and enter a path.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      alert('File upload failed');
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <input type="text" value={path} onChange={handlePathChange} placeholder="Enter the path" />
        </div>
        <button type="submit">Upload File</button>
      </form>
    </div>
  );
}

export default FileUpload;
