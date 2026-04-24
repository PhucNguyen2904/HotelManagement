'use client'

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/render'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from './RegisterForm'
import { authService } from '@/services/auth.service'
import { useRouter } from 'next/navigation'

jest.mock('@/services/auth.service')
jest.mock('next/navigation')

const mockPush = jest.fn()
const mockRegister = jest.fn()

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(authService.register as jest.Mock).mockImplementation(mockRegister)
  })

  describe('Rendering', () => {
    it('should render register form', () => {
      render(<RegisterForm />)
      expect(screen.getByRole('heading', { name: /đăng ký/i })).toBeInTheDocument()
    })

    it('should render all input fields', () => {
      render(<RegisterForm />)
      expect(screen.getByPlaceholderText('Nguyễn Văn A')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('0901234567')).toBeInTheDocument()
      expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2)
    })

    it('should render submit button', () => {
      render(<RegisterForm />)
      expect(screen.getByRole('button', { name: /đăng ký/i })).toBeInTheDocument()
    })

    it('should render login link', () => {
      render(<RegisterForm />)
      expect(screen.getByText('Đăng nhập', { selector: 'a' })).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with all required fields', async () => {
      ;(authService.register as jest.Mock).mockResolvedValue({ id: '1' })
      const user = userEvent.setup()

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A')
      const emailInput = screen.getByPlaceholderText('email@example.com')
      const phoneInput = screen.getByPlaceholderText('0901234567')
      const passwordInputs = screen.getAllByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng ký/i })

      await user.type(fullNameInput, 'Test User')
      await user.type(emailInput, 'test@example.com')
      await user.type(phoneInput, '0901234567')
      await user.type(passwordInputs[0], 'password123')
      await user.type(passwordInputs[1], 'password123')
      await user.click(submitButton)

      expect(authService.register as jest.Mock).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0901234567',
        password: 'password123',
      })
    })

    it('should redirect to login page on successful registration', async () => {
      ;(authService.register as jest.Mock).mockResolvedValue({ id: '1' })
      const user = userEvent.setup()

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A')
      const emailInput = screen.getByPlaceholderText('email@example.com')
      const phoneInput = screen.getByPlaceholderText('0901234567')
      const passwordInputs = screen.getAllByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng ký/i })

      await user.type(fullNameInput, 'Test User')
      await user.type(emailInput, 'test@example.com')
      await user.type(phoneInput, '0901234567')
      await user.type(passwordInputs[0], 'password123')
      await user.type(passwordInputs[1], 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?registered=true')
      })
    })

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup()

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A')
      const emailInput = screen.getByPlaceholderText('email@example.com')
      const phoneInput = screen.getByPlaceholderText('0901234567')
      const passwordInputs = screen.getAllByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng ký/i })

      await user.type(fullNameInput, 'Test User')
      await user.type(emailInput, 'test@example.com')
      await user.type(phoneInput, '0901234567')
      await user.type(passwordInputs[0], 'password123')
      await user.type(passwordInputs[1], 'password456')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Mật khẩu xác nhận không khớp')).toBeInTheDocument()
      })
      expect(authService.register as jest.Mock).not.toHaveBeenCalled()
    })

    it('should show error when password is too short', async () => {
      const user = userEvent.setup()

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A')
      const emailInput = screen.getByPlaceholderText('email@example.com')
      const phoneInput = screen.getByPlaceholderText('0901234567')
      const passwordInputs = screen.getAllByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng ký/i })

      await user.type(fullNameInput, 'Test User')
      await user.type(emailInput, 'test@example.com')
      await user.type(phoneInput, '0901234567')
      await user.type(passwordInputs[0], '12345')
      await user.type(passwordInputs[1], '12345')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Mật khẩu phải có ít nhất 6 ký tự')).toBeInTheDocument()
      })
      expect(authService.register as jest.Mock).not.toHaveBeenCalled()
    })

    it('should show error message on registration failure', async () => {
      const errorMessage = 'Email already registered'
      ;(authService.register as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      })
      const user = userEvent.setup()

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A')
      const emailInput = screen.getByPlaceholderText('email@example.com')
      const phoneInput = screen.getByPlaceholderText('0901234567')
      const passwordInputs = screen.getAllByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng ký/i })

      await user.type(fullNameInput, 'Test User')
      await user.type(emailInput, 'existing@example.com')
      await user.type(phoneInput, '0901234567')
      await user.type(passwordInputs[0], 'password123')
      await user.type(passwordInputs[1], 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should show generic error message when no response message', async () => {
      ;(authService.register as jest.Mock).mockRejectedValue({})
      const user = userEvent.setup()

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A')
      const emailInput = screen.getByPlaceholderText('email@example.com')
      const phoneInput = screen.getByPlaceholderText('0901234567')
      const passwordInputs = screen.getAllByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng ký/i })

      await user.type(fullNameInput, 'Test User')
      await user.type(emailInput, 'test@example.com')
      await user.type(phoneInput, '0901234567')
      await user.type(passwordInputs[0], 'password123')
      await user.type(passwordInputs[1], 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Registration failed')).toBeInTheDocument()
      })
    })
  })

  describe('Form Validation', () => {
    it('should require all fields', () => {
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A') as HTMLInputElement
      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement
      const passwordInputs = screen.getAllByPlaceholderText('••••••••') as HTMLInputElement[]

      expect(fullNameInput.required).toBe(true)
      expect(emailInput.required).toBe(true)
      expect(passwordInputs[0].required).toBe(true)
      expect(passwordInputs[1].required).toBe(true)
    })

    it('should have minLength of 6 for password field', () => {
      render(<RegisterForm />)
      const passwordInputs = screen.getAllByPlaceholderText('••••••••') as HTMLInputElement[]
      expect(passwordInputs[0].minLength).toBe(6)
    })

    it('should have email input type', () => {
      render(<RegisterForm />)
      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement
      expect(emailInput.type).toBe('email')
    })

    it('should have password input type', () => {
      render(<RegisterForm />)
      const passwordInputs = screen.getAllByPlaceholderText('••••••••') as HTMLInputElement[]
      passwordInputs.forEach((input) => {
        expect(input.type).toBe('password')
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading state when registering', async () => {
      ;(authService.register as jest.Mock).mockImplementation(() => new Promise(() => {}))
      const user = userEvent.setup()

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText('Nguyễn Văn A')
      const emailInput = screen.getByPlaceholderText('email@example.com')
      const phoneInput = screen.getByPlaceholderText('0901234567')
      const passwordInputs = screen.getAllByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /đăng ký/i })

      await user.type(fullNameInput, 'Test User')
      await user.type(emailInput, 'test@example.com')
      await user.type(phoneInput, '0901234567')
      await user.type(passwordInputs[0], 'password123')
      await user.type(passwordInputs[1], 'password123')
      await user.click(submitButton)

      expect(submitButton).toBeDisabled()
    })
  })
})
