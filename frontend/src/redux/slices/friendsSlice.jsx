import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

// default state in redux
const initialState = {
  incomingRequests: [],
  outgoingRequests: [],
  friends: [],
  loading: false,
  error: null,
};

// fetch requests wrappers
export const fetchRequests = createAsyncThunk(
  "friends/fetchRequests",
  async () => {
    const { data } = await axios.get("/friends/requests");
    return data;
  }
);

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async () => {
    const { data } = await axios.get("/friends/list");
    return data;
  }
);

export const sendRequest = createAsyncThunk(
  "friends/sendRequest",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/friends/request/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "failed to send Request" }
      );
    }
  }
);

export const respondRequest = createAsyncThunk(
  "friends/respondRequest",
  async ({ requestId, action }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/friends/respond/${requestId}`, {
        action,
      });
      return { data, requestId, action };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "failed to respond" }
      );
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "friends/cancelRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/friends/cancel/${requestId}`);
      return { data, requestId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { error: "failed to cancel request" }
      );
    }
  }
);

export const searchUsers = createAsyncThunk(
  "friends/searchUsers",
  async (q) => {
    const { data } = await axios.get(
      `/friends/search?q=${encodeURIComponent(q)}`
    );
    return data.results;
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    resetFriendState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.incomingRequests = action.payload.incoming;
        state.outgoingRequests = action.payload.outgoing;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch requests";
      })
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload.friends || action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch friends";
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        const { request } = action.payload;
        state.outgoingRequests.unshift({
          id: request.id,
          to: { _id: request.to, fullName: "", username: "" },
          status: "pending",
        });
      })
      .addCase(respondRequest.fulfilled, (state, action) => {
        const { requestId, action: respAction, data } = action.payload;
        state.incomingRequests = state.incomingRequests.filter(
          (r) => r.id !== requestId
        );
        if (respAction === "accept" && data?.friendId) {
          state.friends.push({ _id: data.friendId });
        }
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        const { requestId } = action.payload;
        state.outgoingRequests = state.outgoingRequests.filter(
          (r) => r.id !== requestId
        );
      });
      
  },
});

export const { resetFriendState } = friendSlice.actions;

export const selectFriends = (state) => state.friends.friends;
export const selectIncoming = (state) => state.friends.incomingRequests;
export const selectOutgoing = (state) => state.friends.outgoingRequests;

export const makeSelectRelationForUser = (userId) => (state) => {
  const uid = String(userId);
  if (state.friends.friends.some((u) => String(u._id) === uid)) return "friend";
  if (state.friends.outgoingRequests.some((r) => String(r.to?._id) === uid))
    return "pending_outgoing";
  if (state.friends.incomingRequests.some((r) => String(r.from?._id) === uid))
    return "pending_incoming";
  return "none";
};

export default friendSlice.reducer;
