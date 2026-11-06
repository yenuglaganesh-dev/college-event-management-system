import { createContext, useContext, useState, useEffect } from 'react';
import { Api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = Api.getToken();
        const savedUser = Api.getUser();

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const loginStudent = async (username, password) => {
        const res = await Api.auth.loginStudent({ username, password });
        if (res.success && res.data) {
            const authData = res.data;
            const userData = {
                id: authData.id,
                username: authData.username,
                fullName: authData.fullName,
                email: authData.email,
                studentId: authData.studentId,
                role: authData.role
            };
            Api.setToken(authData.token);
            Api.setUser(userData);
            setToken(authData.token);
            setUser(userData);
            return userData;
        }
        throw new Error(res.message || 'Login failed');
    };

    const loginAdmin = async (username, password) => {
        const res = await Api.auth.loginAdmin({ username, password });
        if (res.success && res.data) {
            const authData = res.data;
            const userData = {
                id: authData.id,
                username: authData.username,
                fullName: authData.fullName,
                email: authData.email,
                role: authData.role
            };
            Api.setToken(authData.token);
            Api.setUser(userData);
            setToken(authData.token);
            setUser(userData);
            return userData;
        }
        throw new Error(res.message || 'Admin login failed');
    };

    const loginOrganizer = async (username, password) => {
        const res = await Api.auth.loginOrganizer({ username, password });
        if (res.success && res.data) {
            const authData = res.data;
            const userData = {
                id: authData.id,
                username: authData.username,
                fullName: authData.fullName,
                email: authData.email,
                role: authData.role
            };
            Api.setToken(authData.token);
            Api.setUser(userData);
            setToken(authData.token);
            setUser(userData);
            return userData;
        }
        throw new Error(res.message || 'Organizer login failed');
    };

    const registerStudent = async (formData) => {
        const res = await Api.auth.registerStudent(formData);
        if (res.success && res.data) {
            const authData = res.data;
            const userData = {
                id: authData.id,
                username: authData.username,
                fullName: authData.fullName,
                email: authData.email,
                studentId: authData.studentId,
                role: authData.role
            };
            Api.setToken(authData.token);
            Api.setUser(userData);
            setToken(authData.token);
            setUser(userData);
            return userData;
        }
        throw new Error(res.message || 'Registration failed');
    };

    const logout = () => {
        Api.clearAuth();
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ROLE_ADMIN',
        isOrganizer: user?.role === 'ROLE_ORGANIZER',
        isStudent: user?.role === 'ROLE_STUDENT',
        loginStudent,
        loginAdmin,
        loginOrganizer,
        registerStudent,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

