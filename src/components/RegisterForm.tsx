import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Keep Label for now, might switch to FormLabel
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Import Form components

// Define Zod schema for validation
const formSchema = z.object({
  username: z.string().min(1, { message: '用户名不能为空' }),
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z.string().min(6, { message: '密码至少需要6位' }),
  confirmPassword: z.string().min(6, { message: '确认密码至少需要6位' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"], // path of error
});

type RegisterFormValues = z.infer<typeof formSchema>;

const RegisterForm: React.FC = () => {
  // Remove useState for form fields
  // const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Keep for API errors
  const [loading, setLoading] = useState(false);

  // Initialize react-hook-form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Update handleSubmit to use react-hook-form's handler
  const onSubmit = async (values: RegisterFormValues) => {
    // e.preventDefault(); // Not needed with react-hook-form's handleSubmit
    setError(null);
    setLoading(true);

    // Password match validation is handled by Zod schema refinement
    // if (password !== confirmPassword) {
    //   setError('密码不匹配');
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send validated values from react-hook-form
        body: JSON.stringify({ username: values.username, email: values.email, password: values.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '注册失败，请稍后重试');
      }

      // Handle successful registration
      console.log('Registration successful:', result);
      alert('注册成功！'); // Simple alert for now
      form.reset(); // Reset form using react-hook-form's reset method
      // Clear form fields after successful registration
      // setUsername('');
      // setEmail('');
      // setPassword('');
      // setConfirmPassword('');
      // window.location.href = '/login'; // Example redirect to login

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || '发生未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">创建账户</CardTitle>
        <CardDescription>请输入您的信息以创建新账户。</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Wrap form with Form component from Shadcn UI */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Use FormField for each input */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="请输入邮箱地址" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="请输入密码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="请再次输入密码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Display general API errors */}
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-center">
        已经有账户了？ <a href="/login" className="underline">登录</a>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;