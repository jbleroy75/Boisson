'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { showToast } from '@/components/ui/Toast';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        setIsTokenValid(response.ok);
      } catch {
        setIsTokenValid(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la réinitialisation');
      }

      setIsSuccess(true);
      showToast.success('Mot de passe modifié avec succès !');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  // Loading state while verifying token
  if (isTokenValid === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Invalid or expired token
  if (!isTokenValid) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Lien invalide ou expiré
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Ce lien de réinitialisation n'est plus valide. Les liens expirent après 1 heure.
        </p>
        <Link href="/forgot-password" className="btn-primary inline-block">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Mot de passe modifié !
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Votre mot de passe a été réinitialisé avec succès.
          Vous allez être redirigé vers la page de connexion...
        </p>
        <Link href="/login" className="btn-primary inline-block">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* New Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Nouveau mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}

        {/* Password strength indicators */}
        <div className="mt-3 space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Le mot de passe doit contenir :
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-1 ${hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
              <CheckCircle className="h-3 w-3" />
              8 caractères minimum
            </div>
            <div className={`flex items-center gap-1 ${hasUppercase ? 'text-green-600' : 'text-gray-400'}`}>
              <CheckCircle className="h-3 w-3" />
              Une majuscule
            </div>
            <div className={`flex items-center gap-1 ${hasLowercase ? 'text-green-600' : 'text-gray-400'}`}>
              <CheckCircle className="h-3 w-3" />
              Une minuscule
            </div>
            <div className={`flex items-center gap-1 ${hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
              <CheckCircle className="h-3 w-3" />
              Un chiffre
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Modification...
          </>
        ) : (
          'Réinitialiser le mot de passe'
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-orange-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Nouveau mot de passe
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Choisissez un nouveau mot de passe sécurisé
              </p>
            </div>

            <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
