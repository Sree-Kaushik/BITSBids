import React, { createContext, useContext, useReducer } from 'react';
import api from '../utils/api';

const BidContext = createContext();

const initialState = {
  bids: [],
  loading: false,
  error: null
};

const bidReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_BIDS':
      return {
        ...state,
        bids: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_BID':
      return {
        ...state,
        bids: [action.payload, ...state.bids]
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const BidProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bidReducer, initialState);

  const placeBid = async (itemId, amount) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/bids', { itemId, amount });
      dispatch({ type: 'ADD_BID', payload: response.data.data });
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place bid';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const getUserBids = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.get('/bids/user/my-bids');
      dispatch({ type: 'SET_BIDS', payload: response.data.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to fetch bids' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <BidContext.Provider
      value={{
        ...state,
        placeBid,
        getUserBids,
        clearError
      }}
    >
      {children}
    </BidContext.Provider>
  );
};

export const useBid = () => {
  const context = useContext(BidContext);
  if (!context) {
    throw new Error('useBid must be used within a BidProvider');
  }
  return context;
};
