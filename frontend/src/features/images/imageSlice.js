import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('images/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadImages = createAsyncThunk(
  'images/uploadImages',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('images/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateImageOrder = createAsyncThunk(
  'images/updateImageOrder',
  async (orderedImages, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch('images/reorder/', { ordered_images: orderedImages });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateImage = createAsyncThunk(
  'images/updateImage',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`images/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async (imageId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`images/${imageId}/`);
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const imageSlice = createSlice({
  name: 'images',
  initialState: {
    images: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = Array.isArray(action.payload) 
          ? [...state.images, ...action.payload].sort((a, b) => a.order - b.order)
          : [...state.images, action.payload].sort((a, b) => a.order - b.order);
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = action.payload.map(img => ({
          ...img,
          id: String(img.id)
        }));
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateImageOrder.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.images = action.payload.map(img => ({
            ...img,
            id: String(img.id)
          }));
        }
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const index = state.images.findIndex(img => img.id === String(action.payload.id));
        if (index !== -1) {
          state.images[index] = {
            ...action.payload,
            id: String(action.payload.id)
          };
        }
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.id !== String(action.payload));
      });
  },
});

export default imageSlice.reducer;