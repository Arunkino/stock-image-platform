import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchImages, updateImageOrder, updateImage, deleteImage } from '../features/images/imageSlice';

const ImageGallery = () => {
  const dispatch = useDispatch();
  const { images, status, error } = useSelector((state) => state.images);
  const [orderedImages, setOrderedImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  useEffect(() => {
    setOrderedImages(images);
  }, [images]);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedImages = Array.from(orderedImages);
    const [reorderedItem] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, reorderedItem);

    setOrderedImages(reorderedImages);
    dispatch(updateImageOrder(reorderedImages.map((img, index) => ({ id: img.id, order: index }))));
  };

  const handleEdit = (image) => {
    setEditingImage(image);
  };

  const handleSaveEdit = () => {
    if (editingImage) {
      dispatch(updateImage(editingImage));
      setEditingImage(null);
    }
  };

  const handleDelete = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      dispatch(deleteImage(imageId));
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="imageList">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-3 gap-4">
            {orderedImages.map((image, index) => (
              <Draggable key={image.id} draggableId={image.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="relative group"
                  >
                    <img src={image.image} alt={image.title} className="w-full h-48 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center">
                      {editingImage?.id === image.id ? (
                        <>
                          <input
                            type="text"
                            value={editingImage.title}
                            onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                            className="mb-2 p-1 text-black"
                          />
                          <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                        </>
                      ) : (
                        <>
                          <p className="text-white text-center mb-2">{image.title}</p>
                          <div>
                            <button onClick={() => handleEdit(image)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                            <button onClick={() => handleDelete(image.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ImageGallery;