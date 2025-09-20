'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  Field,
  Input,
  SubmitButton,
} from '@/components/auth/OnboardingUI';
import Logo from '@/components/logo/Logo';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { FirebaseError } from '@firebase/app';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { saveTokenCookie } from '@/lib/saveTokenCookie';

export function SignIn() {
  const { signIn } = useFirebaseAuth();

  const t = useTranslations('SignIn');
  const tAuth = useTranslations('auth');

  const router = useRouter();

  const signInSchema = z.object({
    email: z.email(t('validation.email')),
    password: z.string().min(1, t('validation.passwordRequired')),
  });

  type SignInValues = z.infer<typeof signInSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    setError,
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (values: SignInValues) => {
    try {
      await signIn(values.email, values.password);

      await saveTokenCookie();
      router.replace('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError('root', {
          message: tAuth(e.code.replace('auth/', '')),
        });
      } else {
        setError('root', { message: t('unknownError') });
      }
    }
  };

  return (
    <section className="py-20 lg:py-[120px]">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <Card>
              <Logo />
              <form
                className="flex w-full flex-col gap-2 text-left"
                onSubmit={handleSubmit(onSubmit)}
                method="post"
                noValidate
              >
                <Field error={errors.email?.message}>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    autoComplete="email"
                    aria-invalid={!!errors.email || undefined}
                  />
                </Field>
                <Field error={errors.password?.message}>
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password || undefined}
                  />
                </Field>

                <SubmitButton loading={isSubmitting}>
                  {t('submit')}
                </SubmitButton>
                <div className="min-h-[1.25rem]">
                  <p
                    className={
                      errors.root?.message
                        ? 'text-sm text-error'
                        : 'text-sm opacity-0'
                    }
                    aria-live="polite"
                  >
                    {errors.root?.message || ''}
                  </p>
                </div>
              </form>

              <p className="flex flex-row gap-1 text-base text-text-color">
                <span>{t('noAccount')}</span>
                <Link href="/sign-up" className="text-primary hover:underline">
                  {t('signUp')}
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
