import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloud } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate, type Location } from 'react-router-dom';
import { z } from 'zod';
import { Button, Card, Input } from '@/components/common';
import { useAuth, useToast } from '@/hooks';
import { getApiErrorMessage } from '@/utils';
import { ROUTES } from '@/routes/paths';

const loginSchema = z.object({
  usuario: z.string().min(1, 'Ingresa tu usuario'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const from =
    (location.state as { from?: Location } | null)?.from?.pathname ?? ROUTES.dashboard;

  // Ya hay una sesión válida (p. ej. tras refrescar la página) — no mostrar el login.
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.usuario, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      showToast({
        tone: 'danger',
        message: getApiErrorMessage(
          error,
          'No se pudo iniciar sesión. Intenta nuevamente.',
        ),
      });
    }
  };

  return (
    <div className="bg-surface-50 dark:bg-surface-950 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300 flex size-12 items-center justify-center rounded-full">
            <UploadCloud className="size-6" aria-hidden />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Carga Masiva
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Inicia sesión para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Usuario"
            autoComplete="username"
            error={errors.usuario?.message}
            {...register('usuario')}
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="mt-2 w-full" isLoading={isSubmitting}>
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Autenticación JWT vía API Gateway
        </p>
      </Card>
    </div>
  );
}
