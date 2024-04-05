/* eslint-disable */
import { createReducer, SerializedError } from "@reduxjs/toolkit";
import {
  createAsyncThunk,
  createThunkAction,
} from "metabase/lib/redux/typed-utils";
import type {
  EmbeddingSessionTokenState,
  EnterpriseState,
  GetEnterpriseState,
} from "embedding-sdk/types";

const initialState: EmbeddingSessionTokenState = {
  token: null,
  loading: false,
  error: null,
};

export const getSessionToken = (state: EnterpriseState) =>
  state.plugins.embeddingSessionToken;

const GET_OR_REFRESH_SESSION =
  "metabase-enterprise/embeddingSessionToken/GET_OR_REFRESH_SESSION";

export const getOrRefreshSession = createThunkAction(
  GET_OR_REFRESH_SESSION,
  (url: string) => async (_dispatch, getState: GetEnterpriseState) => {
    const state = getSessionToken(getState());
    const token = state?.token;

    if (!state?.loading && (!token || token.exp * 1000 < Date.now())) {
      _dispatch(refreshTokenAsync(url));
    }

    return getState().plugins.embeddingSessionToken;
  },
);
const REFRESH_TOKEN = "metabase-enterprise/embeddingSessionToken/REFRESH_TOKEN";

export const refreshTokenAsync = createAsyncThunk(
  REFRESH_TOKEN,
  async (url: string) => {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    return await response.json();
  },
);

const tokenReducer = createReducer(initialState, builder =>
  builder
    .addCase(refreshTokenAsync.pending, state => {
      state.loading = true;
    })
    .addCase(refreshTokenAsync.fulfilled, (state, action) => {
      state.token = action.payload;
      state.loading = false;
    })
    .addCase(refreshTokenAsync.rejected, (state, action) => {
      state.token = null;
      state.error = action.error;
      state.loading = false;
    }),
);

export { tokenReducer };
