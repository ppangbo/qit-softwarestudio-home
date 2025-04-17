import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('密码不匹配');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '注册失败，请稍后重试');
      }

      // Handle successful registration
      console.log('Registration successful:', result);
      // Optionally show success message or redirect
      alert('注册成功！'); // Simple alert for now
      // Clear form or redirect
      // window.location.href = '/login'; // Example redirect to login

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || '发生未知错误');
    } finally {
      setLoading(false);
    }

    // Reset form fields only on successful submission or keep them for correction?
    // Let's clear them for now after attempt
    // setUsername('');
    // setEmail('');
    // setPassword('');
    // setConfirmPassword('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLoading(false);
    // Optionally redirect user or show success message
    // Clear form fields after successful registration
    if (!error) { // Clear only if no error occurred during the process
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">创建账户</CardTitle>
        <CardDescription>请输入您的信息以创建新账户。</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">确认密码</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-center">
        已经有账户了？ <a href="/login" className="underline">登录</a>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;