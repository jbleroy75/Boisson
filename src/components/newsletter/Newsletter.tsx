'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

const newsletterSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterProps {
  variant?: 'inline' | 'card' | 'footer';
  title?: string;
  description?: string;
  className?: string;
}

export function Newsletter({
  variant = 'inline',
  title = 'Restez informé',
  description = 'Recevez nos offres exclusives et conseils nutrition directement dans votre boîte mail.',
  className = '',
}: NewsletterProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      setIsSubmitted(true);
      reset();
      showToast.success('Inscription réussie !');
    } catch {
      showToast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  if (isSubmitted) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg ${className}`}>
        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
        <div>
          <p className="font-semibold text-green-800 dark:text-green-300">Merci pour votre inscription !</p>
          <p className="text-sm text-green-700 dark:text-green-400">
            Vous recevrez bientôt nos dernières actualités.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <input
            type="email"
            placeholder="votre@email.com"
            {...register('email')}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Adresse email"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'OK'}
          </button>
        </form>
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white ${className}`}>
        <div className="max-w-xl mx-auto text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="mb-6 opacity-90">{description}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              {...register('email')}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Adresse email"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>S'inscrire</span>
                  <Mail className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
          {errors.email && (
            <p className="mt-2 text-sm text-white/90">{errors.email.message}</p>
          )}
          <p className="mt-4 text-xs opacity-75">
            En vous inscrivant, vous acceptez de recevoir nos emails. Désabonnement possible à tout moment.
          </p>
        </div>
      </div>
    );
  }

  // Default: inline variant
  return (
    <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center ${className}`}>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 w-full sm:w-auto">
        <input
          type="email"
          placeholder="votre@email.com"
          {...register('email')}
          className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
          aria-label="Adresse email"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "S'inscrire"}
        </button>
      </form>
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}
    </div>
  );
}

export default Newsletter;
