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

export function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'El nombre es obligatorio';
    if (!email.trim()) next.email = 'El correo es obligatorio';
    if (!password) next.password = 'La contraseña es obligatoria';
    else if (password.length < 6)
      next.password = 'Debe tener al menos 6 caracteres';
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      router.replace('/');
    } catch (err) {
      if (isApiError(err)) {
        if (err.kind === 'validation' || err.kind === 'conflict') {
          if (err.details && err.details.some((d) => d.field)) {
            const byField: Record<string, string> = {};
            if (err.details) {
              for (const d of err.details) {
                if (d.field) byField[d.field] = d.message;
              }
            }
            setFieldErrors(byField);
          } else {
            setFormError(err.message);
          }
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError('No se pudo crear la cuenta. Intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormTemplate
      title="Crear cuenta"
      description="Crea una cuenta para guardar tus eventos favoritos."
      formError={formError}
      isSubmitting={isSubmitting}
      submitLabel="Registrarme"
      submittingLabel="Creando cuenta…"
      footer={
        <p className="text-muted-foreground text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="text-primary underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      }
      onSubmit={handleSubmit}
    >
      <Field>
        <FieldLabel htmlFor="name">Nombre</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
          />
          <FieldError>{fieldErrors.name}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
        <FieldContent>
          <Input
            id="email"
            type="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
          <FieldError>{fieldErrors.password}</FieldError>
        </FieldContent>
      </Field>
    </AuthFormTemplate>
  );
}
