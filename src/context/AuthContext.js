import React, { createContext, useState, useContext, useEffect } from "react";
import { googleAuthService } from "../services/googleAuth";
import { GOOGLE_CONFIG } from "../config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  useEffect(() => {
    initializeGoogleAuth();
  }, []);

  const initializeGoogleAuth = async () => {
    try {
      await googleAuthService.initClient(GOOGLE_CONFIG);
      setGapiLoaded(true);

      // Check if user is already signed in
      if (googleAuthService.isSignedIn()) {
        const currentUser = googleAuthService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to initialize Google Auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      const { user: userData } = await googleAuthService.signIn();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await googleAuthService.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    gapiLoaded,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
