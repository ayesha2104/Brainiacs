import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../utils/axios', () => ({
  default: { post: vi.fn() },
}));

import axios from '../utils/axios';
import authReducer, { login, signup, logout } from './authSlice';

const initialState = { user: null, token: null, role: null, status: 'idle', error: null };

describe('authSlice reducer', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toMatchObject({
      status: 'idle',
      error: null,
    });
  });

  it('handles login.pending', () => {
    const state = authReducer(initialState, { type: login.pending.type });
    expect(state.status).toBe('loading');
    expect(state.error).toBe(null);
  });

  it('handles login.fulfilled by storing user/token/role', () => {
    const payload = { token: 'abc123', user: { _id: '1', role: 'student', name: 'Stu' } };
    const state = authReducer(initialState, { type: login.fulfilled.type, payload });

    expect(state.status).toBe('succeeded');
    expect(state.token).toBe('abc123');
    expect(state.role).toBe('student');
    expect(state.user).toEqual(payload.user);
  });

  it('handles login.rejected by storing the error message', () => {
    const state = authReducer(initialState, { type: login.rejected.type, payload: 'Invalid credentials' });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid credentials');
  });

  it('handles logout by clearing auth state', () => {
    const loggedIn = { user: { _id: '1' }, token: 'abc', role: 'student', status: 'succeeded', error: null };
    const state = authReducer(loggedIn, { type: logout.type });

    expect(state.user).toBe(null);
    expect(state.token).toBe(null);
    expect(state.role).toBe(null);
  });
});

describe('authSlice thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('login persists token/role/user to localStorage on success', async () => {
    const payload = { token: 'xyz', user: { _id: '1', role: 'teacher', name: 'Prof' } };
    axios.post.mockResolvedValueOnce({ data: payload });

    const dispatch = vi.fn();
    const thunk = login({ email: 'a@b.com', password: 'pw', role: 'teacher' });
    await thunk(dispatch, () => ({}), undefined);

    expect(localStorage.getItem('token')).toBe('xyz');
    expect(localStorage.getItem('role')).toBe('teacher');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(payload.user);
  });

  it('login rejects with the server error message on failure', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });

    const dispatch = vi.fn();
    const thunk = login({ email: 'a@b.com', password: 'wrong', role: 'student' });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.payload).toBe('Invalid credentials');
    expect(localStorage.getItem('token')).toBe(null);
  });

  it('signup persists auth data on success', async () => {
    const payload = { token: 'newtok', user: { _id: '2', role: 'student', name: 'New' } };
    axios.post.mockResolvedValueOnce({ data: payload });

    const dispatch = vi.fn();
    const thunk = signup({ name: 'New', email: 'n@b.com', password: 'pw', role: 'student' });
    await thunk(dispatch, () => ({}), undefined);

    expect(localStorage.getItem('token')).toBe('newtok');
  });
});
