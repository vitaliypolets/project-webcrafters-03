'use client';

import { useEffect, useState } from 'react';
import { Formik, Form, Field, useFormikContext } from 'formik';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { registerSchema } from '../../register.schema';
import { saveRegisterDraft, getRegisterDraft } from '../../register.service';
import type { RegisterFormValues } from '../../register.types';
import styles from './RegisterForm.module.css';

const emptyValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type StrengthLevel = 'empty' | 'weak' | 'medium' | 'strong';

function getPasswordStrength(password: string): StrengthLevel {
  if (!password) return 'empty';

  const hasLetters = /[A-Za-z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  if (hasLetters && hasDigits && hasSymbols) return 'strong';
  if (hasLetters && hasDigits) return 'medium';

  return 'weak';
}

const STRENGTH_LABEL: Record<StrengthLevel, string> = {
  empty: '',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
};

function fieldStatusClass(
  name: keyof RegisterFormValues,
  touched: ReturnType<typeof useFormikContext<RegisterFormValues>>['touched'],
  errors: ReturnType<typeof useFormikContext<RegisterFormValues>>['errors'],
  values: RegisterFormValues,
): string {
  if (!touched[name]) return '';
  if (errors[name]) return styles.inputError;
  if (values[name]) return styles.inputSuccess;
  return '';
}

function RegisterFormFields() {
  const { values, touched, errors, isSubmitting, isValid, submitCount, setValues } =
    useFormikContext<RegisterFormValues>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isHydrated, setIsHydrated] = useState(false);

  const strength = getPasswordStrength(values.password);
  const isBlocked = submitCount > 0 && !isValid;

  useEffect(() => {
    const draft = getRegisterDraft();
    if (draft) {
      setValues({ ...emptyValues, ...draft }, false);
    }
    setIsHydrated(true);
  }, [setValues]);

  useEffect(() => {
    if (!isHydrated) return;
    saveRegisterDraft(values);
  }, [values, isHydrated]);

  const nameStatusClass = !values.name ? '' : errors.name ? styles.inputError : styles.inputSuccess;

  return (
    <Form className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="name">
          Enter your name
        </label>
        <Field
          className={`${styles.input} ${nameStatusClass}`}
          id="name"
          name="name"
          type="text"
          placeholder="Max"
          autoComplete="name"
        />
        {values.name && errors.name && <p className={styles.error}>{errors.name}</p>}
        {values.name && !errors.name && <p className={styles.success}>Success</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">
          Enter your email address
        </label>
        <Field
          className={`${styles.input} ${fieldStatusClass('email', touched, errors, values)}`}
          id="email"
          name="email"
          type="email"
          placeholder="email@gmail.com"
          autoComplete="email"
        />
        {touched.email && errors.email && <p className={styles.error}>{errors.email}</p>}
        {touched.email && !errors.email && values.email && (
          <p className={styles.success}>Success</p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          Create a strong password
        </label>
        <div className={styles.passwordWrapper}>
          <Field
            className={`${styles.input} ${fieldStatusClass('password', touched, errors, values)}`}
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="*********"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <svg className={styles.passwordIcon} width="24" height="24" aria-hidden="true">
              <use href={`/icons/sprite.svg#${showPassword ? 'icon-eye' : 'icon-eye-crossed'}`} />
            </svg>
          </button>
        </div>

        {values.password && (
          <div className={styles.strength}>
            {(['weak', 'medium', 'strong'] as const).map((level, index) => {
              const isActive =
                (level === 'weak' && strength !== 'empty') ||
                (level === 'medium' && (strength === 'medium' || strength === 'strong')) ||
                (level === 'strong' && strength === 'strong');

              const activeClass = isActive
                ? styles[
                    `strengthBar${strength.charAt(0).toUpperCase()}${strength.slice(1)}` as keyof typeof styles
                  ]
                : '';

              return <span key={index} className={`${styles.strengthBar} ${activeClass}`} />;
            })}
            <span className={styles.strengthLabel}>{STRENGTH_LABEL[strength]}</span>
          </div>
        )}

        {touched.password && errors.password && <p className={styles.error}>{errors.password}</p>}
        {touched.password && !errors.password && values.password && (
          <p className={styles.success}>Success</p>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="confirmPassword">
          Repeat your password
        </label>
        <div className={styles.passwordWrapper}>
          <Field
            className={`${styles.input} ${fieldStatusClass('confirmPassword', touched, errors, values)}`}
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="*********"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <svg className={styles.passwordIcon} width="24" height="24" aria-hidden="true">
              <use
                href={`/icons/sprite.svg#${showConfirmPassword ? 'icon-eye' : 'icon-eye-crossed'}`}
              />
            </svg>
          </button>
        </div>
        {touched.confirmPassword && errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
        {touched.confirmPassword && !errors.confirmPassword && values.confirmPassword && (
          <p className={styles.success}>Success</p>
        )}
      </div>

      <Button
        className={styles.submitButton}
        variant="primary"
        size="md"
        type="submit"
        aria-disabled={isSubmitting || isBlocked}
        disabled={isSubmitting}
      >
        Create account
      </Button>

      <p className={styles.instructions}>
        Already have an account?{' '}
        <a className={styles.link} href="/login">
          Log in
        </a>
      </p>
    </Form>
  );
}

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = (values: RegisterFormValues) => {
    try {
      saveRegisterDraft(values);
      toast.success('Great! Now add a profile photo.');
      router.push('/photo');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Formik initialValues={emptyValues} validationSchema={registerSchema} onSubmit={handleSubmit}>
      <RegisterFormFields />
    </Formik>
  );
}
