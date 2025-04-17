import type { APIRoute } from 'astro';
import { PrismaClient } from '../../../generated/prisma'; // Adjust path as needed
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'; // Uncomment if using JWT

const prisma = new PrismaClient();
// const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key'; // Replace with a strong secret, ideally from env variables

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ message: '请求格式不支持' }), { status: 415 });
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    // Basic validation
    if (!username || !password) {
      return new Response(JSON.stringify({ message: '用户名和密码不能为空' }), { status: 400 });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: '用户名或密码错误' }), { status: 401 });
    }

    // Compare provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: '用户名或密码错误' }), { status: 401 });
    }

    // --- Optional: JWT Token Generation ---
    // const token = jwt.sign(
    //   { userId: user.id, username: user.username },
    //   JWT_SECRET,
    //   { expiresIn: '1h' } // Token expires in 1 hour
    // );
    // console.log('Login successful for user:', user.username);
    // return new Response(JSON.stringify({ message: '登录成功', token }), { status: 200 });
    // --- End Optional JWT ---

    // --- Simple Success Response (without JWT) ---
    console.log('Login successful for user:', user.username);
    // In a real app, you'd likely set a session cookie or return a token here.
    // For simplicity, just returning a success message.
    return new Response(JSON.stringify({ message: '登录成功', user: { id: user.id, username: user.username, email: user.email } }), { status: 200 });
    // --- End Simple Success ---

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: '服务器内部错误' }), { status: 500 });
  } finally {
    // Disconnect Prisma client if necessary
    // await prisma.$disconnect();
  }
};