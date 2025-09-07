'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  Field,
  Input,
  Logo,
  SubmitButton,
} from '@/components/auth/OnboardingUI';
import { useTranslations } from 'next-intl';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { FirebaseError } from '@firebase/app';

export function SignUp() {
  const { signUp } = useFirebaseAuth();

  const t = useTranslations('SignUp');
  const tAuth = useTranslations('auth');

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
                className="flex w-full flex-col gap-4 text-left"
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

                <div className="grid grid-cols-1 gap-5 sm:gap-2 sm:grid-cols-2">
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

                {errors.root?.message ? (
                  <p className="text-error">{errors.root.message}</p>
                ) : null}
                <SubmitButton loading={isSubmitting}>
                  {t('submit')}
                </SubmitButton>
              </form>

              <p className="flex flex-row gap-1 text-base text-text-color">
                <span>{t('alreadyHaveAccount')}</span>
                <a href="/sign-in" className="text-primary hover:underline">
                  {t('signIn')}
                </a>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
