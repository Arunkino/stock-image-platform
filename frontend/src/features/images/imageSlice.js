import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

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
  async (imageData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`images/${imageData.id}/`, imageData);
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
      .addCase(uploadImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.images = state.images.concat(action.payload);
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
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateImageOrder.fulfilled, (state, action) => {
        state.images = action.payload;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        const index = state.images.findIndex(img => img.id === action.payload.id);
        if (index !== -1) {
          state.images[index] = action.payload;
        }
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.id !== action.payload);
      });
  },
});

export default imageSlice.reducer;