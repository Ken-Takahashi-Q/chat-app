export const selectChatRoom = (room) => {
  return {
    type: 'SELECT_CHAT_ROOM',
    payload: room,
  };
};

export const SET_SELECTED_CHAT_ROOM = 'SET_SELECTED_CHAT_ROOM';

export const setSelectedChatRoom = (room) => {
  return {
    type: SET_SELECTED_CHAT_ROOM,
    payload: room,
  };
};
