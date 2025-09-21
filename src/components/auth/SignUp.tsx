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
import { useTranslations } from 'next-intl';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { FirebaseError } from '@firebase/app';
import { Link, useRouter } from '@/i18n/navigation';
import { saveTokenCookie } from '@/lib/saveTokenCookie';

export function SignUp() {
  const { signUp } = useFirebaseAuth();

  const t = useTranslations('SignUp');
  const tAuth = useTranslations('auth');

  const router = useRouter();

  const passwordSchema = z
    .string()
    .min(8, t('validation.password.min'))
    .refine((v) => /\p{L}/u.test(v), {
      message: t('validation.password.letter'),
    })
    .refine((v) => /\p{Lu}/u.test(v), {
      message: t('validation.password.uppercase'),
    })
    .refine((v) => /\p{Nd}/u.test(v), {
      message: t('validation.password.digit'),
    })
    .refine((v) => /[^\p{L}\p{Nd}\s]/u.test(v), {
      message: t('validation.password.special'),
    });

  const signUpSchema = z
    .object({
      email: z.email(t('validation.email')),
      password: passwordSchema,
      confirmPassword: z.string().min(8, t('validation.confirmPassword.min')),
    })
    .refine((vals) => vals.password === vals.confirmPassword, {
      message: t('validation.confirmPassword.mismatch'),
      path: ['confirmPassword'],
    });

  type SignUpValues = z.infer<typeof signUpSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    setError,
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (values: SignUpValues) => {
    try {
      await signUp(values.email, values.password);
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
                  />
                </Field>

                <div className="flex flex-col sm:flex-row sm:gap-2">
                  <Field error={errors.password?.message}>
                    <Input
                      {...register('password')}
                      type="password"
                      placeholder={t('passwordPlaceholder')}
                      autoComplete="new-password"
                    />
                  </Field>
                  <Field error={errors.confirmPassword?.message}>
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder={t('confirmPasswordPlaceholder')}
                      autoComplete="new-password"
                    />
                  </Field>
                </div>
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
                <span>{t('alreadyHaveAccount')}</span>
                <Link href="/sign-in" className="text-primary hover:underline">
                  {t('signIn')}
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
