'use client'

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/render'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import * as authStore from '@/stores/authStore'
import { useRouter } from 'next/navigation'

jest.mock('@/stores/authStore')
jest.mock('next/navigation')

const mockPush = jest.fn()
const mockLogin = jest.fn()

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(authStore.useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    })
  })

  describe('Rendering', () => {
    it('should render login form', () => {
      render(<LoginForm />)
      expect(screen.getByRole('heading', { name: /đăng nhập/i })).toBeInTheDocument()
    })

    it('should render email input', () => {
      render(<LoginForm />)
      expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument()
    })

    it('should render password input', () => {
      render(<LoginForm />)
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    })

    it('should render submit button', () => {
      render(<LoginForm />)
      expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
    })

    it('should render register link', () => {
      render(<LoginForm />)
      expect(screen.getByText('Đăng ký ngay')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with email and password', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('email@example.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })

    it('should redirect to home on successful login', async () => {
      mockLogin.mockResolvedValue(undefined)
      const user = userEvent.setup()

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('email@example.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('should show error message on login failure', async () => {
      const errorMessage = 'Invalid credentials'
      mockLogin.mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      })
      const user = userEvent.setup()

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('email@example.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrong')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should show generic error message when response has no message', async () => {
      mockLogin.mockRejectedValue({})
      const user = userEvent.setup()

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('email@example.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Login failed')).toBeInTheDocument()
      })
    })

    it('should not show error message initially', () => {
      render(<LoginForm />)
      expect(screen.queryByText(/invalid|failed|error/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should require email field', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })
      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement

      await user.click(submitButton)

      expect(emailInput.required).toBe(true)
    })

    it('should require password field', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })
      const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement

      await user.click(submitButton)

      expect(passwordInput.required).toBe(true)
    })
  })

  describe('Loading State', () => {
    it('should show loading state when logging in', () => {
      ;(authStore.useAuthStore as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: true,
      })

      render(<LoginForm />)
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

      expect(submitButton).toBeDisabled()
    })

    it('should disable submit during loading', () => {
      ;(authStore.useAuthStore as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: true,
      })

      render(<LoginForm />)
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Reset on Error', () => {
    it('should clear error when user starts typing', async () => {
      mockLogin.mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      })
      const user = userEvent.setup()

      render(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('email@example.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng nhập/i })

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrong')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })

      await user.clear(emailInput)
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
    })
  })
})
