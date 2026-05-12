'use client';

import { useActionState } from 'react';
import Link from 'next/link';

import { INITIAL_AUTH_ACTION_STATE } from '@/app/shared/lib/auth';
import { registerAction } from '@/app/actions/auth';
import { Text, Button } from '@/app/ds';
import { translateI18nMessage, useAppTranslation } from '@/app/i18n';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL_AUTH_ACTION_STATE);
  const { t } = useAppTranslation();

  if (state.status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('auth.register.successTitle')}</h2>
          <p className="text-gray-500 text-sm mb-6">{translateI18nMessage(t, state.message)}</p>
          <Link
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors"
          >
            {t('auth.register.successAction')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <Text as="h1" size="2xl" color="text-gray-900" weight="bold" className="mb-2">{t('auth.register.title')}</Text>
        <Text size="sm" color="text-gray-500" className="mb-6">{t('auth.register.subtitle')}</Text>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.fullName')}
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.fullNamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.username')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.usernamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.gender')}
            </label>
            <select
              id="gender"
              name="gender"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">{t('auth.register.genderPlaceholder')}</option>
              <option value="MALE">{t('auth.register.genderMale')}</option>
              <option value="FEMALE">{t('auth.register.genderFemale')}</option>
              <option value="OTHER">{t('auth.register.genderOther')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.birthDate')}
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.password')}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.register.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('auth.register.confirmPassword')}
            />
          </div>

          {state.status === 'error' && (
            <Text size="sm" color="text-red-600" className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {translateI18nMessage(t, state.message)}
            </Text>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4"
          >
            {isPending ? t('auth.register.submitting') : t('auth.register.submit')}
          </Button>
        </form>

        <Text size="sm" color="text-gray-500" className="mt-6 text-center">
          {t('auth.register.haveAccount')}{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            {t('auth.register.signIn')}
          </Link>
        </Text>
      </div>
    </div>
  );
}
