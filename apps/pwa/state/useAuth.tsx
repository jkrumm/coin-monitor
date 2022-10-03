import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthInterface, AuthWithExpiryInterface } from '@cm/types';
import { DateTime } from 'luxon';

// const useReactPath = () => {
//   const [path, setPath] = React.useState(window.location.pathname);
//   const listenToPopstate = () => {
//     const winPath = window.location.pathname;
//     setPath(winPath);
//   };
//   React.useEffect(() => {
//     window.addEventListener('popstate', listenToPopstate);
//     return () => {
//       window.removeEventListener('popstate', listenToPopstate);
//     };
//   }, []);
//   return path;
// };

const toAuthInterface = ({
  authId,
  username,
  email,
}: AuthWithExpiryInterface): AuthInterface => {
  return {
    authId,
    email,
    username,
  };
};

interface AuthContextType {
  auth?: AuthInterface;
  loading: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  register: (email: string, name: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [auth, setAuth] = useState<AuthInterface>();
  const [expirationDate, setExpirationDate] = useState<number>(0);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // TODO: If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, []);

  useEffect(() => {
    if (expirationDate === 0) {
      fetch('/api/auth/')
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          return res.json();
        })
        .then((auth: AuthWithExpiryInterface) => {
          setAuth(toAuthInterface(auth));
          setExpirationDate(auth.expirationDate);
        })
        .catch(() => refreshToken())
        .finally(() => setLoadingInitial(false));
      return;
    }

    const timeToRefreshToken =
      (expirationDate - DateTime.now().toUTC().toSeconds() - 15) * 1000;

    let timer = setTimeout(() => {
      refreshToken();
    }, timeToRefreshToken);

    return () => {
      clearTimeout(timer);
    };
  }, [expirationDate]);

  function refreshToken() {
    fetch('/api/auth/refresh')
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        return res.json();
      })
      .then((auth: AuthWithExpiryInterface) => {
        setAuth(toAuthInterface(auth));
        setExpirationDate(auth.expirationDate);
      })
      .catch(() => {
        setAuth(null);
        setExpirationDate(0);
      });
  }

  function login(email: string, password: string) {
    setLoading(true);

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
      .then((auth: AuthWithExpiryInterface) => {
        setAuth(toAuthInterface(auth));
        setExpirationDate(auth.expirationDate);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function register(email: string, username: string, password: string) {
    setLoading(true);

    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error(res.status.toString());
        }
        return res.json();
      })
      .then((auth: AuthWithExpiryInterface) => {
        setAuth(toAuthInterface(auth));
        setExpirationDate(auth.expirationDate);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function logout() {
    setLoading(true);
    fetch('/api/auth/logout')
      .then(() => {
        setAuth(undefined);
        setExpirationDate(0);
      })
      .finally(() => {
        setError(null);
        setLoading(false);
      });
  }

  const memoedValue = useMemo(
    () => ({
      auth,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [auth, loading, error],
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
