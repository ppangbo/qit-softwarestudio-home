import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Basic validation (replace with more robust validation and actual user lookup)
    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: '用户名和密码不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simulate user authentication (replace with database check and password hashing)
    if (username === 'admin' && password === 'password123') {
      // Simulate successful login: generate a mock token
      const mockToken = `fake-jwt-token-${Date.now()}`;
      return new Response(
        JSON.stringify({ message: '登录成功', token: mockToken }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Simulate failed login
      return new Response(
        JSON.stringify({ message: '用户名或密码错误' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('API Login Error:', error);
    return new Response(
      JSON.stringify({ message: '服务器内部错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};