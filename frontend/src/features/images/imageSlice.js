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
        state.images.push(...action.payload);
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
      });
  },
});

export default imageSlice.reducer;