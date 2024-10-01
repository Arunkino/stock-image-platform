import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImages } from '../features/images/imageSlice';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [titles, setTitles] = useState({});
  const dispatch = useDispatch();

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    const newTitles = { ...titles };
    selectedFiles.forEach((file) => {
      newTitles[file.name] = '';
    });
    setTitles(newTitles);
  }, [titles]);

  const handleTitleChange = useCallback((fileName, title) => {
    setTitles(prevTitles => ({ ...prevTitles, [fileName]: title }));
  }, []);

  const handleRemoveFile = useCallback((fileName) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
    setTitles(prevTitles => {
      const newTitles = { ...prevTitles };
      delete newTitles[fileName];
      return newTitles;
    });
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image`, file);
      formData.append(`title`, titles[file.name] || `Untitled ${index + 1}`);
    });
    dispatch(uploadImages(formData)).then(() => {
      toast.success('Images uploaded successfully!');
    }).catch(() => {
      toast.error('Failed to upload images');
    });
    setFiles([]);
    setTitles({});
  }, [files, titles, dispatch]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} />
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={file.name} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <input
              type="text"
              placeholder="Enter title"
              value={titles[file.name] || ''}
              onChange={(e) => handleTitleChange(file.name, e.target.value)}
              className="mt-2 w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={() => handleRemoveFile(file.name)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      {files.length > 0 && (
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Upload {files.length} {files.length === 1 ? 'Image' : 'Images'}
        </button>
      )}
    </form>
  );
};

export default ImageUpload;