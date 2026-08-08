import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Where each role lands after login
const ROLE_HOME = {
  admin:       '/admin/dashboard',
  user:        '/user/stores',
  store_owner: '/owner/dashboard',
};

function readFromStorage(key, parse = false) {
  try {
    const val = localStorage.getItem(key);
    return parse ? JSON.parse(val) : val;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => readFromStorage('user', true));
  const [token, setToken] = useState(() => readFromStorage('token'));

  /**
   * Persist auth data and return the role-specific redirect path.
   * @param {{ user, token }} payload  — as returned from the login API
   */
  const login = useCallback(({ user: u, token: t }) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('user',  JSON.stringify(u));
    localStorage.setItem('token', t);
    return ROLE_HOME[u.role] || '/';
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token && !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
