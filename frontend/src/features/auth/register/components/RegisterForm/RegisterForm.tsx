"use client";

import { useState } from "react";
import { Formik, Form, Field, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { registerSchema } from "../../register.schema";
import { saveRegisterDraft } from "../../register.service";
import type { RegisterFormValues } from "../../register.types";
import styles from "./RegisterForm.module.css";

const emptyValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function fieldStatusClass(
  name: keyof RegisterFormValues,
  hasAttemptedSubmit: boolean,
  errors: ReturnType<typeof useFormikContext<RegisterFormValues>>["errors"],
): string {
  if (!hasAttemptedSubmit) return "";
  return errors[name] ? styles.inputError : "";
}

function RegisterFormFields() {
  const { errors, isSubmitting, isValid, submitCount } = useFormikContext<RegisterFormValues>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasAttemptedSubmit = submitCount > 0;
  const isBlocked = hasAttemptedSubmit && !isValid;

  return (
    <Form className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="name">
          Enter your name
        </label>
        <Field
          className={`${styles.input} ${fieldStatusClass("name", hasAttemptedSubmit, errors)}`}
          id="name"
          name="name"
          type="text"
          placeholder="Max"
          autoComplete="name"
        />
        {hasAttemptedSubmit && errors.name && <p className={styles.error}>{errors.name}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">
          Enter your email address
        </label>
        <Field
          className={`${styles.input} ${fieldStatusClass("email", hasAttemptedSubmit, errors)}`}
          id="email"
          name="email"
          type="email"
          placeholder="email@gmail.com"
          autoComplete="email"
        />
        {hasAttemptedSubmit && errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          Create a password
        </label>
        <div className={styles.passwordWrapper}>
          <Field
            className={`${styles.input} ${fieldStatusClass("password", hasAttemptedSubmit, errors)}`}
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="*********"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <svg className={styles.passwordIcon} width="24" height="24" aria-hidden="true">
              <use href={`/icons/sprite.svg#${showPassword ? "icon-eye" : "icon-eye-crossed"}`} />
            </svg>
          </button>
        </div>

        {hasAttemptedSubmit && errors.password && <p className={styles.error}>{errors.password}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="confirmPassword">
          Repeat your password
        </label>
        <div className={styles.passwordWrapper}>
          <Field
            className={`${styles.input} ${fieldStatusClass("confirmPassword", hasAttemptedSubmit, errors)}`}
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="*********"
            autoComplete="new-password"
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            <svg className={styles.passwordIcon} width="24" height="24" aria-hidden="true">
              <use
                href={`/icons/sprite.svg#${showConfirmPassword ? "icon-eye" : "icon-eye-crossed"}`}
              />
            </svg>
          </button>
        </div>

        {hasAttemptedSubmit && errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        className={styles.submitButton}
        variant="primary"
        size="md"
        type="submit"
        disabled={isSubmitting || isBlocked}
      >
        Create account
      </Button>

      <p className={styles.instructions}>
        Already have an account?{" "}
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
      toast.success("Great! Now add a profile photo.");
      router.push("/photo");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Formik initialValues={emptyValues} validationSchema={registerSchema} onSubmit={handleSubmit}>
      <RegisterFormFields />
    </Formik>
  );
}
