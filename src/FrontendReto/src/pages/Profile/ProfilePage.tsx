import { UserCircle } from 'lucide-react';
import { PagePlaceholder } from '@/components/common';

export function ProfilePage() {
  return (
    <PagePlaceholder
      icon={UserCircle}
      title="Perfil"
      description="Datos del usuario autenticado (usuario y rol vienen del JWT)"
    />
  );
}
