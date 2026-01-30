'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Building2, User, Mail, Phone, MapPin, FileText, Loader2, CheckCircle } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const b2bRegisterSchema = z.object({
  companyName: z.string().min(2, 'Nom de l\'entreprise requis').max(200),
  siret: z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir 14 chiffres'),
  contactName: z.string().min(2, 'Nom du contact requis').max(100),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone invalide').max(20),
  companyType: z.enum(['retailer', 'gym', 'distributor', 'hotel_restaurant', 'other']),
  estimatedVolume: z.enum(['100-500', '500-1000', '1000-5000', '5000+']),
  billingAddress: z.object({
    street: z.string().min(5, 'Adresse requise').max(200),
    city: z.string().min(2, 'Ville requise').max(100),
    postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
  }),
  deliveryAddress: z.object({
    sameAsBilling: z.boolean(),
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  message: z.string().max(2000).optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions',
  }),
});

type B2BRegisterFormData = z.infer<typeof b2bRegisterSchema>;

const companyTypes = [
  { value: 'retailer', label: 'Commerce de détail' },
  { value: 'gym', label: 'Salle de sport / Fitness' },
  { value: 'distributor', label: 'Distributeur' },
  { value: 'hotel_restaurant', label: 'Hôtellerie / Restauration' },
  { value: 'other', label: 'Autre' },
];

const volumeOptions = [
  { value: '100-500', label: '100 - 500 unités/mois' },
  { value: '500-1000', label: '500 - 1000 unités/mois' },
  { value: '1000-5000', label: '1000 - 5000 unités/mois' },
  { value: '5000+', label: '5000+ unités/mois' },
];

export default function B2BRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<B2BRegisterFormData>({
    resolver: zodResolver(b2bRegisterSchema),
    defaultValues: {
      deliveryAddress: { sameAsBilling: true },
    },
  });

  const sameAsBilling = watch('deliveryAddress.sameAsBilling');

  const onSubmit = async (data: B2BRegisterFormData) => {
    try {
      const response = await fetch('/api/b2b/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }

      setIsSubmitted(true);
      showToast.success('Demande envoyée avec succès !');
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Demande reçue !
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Merci pour votre demande de partenariat. Notre équipe commerciale
                vous contactera sous 48h pour valider votre compte et discuter
                de vos besoins.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
                Un email de confirmation a été envoyé à votre adresse.
              </p>
              <Link
                href="/fournisseurs"
                className="btn-primary inline-block"
              >
                Retour à l'espace fournisseurs
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Devenir partenaire B2B
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Remplissez le formulaire ci-dessous pour créer votre compte professionnel
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                Informations entreprise
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Raison sociale *
                  </label>
                  <input
                    {...register('companyName')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SIRET *
                  </label>
                  <input
                    {...register('siret')}
                    placeholder="12345678901234"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.siret && (
                    <p className="mt-1 text-sm text-red-500">{errors.siret.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type d'activité *
                  </label>
                  <select
                    {...register('companyType')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner...</option>
                    {companyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.companyType && (
                    <p className="mt-1 text-sm text-red-500">{errors.companyType.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Volume estimé *
                  </label>
                  <select
                    {...register('estimatedVolume')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner...</option>
                    {volumeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.estimatedVolume && (
                    <p className="mt-1 text-sm text-red-500">{errors.estimatedVolume.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-orange-500" />
                Contact principal
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom complet *
                  </label>
                  <input
                    {...register('contactName')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-500">{errors.contactName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email professionnel *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Adresse de facturation
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adresse *
                  </label>
                  <input
                    {...register('billingAddress.street')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.billingAddress?.street && (
                    <p className="mt-1 text-sm text-red-500">{errors.billingAddress.street.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code postal *
                  </label>
                  <input
                    {...register('billingAddress.postalCode')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.billingAddress?.postalCode && (
                    <p className="mt-1 text-sm text-red-500">{errors.billingAddress.postalCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ville *
                  </label>
                  <input
                    {...register('billingAddress.city')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.billingAddress?.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.billingAddress.city.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Adresse de livraison
              </h2>
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('deliveryAddress.sameAsBilling')}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Identique à l'adresse de facturation
                </span>
              </label>
              {!sameAsBilling && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adresse
                    </label>
                    <input
                      {...register('deliveryAddress.street')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Code postal
                    </label>
                    <input
                      {...register('deliveryAddress.postalCode')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ville
                    </label>
                    <input
                      {...register('deliveryAddress.city')}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Message (optionnel)
              </h2>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="Parlez-nous de votre activité et vos besoins..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Terms & Submit */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="w-5 h-5 mt-0.5 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  J'accepte les{' '}
                  <Link href="/cgv" className="text-orange-500 hover:underline">
                    conditions générales de vente B2B
                  </Link>{' '}
                  et la{' '}
                  <Link href="/privacy" className="text-orange-500 hover:underline">
                    politique de confidentialité
                  </Link>
                  . *
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mb-4 text-sm text-red-500">{errors.acceptTerms.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Soumettre ma demande'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
