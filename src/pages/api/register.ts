import type { APIRoute } from 'astro';
import { PrismaClient } from '../../../generated/prisma'; // Adjust path as needed
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10; // Cost factor for bcrypt hashing

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ message: '请求格式不支持' }), { status: 415 });
  }

  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Basic validation
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ message: '缺少必要的注册信息' }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username },
        ],
      },
    });

    if (existingUser) {
      const message = existingUser.email === email ? '邮箱已被注册' : '用户名已被使用';
      return new Response(JSON.stringify({ message }), { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log('User registered successfully:', { id: newUser.id, username: newUser.username, email: newUser.email });

    // Return success response (don't send back the password hash)
    return new Response(JSON.stringify({ message: '注册成功' }), { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    // Differentiate between known errors (like validation) and unexpected errors
    if (error instanceof Error && error.message.includes('validation')) { // Example check
        return new Response(JSON.stringify({ message: '输入数据无效' }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: '服务器内部错误' }), { status: 500 });
  } finally {
    // Disconnect Prisma client if necessary, depending on deployment strategy
    // await prisma.$disconnect();
  }
};