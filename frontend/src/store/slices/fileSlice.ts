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
    togglePanelVisibility(state) {
      state.panelVisiblity = !state.panelVisiblity;
    },
    displayPanel(state) {
      state.panelVisiblity = true;
    },
    removePanel(state) {
      state.panelVisiblity = false;
    },
  },
});

export const {
  setFile,
  clearFile,
  togglePanelVisibility,
  displayPanel,
  removePanel,
} = fileSlice.actions;
export default fileSlice.reducer;
