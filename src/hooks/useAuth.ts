import { useState, useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already initialized
    if (!netlifyIdentity.currentUser()) {
      netlifyIdentity.init();
    }

    const initHandler = (user: netlifyIdentity.User | null) => {
      setUser(user ? {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name,
        picture: user.user_metadata?.avatar_url
      } : null);
      setLoading(false);
    };

    const loginHandler = (user: netlifyIdentity.User) => {
      setUser({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name,
        picture: user.user_metadata?.avatar_url
      });
      netlifyIdentity.close();
    };

    const logoutHandler = () => {
      setUser(null);
    };

    netlifyIdentity.on('init', initHandler);
    netlifyIdentity.on('login', loginHandler);
    netlifyIdentity.on('logout', logoutHandler);

    // Trigger init handler with current user
    initHandler(netlifyIdentity.currentUser());

    return () => {
      netlifyIdentity.off('init', initHandler);
      netlifyIdentity.off('login', loginHandler);
      netlifyIdentity.off('logout', logoutHandler);
    };
  }, []);

  return {
    user,
    loading,
    login: () => netlifyIdentity.open('login'),
    signup: () => netlifyIdentity.open('signup'),
    logout: () => netlifyIdentity.logout(),
    getToken: () => netlifyIdentity.currentUser()?.token?.access_token
  };
};
