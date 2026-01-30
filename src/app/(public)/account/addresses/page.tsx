'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Building2,
  ArrowLeft,
  Loader2,
  CheckCircle,
  X,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { showToast } from '@/components/ui/Toast';

const addressSchema = z.object({
  label: z.string().min(1, 'Nom requis'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  street: z.string().min(5, 'Adresse requise'),
  streetLine2: z.string().optional(),
  postalCode: z.string().regex(/^\d{5}$/, 'Code postal invalide'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().min(1, 'Pays requis'),
  phone: z.string().optional(),
  isDefault: z.boolean(),
  type: z.enum(['shipping', 'billing', 'both']),
});

type AddressData = z.infer<typeof addressSchema>;
type AddressWithId = AddressData & { id: string };

// Mock addresses data
const MOCK_ADDRESSES: AddressWithId[] = [
  {
    id: '1',
    label: 'Domicile',
    firstName: 'Jean',
    lastName: 'Dupont',
    street: '15 Rue de la Performance',
    streetLine2: undefined,
    postalCode: '75008',
    city: 'Paris',
    country: 'France',
    phone: '+33 6 12 34 56 78',
    isDefault: true,
    type: 'both' as const,
  },
  {
    id: '2',
    label: 'Bureau',
    firstName: 'Jean',
    lastName: 'Dupont',
    street: '42 Avenue des Champions',
    streetLine2: 'Bâtiment B, 3ème étage',
    postalCode: '92100',
    city: 'Boulogne-Billancourt',
    country: 'France',
    phone: undefined,
    isDefault: false,
    type: 'shipping' as const,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressWithId[]>(MOCK_ADDRESSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressWithId | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'France',
      type: 'both',
      isDefault: false,
    },
  });

  const openAddModal = () => {
    setEditingAddress(null);
    reset({
      label: '',
      firstName: '',
      lastName: '',
      street: '',
      streetLine2: '',
      postalCode: '',
      city: '',
      country: 'France',
      phone: '',
      isDefault: false,
      type: 'both',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (address: AddressWithId) => {
    setEditingAddress(address);
    reset(address);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: AddressData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingAddress) {
        // Update existing
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id ? { ...addr, ...data } : addr
          )
        );
        showToast.success('Adresse mise à jour !');
      } else {
        // Add new
        const newAddress: AddressWithId = {
          id: Date.now().toString(),
          ...data,
        };
        setAddresses((prev) => [...prev, newAddress]);
        showToast.success('Adresse ajoutée !');
      }

      setIsModalOpen(false);
    } catch {
      showToast.error('Une erreur est survenue');
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('Supprimer cette adresse ?')) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      showToast.success('Adresse supprimée');
    } catch {
      showToast.error('Erreur lors de la suppression');
    }
  };

  const setAsDefault = async (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showToast.success('Adresse par défaut mise à jour');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shipping':
        return <MapPin className="h-4 w-4" />;
      case 'billing':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'shipping':
        return 'Livraison';
      case 'billing':
        return 'Facturation';
      default:
        return 'Livraison & Facturation';
    }
  };

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

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mes adresses
            </h1>
            <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ajouter
            </button>
          </div>

          {/* Addresses list */}
          {addresses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <MapPin className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucune adresse enregistrée
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ajoutez une adresse pour accélérer vos commandes.
              </p>
              <button onClick={openAddModal} className="btn-primary">
                Ajouter une adresse
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 ${
                    address.isDefault
                      ? 'border-orange-500'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {address.label}
                      </span>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
                          Par défaut
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(address)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                        aria-label="Modifier"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteAddress(address.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {address.firstName} {address.lastName}
                    </p>
                    <p>{address.street}</p>
                    {address.streetLine2 && <p>{address.streetLine2}</p>}
                    <p>
                      {address.postalCode} {address.city}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p>{address.phone}</p>}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      {getTypeIcon(address.type)}
                      {getTypeLabel(address.type)}
                    </span>
                    {!address.isDefault && (
                      <button
                        onClick={() => setAsDefault(address.id)}
                        className="text-sm text-orange-500 hover:text-orange-600"
                      >
                        Définir par défaut
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de l'adresse
                </label>
                <input
                  {...register('label')}
                  placeholder="ex: Domicile, Bureau..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.label && (
                  <p className="mt-1 text-sm text-red-500">{errors.label.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prénom
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adresse
                </label>
                <input
                  {...register('street')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Complément (optionnel)
                </label>
                <input
                  {...register('streetLine2')}
                  placeholder="Bâtiment, étage, interphone..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code postal
                  </label>
                  <input
                    {...register('postalCode')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ville
                  </label>
                  <input
                    {...register('city')}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Téléphone (optionnel)
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type d'adresse
                </label>
                <div className="flex gap-4">
                  {[
                    { value: 'both', label: 'Les deux' },
                    { value: 'shipping', label: 'Livraison' },
                    { value: 'billing', label: 'Facturation' },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value={opt.value}
                        {...register('type')}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isDefault')}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Définir comme adresse par défaut
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  {editingAddress ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
