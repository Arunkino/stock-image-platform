import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import { fetchImages, updateImageOrder, updateImage, deleteImage } from '../features/images/imageSlice';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import EditModal from './EditModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import EmptyGallery from './EmptyGallery';

const SortableItem = ({ id, image, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="absolute top-2 left-2 z-10 cursor-move" {...attributes} {...listeners}>
        <GripVertical size={20} color="white" />
      </div>
      <img src={image.image} alt={image.title} className="w-full h-48 object-cover rounded-lg" />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <button onClick={() => onEdit(image)} className="mr-2 p-2 bg-blue-500 rounded-full">
          <Edit2 size={20} color="white" />
        </button>
        <button onClick={() => onDelete(image)} className="p-2 bg-red-500 rounded-full">
          <Trash2 size={20} color="white" />
        </button>
      </div>
      <p className="text-center mt-2">{image.title}</p>
    </div>
  );
};


const ImageGallery = () => {
    const dispatch = useDispatch();
    const { images, status, error } = useSelector((state) => state.images);
    const [items, setItems] = useState([]);
    const [editingImage, setEditingImage] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeletingImage, setIsDeletingImage] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
  
    useEffect(() => {
      dispatch(fetchImages());
    }, [dispatch]);
  
    useEffect(() => {
      setItems(images);
    }, [images]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        dispatch(updateImageOrder(newItems.map((img, index) => ({ id: img.id, order: index }))));
        return newItems;
      });
    }
  }, [dispatch]);

  const handleEdit = useCallback((image) => {
    setEditingImage(image);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = useCallback(({ title, newImage }) => {
    if (editingImage) {
      const formData = new FormData();
      formData.append('title', title);
      if (newImage) {
        formData.append('image', newImage);
      }
      dispatch(updateImage({ id: editingImage.id, formData }))
        .unwrap()
        .then(() => {
          toast.success('Image updated successfully');
        })
        .catch(() => {
          toast.error('Failed to update image');
        });
    }
  }, [editingImage, dispatch]);

  const handleDelete = useCallback((image) => {
    setIsDeletingImage(image);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (isDeletingImage) {
      dispatch(deleteImage(isDeletingImage.id))
        .unwrap()
        .then(() => {
          toast.success('Image deleted successfully');
          setIsDeleteModalOpen(false);
        })
        .catch(() => {
          toast.error('Failed to delete image');
        });
    }
  }, [isDeletingImage, dispatch]);

  if (status === 'loading') return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (status === 'failed') return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      {items.length === 0 ? (
        <EmptyGallery />
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map(item => item.id)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((image) => (
                <SortableItem 
                  key={image.id} 
                  id={image.id} 
                  image={image} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      
      <EditModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        image={editingImage}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        imageName={isDeletingImage?.title}
      />
    </div>
  );
};

export default React.memo(ImageGallery);