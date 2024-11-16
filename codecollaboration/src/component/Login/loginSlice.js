import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'users',
    initialState: {
        isLoggedIn: false,
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
        roomId: localStorage.getItem('roomId') || null,
        roomUsers: [],
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload;
            localStorage.setItem('roomId', action.payload);
        },
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        addUserToRoom: (state, action) => {
            state.roomUsers.push(action.payload);
        },
        removeUserFromRoom: (state, action) => {
            state.roomUsers = state.roomUsers.filter(user => user.id !== action.payload.id);
        },
    },
});

export const { setCurrentUser, setLoggedIn, addUserToRoom, setRoomId, removeUserFromRoom } = userSlice.actions;
export default userSlice.reducer;
