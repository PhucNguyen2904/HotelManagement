import axios from 'axios'

jest.mock('axios')

export const mockAxios = axios as jest.Mocked<typeof axios>

export const setupAxiosMock = (method: 'get' | 'post' | 'patch' | 'delete', response: any) => {
  mockAxios[method].mockResolvedValue({ data: response })
}

export const setupAxiosError = (method: 'get' | 'post' | 'patch' | 'delete', error: any) => {
  mockAxios[method].mockRejectedValue(error)
}
