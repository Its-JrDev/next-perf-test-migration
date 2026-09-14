'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { Input } from '@/components/atoms';
import { AuthFormTemplate } from '@/components/templates';
import {
  Field,
  FieldError,
  FieldLabel,
  FieldContent,
} from '@/components/molecules';
import { isApiError } from '@/services';

export function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const nextFieldErrors: Record<string, string> = {};
    if (!email.trim()) nextFieldErrors.email = 'El correo es obligatorio';
    if (!password) nextFieldErrors.password = 'La contraseña es obligatoria';
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.replace('/');
    } catch (err) {
      if (isApiError(err)) {
        if (err.kind === 'validation' && err.details) {
          const byField: Record<string, string> = {};
          for (const d of err.details) {
            if (d.field) byField[d.field] = d.message;
          }
          if (Object.keys(byField).length > 0) {
            setFieldErrors(byField);
          } else {
            setFormError(err.message);
          }
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError('No se pudo iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormTemplate
      title="Iniciar sesión"
      description="Ingresa con tu correo y contraseña para acceder a tu cuenta."
      formError={formError}
      isSubmitting={isSubmitting}
      submitLabel="Ingresar"
      submittingLabel="Ingresando…"
      footer={
        <p className="text-muted-foreground text-sm">
          ¿No tienes una cuenta?{' '}
          <Link
            href="/register"
            className="text-primary underline underline-offset-4"
          >
            Regístrate
          </Link>
        </p>
      }
      onSubmit={handleSubmit}
    >
      <Field>
        <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
        <FieldContent>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
          />
          <FieldError>{fieldErrors.email}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
        <FieldContent>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <FieldError>{fieldErrors.password}</FieldError>
        </FieldContent>
      </Field>
    </AuthFormTemplate>
  );
}
