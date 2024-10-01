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

const EditModal = ({ isOpen, closeModal, image, onSave }) => {
  const [title, setTitle] = useState(image?.title || '');
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      setNewImage(null);
    }
  }, [image]);

  const handleSave = () => {
    onSave({ title, newImage });
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Image
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter title"
                  />
                  <input
                    type="file"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    className="mt-2"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const DeleteConfirmationModal = ({ isOpen, closeModal, onConfirm, imageName }) => {
  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete Confirmation
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the image "{imageName}"? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={onConfirm}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
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

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)}>
          <div className="grid grid-cols-3 gap-4">
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