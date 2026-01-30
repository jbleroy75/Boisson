'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { showToast } from '@/components/ui/Toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Une majuscule requise')
      .regex(/[a-z]/, 'Une minuscule requise')
      .regex(/[0-9]/, 'Un chiffre requis'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

const notificationsSchema = z.object({
  emailOrders: z.boolean(),
  emailPromos: z.boolean(),
  emailNewsletter: z.boolean(),
  emailLoyalty: z.boolean(),
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;
type NotificationsData = z.infer<typeof notificationsSchema>;

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'security'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  // Notifications form
  const notificationsForm = useForm<NotificationsData>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailOrders: true,
      emailPromos: true,
      emailNewsletter: true,
      emailLoyalty: true,
    },
  });

  const onProfileSubmit = async (data: ProfileData) => {
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      showToast.success('Profil mis à jour !');
    } catch {
      showToast.error('Une erreur est survenue');
    }
  };

  const onPasswordSubmit = async (data: PasswordData) => {
    try {
      const response = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur');
      }

      showToast.success('Mot de passe modifié !');
      passwordForm.reset();
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Erreur');
    }
  };

  const onNotificationsSubmit = async (data: NotificationsData) => {
    try {
      const response = await fetch('/api/account/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur');

      showToast.success('Préférences mises à jour !');
    } catch {
      showToast.error('Une erreur est survenue');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'password', label: 'Mot de passe', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ] as const;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back link */}
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au compte
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Paramètres du compte
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Tabs sidebar */}
            <nav className="md:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Informations personnelles
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom complet
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          {...profileForm.register('name')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      {profileForm.formState.errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          {...profileForm.register('email')}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      {profileForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Téléphone (optionnel)
                      </label>
                      <input
                        type="tel"
                        {...profileForm.register('phone')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={profileForm.formState.isSubmitting}
                      className="btn-primary py-3 px-6 flex items-center gap-2"
                    >
                      {profileForm.formState.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                      Enregistrer
                    </button>
                  </form>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Changer le mot de passe
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...passwordForm.register('currentPassword')}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          {...passwordForm.register('newPassword')}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="mt-1 text-sm text-red-500">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        {...passwordForm.register('confirmPassword')}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={passwordForm.formState.isSubmitting}
                      className="btn-primary py-3 px-6 flex items-center gap-2"
                    >
                      {passwordForm.formState.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Lock className="h-5 w-5" />
                      )}
                      Modifier le mot de passe
                    </button>
                  </form>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Préférences de notification
                    </h2>

                    <div className="space-y-4">
                      {[
                        { id: 'emailOrders', label: 'Commandes et livraisons', desc: 'Confirmations, suivi, livraison' },
                        { id: 'emailPromos', label: 'Promotions et offres', desc: 'Réductions, ventes flash, codes promo' },
                        { id: 'emailNewsletter', label: 'Newsletter', desc: 'Actualités, conseils nutrition, recettes' },
                        { id: 'emailLoyalty', label: 'Programme fidélité', desc: 'Points gagnés, récompenses disponibles' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <input
                            type="checkbox"
                            {...notificationsForm.register(item.id as keyof NotificationsData)}
                            className="w-5 h-5 mt-0.5 text-orange-500 rounded focus:ring-orange-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={notificationsForm.formState.isSubmitting}
                      className="btn-primary py-3 px-6 flex items-center gap-2"
                    >
                      {notificationsForm.formState.isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                      Enregistrer
                    </button>
                  </form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Sécurité du compte
                    </h2>

                    {/* 2FA Section */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Authentification à deux facteurs
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Ajoutez une couche de sécurité supplémentaire avec un code TOTP.
                          </p>
                        </div>
                        <Link
                          href="/account/security/2fa"
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Configurer
                        </Link>
                      </div>
                    </div>

                    {/* Sessions Section */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Sessions actives
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Gérez vos sessions connectées sur différents appareils.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Cet appareil
                            </p>
                            <p className="text-xs text-gray-500">Connecté maintenant</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Actif
                          </span>
                        </div>
                      </div>
                      <button className="mt-4 text-red-500 hover:text-red-600 text-sm font-medium">
                        Déconnecter toutes les autres sessions
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <h3 className="font-medium text-red-800 dark:text-red-400">
                        Supprimer le compte
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-4">
                        Cette action est irréversible. Toutes vos données seront supprimées.
                      </p>
                      <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
