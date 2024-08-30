import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface roomInterface {
  token: string;
  uid: string;
  channel: string;
  project_id: string;
}

interface ROOM {
  room: roomInterface;
  invitationCount: number;
}

const initialState: ROOM = {
  room: {
    token: '',
    uid: '',
    channel: '',
    project_id: '',
  },
  invitationCount: 0,
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
    setInvitationCount(state, action: PayloadAction<number>) {
      state.invitationCount = action.payload;
    },
  },
});

export const { setRoom, clearRoom, setInvitationCount } =
  projectSharesSlice.actions;
export default projectSharesSlice.reducer;
