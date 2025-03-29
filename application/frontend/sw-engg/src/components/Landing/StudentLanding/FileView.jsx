import React from 'react';

// Placeholder data structure for file items
// Replace the placeholder fileItems with state managed by useState.
// Fetch the list from the backend API using useEffect and set the state with the fetched data.

const fileItems = [
  { id: 1, title: 'Introduction to HTML', type: 'pdf', url: '#' },
  { id: 2, title: 'CSS Basics', type: 'video', url: '#' },
  { id: 3, title: 'JavaScript for Beginners', type: 'pdf', url: '#' },
];

const FileView = () => {
  return (
    <div className="file-view">
      <h3>Course Materials</h3>
      <ul>
        {fileItems.map((item) => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title} ({item.type})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileView;
