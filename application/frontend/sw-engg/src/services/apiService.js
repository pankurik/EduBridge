import axios from "axios";
import config from "../config";

const signup = (firstName, lastName, email, password) => {
  return axios.post(`${config.BASE_URL}/signup`, {
    firstName,
    lastName,
    email,
    password,
  });
};

const fetchUserFirstName = (email) => {
  return axios.get(`${config.BASE_URL}/userFirstName/${email}`);
}

const fetchDiscussionDetail = (id) => {
  return axios.get(`${config.BASE_URL}/api/discussions/${id}`);
}

const postReply = (id, content) => {
  return axios.post(`${config.BASE_URL}/api/discussions/${id}/replies`, { content });
}
const requestPasswordReset = (email) => {
  return axios.post(`${config.BASE_URL}/request-password-reset`, { email });
};

const resetPasswordWithOtp = (email, otp, newPassword) => {
  return axios.post(`${config.BASE_URL}/reset-password-with-otp`, { email, otp, newPassword });
};

const login = (email, password) => {
  return axios.post(`${config.BASE_URL}/login`, { email, password });
};

const loginWithOtp = (email, hashedPassword, otp) => {
  return axios.post(`${config.BASE_URL}/verify-otp`, { email, hashedPassword, otp });
};

const fetchUsers = async () => {
  const response = await axios.get(`${config.BASE_URL}/users`);
  return response.data.data;
};

const updateUserRole = async (email, newRole) => {
  const response = await axios.post(`${config.BASE_URL}/updateRole`, {
    role: newRole,
    email: email
  });
  return response.data;
};

export const uploadFile = (formData) => {
  return axios.post(`${config.BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const fetchFolders = async () => {
  const response = await axios.get(`${config.BASE_URL}/folders`);
  return response.data.data;
};

const fetchCourses = async () => {
  const response = await axios.get(`${config.BASE_URL}/courses`);
  return response.data;
};

const fetchUserRole = async (email) => {
  const response = await axios.get(`${config.BASE_URL}/userRole/${email}`);
  return response.data.data;
};

const createDiscussion = async (title, content, userEmail) => {
  const response = await axios.post(`${config.BASE_URL}/api/discussions`, { title, content, userEmail });
  return response.data;
};

const fetchDiscussions = async () => {
  try {
    const response = await fetch(`${config.BASE_URL}/api/discussions`); // Template literal used
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching discussions:', error);
    throw error;
  }
};



const fetchSearchedFiles = async (searchTerm) => {
  try {
    // Construct the query URL with the search term as a query parameter
    const queryUrl = `${config.BASE_URL}/searchFiles?search=${encodeURIComponent(searchTerm)}`;
    const response = await axios.get(queryUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

const deleteDiscussion = async (id) => {
  const response = await axios.delete(`${config.BASE_URL}/api/discussions/${id}`);
  return response.data;
};

const fetchMyDiscussions = async (userEmail) => {
  try {
    const response = await axios.get(`${config.BASE_URL}/api/discussions/my/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my discussions:', error);
    throw error;
  }
};



const handleLike = async (id, userId) => {
  try {
    const response = await fetch(`${config.BASE_URL}/api/discussions/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Could not like the discussion');
    }
    return await response.json();
  } catch (error) {
    console.error('Error liking discussion:', error);
    throw error;
  }
};

const dislikeDiscussion = async (id, userId) => {
  try {
    const response = await fetch(`${config.BASE_URL}/api/discussions/${id}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Could not dislike the discussion');
    }
    return await response.json();
  } catch (error) {
    console.error('Error disliking discussion:', error);
    throw error;
  }
};




const updateDiscussion = async (id, title, content, userEmail) => {
  try {
    const response = await axios.put(`${config.BASE_URL}/api/discussions/${id}`, { title, content, userEmail });
    return response.data;
  } catch (error) {
    console.error('Error updating discussion:', error);
    throw error;
  }
};

const fetchAllFiles = async (searchTerm) => {
  try {
    // Construct the query URL with the search term as a query parameter
    const queryUrl = `${config.BASE_URL}/files`
    const response = await axios.get(queryUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};


function downloadFile(fileId) {
  axios({
      url: `${config.BASE_URL}/download-file/${fileId}`,
      method: 'GET',
      responseType: 'blob',
  }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'default_filename.ext';
      if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
          if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
          }
      }

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 100);
  }).catch(error => {
      console.error('Download failed:', error);
  });
}

const fetchFileUrl = async (id) => {
  try {
      const response = await axios.get(`${config.BASE_URL}/file-url/${id}`);
      return response.data.fileUrl;
  } catch (error) {
      console.error('Error fetching file URL:', error);
      throw error;
  }
};

const fetchFileMetadata = async (id) => {
  try {
      const response = await axios.get(`${config.BASE_URL}/files/${id}`);
      return response.data.data;  // Assuming the server sends the data in this structure
  } catch (error) {
      console.error('Error fetching file metadata:', error);
      throw error;  // or handle the error as you see fit
  }
};

const searchDiscussions = async (searchTerm) => {
  try {
    const response = await fetch(`${config.BASE_URL}/api/discussions/search/${searchTerm}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching discussions:', error);
    throw error;
  }
}

// Export the service functions
export default {
  signup,
  login,
  loginWithOtp,
  fetchUsers,
  uploadFile,
  fetchFolders,
  updateUserRole,
  fetchUserRole,
  createDiscussion,
  fetchDiscussions, 
  handleLike,
  fetchSearchedFiles,
  requestPasswordReset,
  resetPasswordWithOtp,
  fetchDiscussionDetail,
  postReply,
  deleteDiscussion,
  fetchUserFirstName,
  fetchMyDiscussions,
  dislikeDiscussion,
  searchDiscussions,
  updateDiscussion,
  fetchCourses,
  fetchAllFiles,
  fetchFileMetadata,
  downloadFile,
  fetchFileUrl
}
