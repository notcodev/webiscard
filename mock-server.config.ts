import { MockServerConfig } from 'mock-config-server'

const user = {
  username: 'slmv_e',
  email: 'slmv_e@icloud.com',
}

const mockServerConfig: MockServerConfig = {
  interceptors: {
    response: (data, { appendHeader }) => {
      appendHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
      return data
    },
  },
  rest: {
    baseUrl: '/api',
    interceptors: {
      async response(data, { setDelay }) {
        await setDelay(600)
        return data
      },
    },
    configs: [
      {
        path: '/signin',
        method: 'post',
        routes: [
          {
            data: { error: 'invalid_request' },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(400)
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: 'slmv_e@icloud.com',
                password: 'Password123',
                rememberMe: false,
              },
            },
            data: user,
            interceptors: {
              response: (data, { appendHeader }) => {
                appendHeader(
                  'Set-Cookie',
                  'session=auth-user-token; Path=/; HttpOnly',
                )
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: 'slmv_e@icloud.com',
                password: 'Password123',
                rememberMe: true,
              },
            },
            data: user,
            interceptors: {
              response: (data, { appendHeader }) => {
                appendHeader(
                  'Set-Cookie',
                  'session=auth-user-token; Max-Age=2592000; Path=/; HttpOnly',
                )
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: 'slmv_e@icloud.com',
                password: {
                  checkMode: 'exists',
                },
                rememberMe: {
                  checkMode: 'exists',
                },
              },
            },
            data: {
              error: 'invalid_credentials',
            },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(403)
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: {
                  checkMode: 'exists',
                },
                password: {
                  checkMode: 'exists',
                },
                rememberMe: {
                  checkMode: 'exists',
                },
              },
            },
            data: { error: 'invalid_credentials' },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(404)
                return data
              },
            },
          },
        ],
      },
      {
        path: '/signup',
        method: 'post',
        routes: [
          {
            data: { error: 'invalid_request' },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(400)
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: 'slmv_e@icloud.com',
                password: {
                  checkMode: 'exists',
                },
                username: {
                  checkMode: 'exists',
                },
              },
            },
            data: {
              error: 'email_exist',
            },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(409)
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: {
                  checkMode: 'exists',
                },
                password: {
                  checkMode: 'exists',
                },
                username: 'slmv_e',
              },
            },
            data: {
              error: 'username_exist',
            },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(409)
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: {
                  checkMode: 'exists',
                },
                password: {
                  checkMode: 'exists',
                },
                username: {
                  checkMode: 'exists',
                },
              },
            },
            data: { success: 'true' },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(201)
                return data
              },
            },
          },
        ],
      },
      {
        path: '/session',
        method: 'get',
        routes: [
          {
            entities: {
              cookies: {
                session: 'auth-user-token',
              },
            },
            data: user,
          },
          {
            data: { error: 'unauthorized' },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(401)
                return data
              },
            },
          },
        ],
      },
      {
        path: '/reset-password/validate',
        method: 'get',
        routes: [
          {
            entities: {
              query: {
                key: '1234',
              },
            },
            data: { is_valid: true },
            interceptors: {
              response: (data, { appendHeader }) => {
                appendHeader(
                  'Set-Cookie',
                  'verification-token=token; Path=/; HttpOnly',
                )
                return data
              },
            },
          },
          {
            data: { error: 'key_invalid' },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(403)
                return data
              },
            },
          },
        ],
      },
      {
        path: '/reset-password/send',
        method: 'post',
        routes: [
          {
            data: { error: 'invalid_request' },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(400)
                return data
              },
            },
          },
          {
            entities: {
              body: {
                email: 'slmv_e@icloud.com',
              },
            },
            data: { success: true },
          },
          {
            entities: {
              body: {
                email: {
                  checkMode: 'exists',
                },
              },
            },
            data: {
              error: 'invalid_request',
            },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(404)
                return data
              },
            },
          },
        ],
      },
      {
        path: '/card',
        method: 'get',
        routes: [
          {
            data: {
              username: 'slmv_e',
              name: 'Erik',
              description: 'Some description',
              profilePicture: {
                filename: null,
                size: 'md',
              },
              buttons: [],
              background: {
                type: 'gradient',
                value: 'linear-gradient(90deg,#FAD961 0%,#F76B1C 100%)',
              },
            },
          },
        ],
      },
      {
        path: '/upload-image',
        method: 'post',
        routes: [
          {
            data: {
              filename: '1.jpeg',
            },
          },
        ],
      },
    ],
  },
}

export default mockServerConfig
