import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import authReducer from '../store/authSlice';
import ProtectedRoute from './ProtectedRoute';

function renderWithAuth(authState, allowedRoles) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: authState },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute allowedRoles={allowedRoles}>
                <div>Secret Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

const loggedOut = { user: null, token: null, role: null, status: 'idle', error: null };
const loggedInStudent = { user: { name: 'Stu' }, token: 'tok', role: 'student', status: 'idle', error: null };
const loggedInTeacher = { user: { name: 'Teach' }, token: 'tok', role: 'teacher', status: 'idle', error: null };

describe('ProtectedRoute', () => {
  it('redirects to /login when there is no token', () => {
    renderWithAuth(loggedOut, ['student']);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to /login when the role is not allowed', () => {
    renderWithAuth(loggedInStudent, ['teacher']);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when authenticated with an allowed role', () => {
    renderWithAuth(loggedInTeacher, ['teacher']);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('renders children when no allowedRoles restriction is set', () => {
    renderWithAuth(loggedInStudent, undefined);
    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });
});
