import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    try {
      const body = await request.json();
      const { username, email, password } = body;

      // Basic validation (add more robust validation as needed)
      if (!username || !email || !password) {
        return new Response(JSON.stringify({ message: '缺少必要的注册信息' }), { status: 400 });
      }

      // TODO: Implement actual user registration logic here
      // - Hash the password
      // - Check if username or email already exists in the database
      // - Save the new user to the database
      console.log('Received registration data:', { username, email, password: '***' });

      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For now, assume registration is successful
      return new Response(JSON.stringify({ message: '注册成功' }), { status: 201 });

    } catch (error) {
      console.error('Registration error:', error);
      return new Response(JSON.stringify({ message: '服务器内部错误' }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ message: '请求格式不支持' }), { status: 415 });
  }
};