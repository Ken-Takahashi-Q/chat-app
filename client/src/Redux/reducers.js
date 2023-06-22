import { SET_SELECTED_CHAT_ROOM } from './actions';

const initialState = {
  selectedChatRoom: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_CHAT_ROOM:
      return {
        ...state,
        selectedChatRoom: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
