'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Smartphone, Key, CheckCircle, Copy, Loader2 } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

const verifyCodeSchema = z.object({
  code: z.string().length(6, 'Le code doit contenir 6 chiffres').regex(/^\d+$/, 'Le code doit contenir uniquement des chiffres'),
});

type VerifyCodeData = z.infer<typeof verifyCodeSchema>;

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'intro' | 'qrcode' | 'verify' | 'backup' | 'complete'>(
    'intro'
  );
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyCodeData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const handleStartSetup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/setup', { method: 'POST' });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setQrCodeUrl(data.qrCodeUrl);
      setSecret(data.secret);
      setStep('qrcode');
    } catch (error) {
      showToast.error('Erreur lors de la configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (data: VerifyCodeData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: data.code }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      setBackupCodes(result.backupCodes);
      setStep('backup');
      reset();
    } catch (error) {
      showToast.error('Code invalide. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    showToast.success('Clé copiée !');
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    showToast.success('Codes de secours copiés !');
  };

  const handleComplete = () => {
    setStep('complete');
    onComplete?.();
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      {/* Intro */}
      {step === 'intro' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentification à deux facteurs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Protégez votre compte avec une couche de sécurité supplémentaire.
            Vous aurez besoin d'une application d'authentification comme Google
            Authenticator ou Authy.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleStartSetup}
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Smartphone className="h-5 w-5" />
                  Configurer la 2FA
                </>
              )}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Plus tard
              </button>
            )}
          </div>
        </div>
      )}

      {/* QR Code */}
      {step === 'qrcode' && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Scannez le QR code
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Ouvrez votre application d'authentification et scannez ce QR code.
          </p>

          {/* QR Code placeholder - In production, use a QR code library */}
          <div className="bg-white p-4 rounded-lg mb-6 flex items-center justify-center">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code 2FA" className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                QR Code
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Ou entrez cette clé manuellement :
            </p>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <code className="flex-1 text-sm font-mono break-all">{secret}</code>
              <button
                onClick={copySecret}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                aria-label="Copier la clé"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep('verify')}
            className="w-full btn-primary py-3"
          >
            Continuer
          </button>
        </div>
      )}

      {/* Verify Code */}
      {step === 'verify' && (
        <form onSubmit={handleSubmit(handleVerifyCode)}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Vérification
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Entrez le code à 6 chiffres affiché dans votre application.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code de vérification
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              {...register('code')}
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Key className="h-5 w-5" />
                  Vérifier
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep('qrcode')}
              className="w-full py-3 text-gray-600 dark:text-gray-400"
            >
              Retour
            </button>
          </div>
        </form>
      )}

      {/* Backup Codes */}
      {step === 'backup' && (
        <div>
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Codes de secours
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            Conservez ces codes en lieu sûr. Ils vous permettront d'accéder
            à votre compte si vous perdez votre téléphone.
          </p>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <code
                  key={index}
                  className="text-sm font-mono text-center py-2 bg-white dark:bg-gray-800 rounded"
                >
                  {code}
                </code>
              ))}
            </div>
            <button
              onClick={copyBackupCodes}
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Copy className="h-4 w-4" />
              Copier les codes
            </button>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important :</strong> Chaque code ne peut être utilisé qu'une seule fois.
              Conservez-les en lieu sûr (gestionnaire de mots de passe, coffre-fort...).
            </p>
          </div>

          <button onClick={handleComplete} className="w-full btn-primary py-3">
            J'ai sauvegardé mes codes
          </button>
        </div>
      )}

      {/* Complete */}
      {step === 'complete' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            2FA activée !
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Votre compte est maintenant protégé par l'authentification à deux facteurs.
          </p>
          <button onClick={onComplete} className="w-full btn-primary py-3">
            Terminé
          </button>
        </div>
      )}
    </div>
  );
}

// Verification component for login
interface TwoFactorVerifyProps {
  onVerify: (code: string) => Promise<boolean>;
  onCancel?: () => void;
  onUseBackupCode?: () => void;
}

export function TwoFactorVerify({ onVerify, onCancel, onUseBackupCode }: TwoFactorVerifyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const handleVerify = async (data: VerifyCodeData) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await onVerify(data.code);
      if (!success) {
        setError('Code invalide. Veuillez réessayer.');
      }
    } catch {
      setError('Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Vérification 2FA
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Entrez le code depuis votre application d'authentification.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleVerify)}>
        <div className="mb-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            {...register('code')}
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            autoFocus
          />
          {(errors.code || error) && (
            <p className="mt-1 text-sm text-red-500 text-center">
              {errors.code?.message || error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Vérifier'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        {onUseBackupCode && (
          <button
            onClick={onUseBackupCode}
            className="text-sm text-orange-500 hover:text-orange-600"
          >
            Utiliser un code de secours
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="block w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}

export default TwoFactorSetup;
