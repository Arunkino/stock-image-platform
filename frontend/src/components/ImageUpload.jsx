import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImages } from '../features/images/imageSlice';

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [titles, setTitles] = useState({});
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    const newTitles = {};
    [...e.target.files].forEach((file) => {
      newTitles[file.name] = '';
    });
    setTitles(newTitles);
  };

  const handleTitleChange = (fileName, title) => {
    setTitles({ ...titles, [fileName]: title });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image`, file);
      formData.append(`title`, titles[file.name] || `Untitled ${index + 1}`);
    });
    dispatch(uploadImages(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>
      {files.map((file, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{file.name}</span>
          <input
            type="text"
            placeholder="Enter title"
            value={titles[file.name] || ''}
            onChange={(e) => handleTitleChange(file.name, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      ))}
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Upload
      </button>
    </form>
  );
};

export default ImageUpload;