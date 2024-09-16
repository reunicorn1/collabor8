import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface fileInterface {
  file_id: string;
  language: string;
}

interface fileSlice {
  file: fileInterface;
}

const initialState: fileSlice = {
  file: {
    file_id: '',
    language: '',
  },
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFile(state, action: PayloadAction<fileInterface>) {
      state.file.file_id = action.payload.file_id;
      state.file.language = action.payload.language;
    },
    clearFile(state) {
      state.file = initialState.file;
    },
  },
});

export const { setFile, clearFile } = fileSlice.actions;
export default fileSlice.reducer;
