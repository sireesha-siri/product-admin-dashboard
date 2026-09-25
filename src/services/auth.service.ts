import apiClient from '@/lib/axios';
import { LoginCredentials, LoginResponse, User } from '@/types/auth.types';

export const authService = {
  /**
   * Authenticate user with DummyJSON
   * Test account: emilys / emilyspass
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username: credentials.username.trim(),
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 60,
    });
    return response.data;
  },

  /**
   * Get currently logged-in user profile from DummyJSON auth/me
   */
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
