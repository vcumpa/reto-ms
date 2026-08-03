import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { Button, Card, Input } from '@/components/common';
import { UploadDropzone, UploadProgress } from '@/components/upload';
import { useAuth, useToast, useUploadCarga } from '@/hooks';
import { getApiErrorMessage } from '@/utils';
import { ROUTES } from '@/routes/paths';

export function UploadPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const uploadMutation = useUploadCarga();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const [periodo, setPeriodo] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (selected: File | null, error?: string) => {
    setFile(selected);
    setFileError(error);
    setProgress(0);
  };

  const canSubmit =
    Boolean(file) && Boolean(periodo) && !fileError && !uploadMutation.isPending;

  const handleSubmit = async () => {
    if (!file || !periodo || !user) return;
    setProgress(0);
    try {
      const periodoBackend = periodo.replace("-", "");

      const response = await uploadMutation.mutateAsync({
        archivo: file,
        periodo: periodoBackend,
        usuario: user.email,
        onUploadProgress: setProgress,
      });
      showToast({
        tone: 'success',
        message: `Carga #${response.idCarga} registrada correctamente (${response.estado}).`,
      });
      navigate(ROUTES.history);
    } catch (error) {
      showToast({
        tone: 'danger',
        message: getApiErrorMessage(
          error,
          'No se pudo subir el archivo. Intenta nuevamente.',
        ),
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Subir Excel
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          El archivo se procesa de forma asíncrona — el estado se actualiza
          automáticamente.
        </p>
      </div>

      <Card className="max-w-xl p-6">
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Archivo
            </label>
            <UploadDropzone
              file={file}
              onFileSelected={handleFileSelected}
              disabled={uploadMutation.isPending}
            />
            {fileError && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{fileError}</p>
            )}
          </div>

          <Input
            type="month"
            label="Periodo"
            value={periodo}
            onChange={(event) => setPeriodo(event.target.value)}
            disabled={uploadMutation.isPending}
            hint="Periodo al que corresponde la información del archivo."
          />

          {uploadMutation.isPending && <UploadProgress percent={progress} />}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            isLoading={uploadMutation.isPending}
            className="self-start"
          >
            <UploadCloud className="size-4" aria-hidden />
            Subir archivo
          </Button>
        </div>
      </Card>
    </div>
  );
}
