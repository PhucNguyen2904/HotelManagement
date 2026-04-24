# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Registration Flow >> Show error when email already exists
- Location: tests\register.spec.ts:101:7

# Error details

```
TypeError: fetch failed
```

# Test source

```ts
  1   | /**
  2   |  * API Utility - Direct API calls for test setup/verification
  3   |  * Bypasses frontend to set up test data or verify state
  4   |  */
  5   | 
  6   | const API_BASE_URL = 'http://localhost:3001/api';
  7   | 
  8   | interface RequestOptions {
  9   |   method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  10  |   body?: unknown;
  11  |   headers?: Record<string, string>;
  12  |   token?: string;
  13  | }
  14  | 
  15  | /**
  16  |  * Make HTTP request to backend
  17  |  */
  18  | export async function apiRequest<T>(
  19  |   path: string,
  20  |   options: RequestOptions = {}
  21  | ): Promise<T> {
  22  |   const {
  23  |     method = 'GET',
  24  |     body,
  25  |     headers = {},
  26  |     token,
  27  |   } = options;
  28  | 
  29  |   const url = `${API_BASE_URL}${path}`;
  30  |   const requestHeaders: Record<string, string> = {
  31  |     'Content-Type': 'application/json',
  32  |     ...headers,
  33  |   };
  34  | 
  35  |   if (token) {
  36  |     requestHeaders['Authorization'] = `Bearer ${token}`;
  37  |   }
  38  | 
> 39  |   const response = await fetch(url, {
      |                    ^ TypeError: fetch failed
  40  |     method,
  41  |     headers: requestHeaders,
  42  |     body: body ? JSON.stringify(body) : undefined,
  43  |   });
  44  | 
  45  |   if (!response.ok) {
  46  |     const error = await response.text();
  47  |     throw new Error(`API Error [${response.status}]: ${error}`);
  48  |   }
  49  | 
  50  |   return response.json() as Promise<T>;
  51  | }
  52  | 
  53  | /**
  54  |  * Register a test user
  55  |  */
  56  | export async function registerUser(data: {
  57  |   email: string;
  58  |   password: string;
  59  |   fullName: string;
  60  |   phone?: string;
  61  | }): Promise<{ id: string; email: string; role: string }> {
  62  |   const response = await apiRequest<{
  63  |     data: { id: string; email: string; role: string };
  64  |   }>('/auth/register', {
  65  |     method: 'POST',
  66  |     body: data,
  67  |   });
  68  |   return response.data;
  69  | }
  70  | 
  71  | /**
  72  |  * Login user and get token
  73  |  */
  74  | export async function loginUser(email: string, password: string): Promise<{
  75  |   accessToken: string;
  76  |   user: { id: string; email: string; fullName: string; role: string };
  77  | }> {
  78  |   const response = await apiRequest<{
  79  |     data: {
  80  |       accessToken: string;
  81  |       user: { id: string; email: string; fullName: string; role: string };
  82  |     };
  83  |   }>('/auth/login', {
  84  |     method: 'POST',
  85  |     body: { email, password },
  86  |   });
  87  |   return response.data;
  88  | }
  89  | 
  90  | /**
  91  |  * Get all hotels
  92  |  */
  93  | export async function getHotels(): Promise<Array<{ id: string; name: string; slug: string }>> {
  94  |   const response = await apiRequest<{
  95  |     data: Array<{ id: string; name: string; slug: string }>;
  96  |   }>('/hotels');
  97  |   return response.data;
  98  | }
  99  | 
  100 | /**
  101 |  * Get room types for hotel
  102 |  */
  103 | export async function getRoomTypes(hotelId: string, params?: {
  104 |   checkIn?: string;
  105 |   checkOut?: string;
  106 |   adults?: number;
  107 | }): Promise<Array<{ id: string; name: string; basePrice: number }>> {
  108 |   let path = `/room-types?hotelId=${hotelId}`;
  109 |   if (params?.checkIn) path += `&checkIn=${params.checkIn}`;
  110 |   if (params?.checkOut) path += `&checkOut=${params.checkOut}`;
  111 |   if (params?.adults) path += `&adults=${params.adults}`;
  112 | 
  113 |   const response = await apiRequest<{
  114 |     data: Array<{ id: string; name: string; basePrice: number }>;
  115 |   }>(path);
  116 |   return response.data;
  117 | }
  118 | 
  119 | /**
  120 |  * Check availability
  121 |  */
  122 | export async function checkAvailability(hotelId: string, checkIn: string, checkOut: string) {
  123 |   const response = await apiRequest<{
  124 |     data: {
  125 |       checkIn: string;
  126 |       checkOut: string;
  127 |       totalNights: number;
  128 |       roomTypes: Array<{ id: string; name: string; availableCount: number }>;
  129 |     };
  130 |   }>(`/availability?hotelId=${hotelId}&checkIn=${checkIn}&checkOut=${checkOut}`);
  131 |   return response.data;
  132 | }
  133 | 
  134 | /**
  135 |  * Create booking
  136 |  */
  137 | export async function createBooking(token: string, data: {
  138 |   hotelId: string;
  139 |   checkIn: string;
```