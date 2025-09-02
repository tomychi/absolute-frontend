export interface userCompanies {
  id: string;
  userId: string;
  companyId: string;
  accessLevelId: number;
  roleName: string;
  status: string;
  isActive: boolean;
  joinedAt: string;
  lastActivity: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    taxId: string;
  };
  accessLevel: {
    id: number;
    name: string;
    hierarchyLevel: number;
  };
  }
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  userCompanies: userCompanies[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}
