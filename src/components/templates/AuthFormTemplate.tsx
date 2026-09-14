import type { ReactNode } from 'react';
import { Button } from '@/components/atoms';
import {
  Alert,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/molecules';

interface AuthFormTemplateProps {
  title: string;
  description: string;
  children: ReactNode;
  formError: string | null;
  isSubmitting: boolean;
  submitLabel: string;
  submittingLabel: string;
  footer: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function AuthFormTemplate({
  title,
  description,
  children,
  formError,
  isSubmitting,
  submitLabel,
  submittingLabel,
  footer,
  onSubmit,
}: AuthFormTemplateProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="grid gap-4">
            {formError && <Alert variant="destructive">{formError}</Alert>}
            {children}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? submittingLabel : submitLabel}
            </Button>
            {footer}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
