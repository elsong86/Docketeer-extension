import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line
import { useAppDispatch } from './hooks';
import { AlertStateType } from '../../ui-types';
import { setPrunePrompt } from './pruneReducer';

// Updated initialState to match the refined AlertStateType: alertList is now initialized as [null, null] and promptList as [null, null, null].
const initialState: AlertStateType = {
  alertList: [null, null],
  promptList: [null, null, null],
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlert: (
      state,
      action: PayloadAction<{ alert: string | null; type: string | null }>
    ) => {
      state.alertList = [action.payload.alert, action.payload.type];
    },
    // Ensured setPrompt sets promptList to an empty array only if handleAccept is null.
    setPrompt: (
      state,
      action: PayloadAction<{
        prompt: string | null;
        handleAccept: (() => void) | null;
        handleDeny: (() => void) | null;
      }>
    ) => {
      
      if (action.payload.handleAccept === null) {
        state.promptList = [];
      } else {
        state.promptList = [
          action.payload.prompt,
          action.payload.handleAccept,
          action.payload.handleDeny,
        ];
      }
    },
  },
});


export const { setAlert, setPrompt } = alertSlice.actions;

let timeoutId: ReturnType<typeof setTimeout> | null = null;

export const createAlert = (
  alert: string | null,
  time: number,
  type: string
) => {
  return (useAppDispatch: (arg: PayloadAction<object>) => void) => {
    useAppDispatch(setAlert({ alert, type }));
    useAppDispatch(
      // sending null to clear the prompt
      setPrompt({ prompt: null, handleAccept: null, handleDeny: null })
    );
    useAppDispatch(
      setPrunePrompt({
        prompt: null,
        handleSystemPrune: null,
        handleNetworkPrune: null,
        handleDeny: null,
      })
    );

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      // sending null to clear the alert
      useAppDispatch(setAlert({ alert: null, type: null }));
    }, time * 1000);
  };
};

export const createPrompt = (
  prompt: string | null,
  handleAccept: (() => void) | null,
  handleDeny: (() => void) | null
) => {
  return (useAppDispatch: (arg: PayloadAction<object>) => void) => {
    useAppDispatch(setPrompt({ prompt, handleAccept, handleDeny }));
  };
};

export default alertSlice.reducer;
