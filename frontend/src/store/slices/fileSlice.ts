import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface fileInterface {
  file_id: string;
  language: string;
}

interface IFileSlice {
  file: fileInterface;
  panelVisiblity: boolean;
}

const initialState: IFileSlice = {
  file: {
    file_id: '',
    language: '',
  },
  panelVisiblity: false,
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
    setPanelVisibility(state) {
      state.panelVisiblity = !state.panelVisiblity;
    },
  },
});

export const { setFile, clearFile, setPanelVisibility } = fileSlice.actions;
export default fileSlice.reducer;
