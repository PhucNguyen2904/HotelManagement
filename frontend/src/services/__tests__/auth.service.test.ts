import { authService } from '../auth.service'
import { mockAuthResponse, mockUser } from '@/__tests__/utils/test-data'

jest.mock('@/services/api')

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('login', () => {
    it('should successfully login and return auth response', async () => {
      const api = require('@/services/api').default
      api.post.mockResolvedValue({
        data: {
          data: mockAuthResponse,
        },
      })

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result).toEqual(mockAuthResponse)
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should handle login error', async () => {
      const api = require('@/services/api').default
      api.post.mockRejectedValue(new Error('Invalid credentials'))

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrong',
        })
      ).rejects.toThrow('Invalid credentials')
    })

    it('should handle network error', async () => {
      const api = require('@/services/api').default
      api.post.mockRejectedValue(new Error('Network Error'))

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Network Error')
    })
  })

  describe('register', () => {
    it('should successfully register new user', async () => {
      const api = require('@/services/api').default
      api.post.mockResolvedValue({
        data: {
          data: mockUser,
        },
      })

      const result = await authService.register({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '0901234567',
      })

      expect(result).toEqual(mockUser)
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '0901234567',
      })
    })

    it('should handle registration error - email already exists', async () => {
      const api = require('@/services/api').default
      api.post.mockRejectedValue(new Error('Email already registered'))

      await expect(
        authService.register({
          fullName: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
          phone: '0901234567',
        })
      ).rejects.toThrow('Email already registered')
    })

    it('should handle validation error', async () => {
      const api = require('@/services/api').default
      api.post.mockRejectedValue(new Error('Invalid email format'))

      await expect(
        authService.register({
          fullName: 'Test User',
          email: 'invalid-email',
          password: 'password123',
          phone: '0901234567',
        })
      ).rejects.toThrow('Invalid email format')
    })
  })

  describe('getProfile', () => {
    it('should fetch user profile', async () => {
      const api = require('@/services/api').default
      api.get.mockResolvedValue({
        data: {
          data: mockUser,
        },
      })

      const result = await authService.getProfile()

      expect(result).toEqual(mockUser)
      expect(api.get).toHaveBeenCalledWith('/auth/profile')
    })

    it('should handle unauthorized error', async () => {
      const api = require('@/services/api').default
      api.get.mockRejectedValue({
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      })

      await expect(authService.getProfile()).rejects.toEqual({
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      })
    })

    it('should handle network error', async () => {
      const api = require('@/services/api').default
      api.get.mockRejectedValue(new Error('Network Error'))

      await expect(authService.getProfile()).rejects.toThrow('Network Error')
    })
  })

  describe('logout', () => {
    it('should remove access token from localStorage', () => {
      localStorage.setItem('accessToken', 'test-token')
      authService.logout()
      expect(localStorage.getItem('accessToken')).toBeNull()
    })

    it('should handle logout when no token exists', () => {
      localStorage.clear()
      expect(() => authService.logout()).not.toThrow()
    })
  })
})
