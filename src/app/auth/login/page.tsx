'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    // TODO: Implement login logic
    console.log(data);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        
        <div className="space-y-4 mb-8">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <FaApple className="w-5 h-5" />
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="text-purple-600 hover:text-purple-500">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-full py-3 font-medium hover:bg-gray-800 transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-purple-600 hover:text-purple-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
