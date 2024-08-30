import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface roomInterface {
  token: string;
  uid: string;
  channel: string;
  project_id: string;
}

interface ROOM {
  room: roomInterface;
}

const initialState: ROOM = {
  room: {
    token: '',
    uid: '',
    channel: '',
    project_id: '',
  },
};

const projectSharesSlice = createSlice({
  name: 'ROOM',
  initialState,
  reducers: {
    setRoom(state, action: PayloadAction<roomInterface>) {
      state.room.token = action.payload.token;
      state.room.uid = action.payload.uid;
      state.room.channel = action.payload.channel;
      state.room.project_id = action.payload.project_id;
    },
    clearRoom(state) {
      state.room = initialState.room;
    },
  },
});

export const { setRoom, clearRoom } = projectSharesSlice.actions;
export default projectSharesSlice.reducer;
