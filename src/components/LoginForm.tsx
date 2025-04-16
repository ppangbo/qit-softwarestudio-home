import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assuming Input component exists
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  username: z.string().min(1, { message: '用户名不能为空' }),
  password: z.string().min(6, { message: '密码至少需要6位' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    console.log('Submitting:', values);

    try {
      const response = await fetch('/api/login', { // Target the API route we will create
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '登录失败，请稍后重试');
      }

      // Handle successful login
      console.log('Login successful:', result);
      // Store token/session info (e.g., in localStorage)
      if (result.token) {
        localStorage.setItem('authToken', result.token);
      }
      // Redirect to home page or dashboard
      window.location.href = '/'; // Redirect to homepage

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '发生未知错误');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? '登录中...' : '登录'}
        </Button>
        <div className="text-center mt-4">
          <a href="/register" className="text-sm text-primary hover:underline">
            还没有账户？去注册
          </a>
        </div>
      </form>
    </Form>
  );
}