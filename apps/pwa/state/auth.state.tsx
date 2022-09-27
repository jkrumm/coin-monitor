import { useCallback, useState } from 'react';
import { AuthInterface, LoginInterface } from '@cm/types';

export function useAuth() {
  const [auth, setAuth] = useState<AuthInterface | null>(null);

  const getAuth = useCallback(async () => {
    await fetch('/api/auth/')
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.status.toString());
        }
        return res.json();
      })
      .then((resJson) => {
        console.log('GET AUTH WORKED');
        setAuth(resJson);
      })
      .catch(() => {
        setAuth(null);
      });
  }, []);

  const login = useCallback(async ({ email, password }: LoginInterface) => {
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.status.toString());
        }
        return res.json();
      })
      .then((resJson) => {
        console.log('LOGIN WORKED');
        setAuth(resJson);
      })
      .catch(() => {
        setAuth(null);
      });
    // getAuth();
  }, []);

  return {
    auth,
    getAuth,
    login,
  } as const;
}
