import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { FileSpreadsheet, UploadCloud, X } from 'lucide-react';
import { cn, formatFileSize, validateExcelFile } from '@/utils';

export interface UploadDropzoneProps {
  file: File | null;
  onFileSelected: (file: File | null, error?: string) => void;
  disabled?: boolean;
}

export function UploadDropzone({
  file,
  onFileSelected,
  disabled = false,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(fileList: FileList | null) {
    const selected = fileList?.[0];
    if (!selected) return;
    const result = validateExcelFile(selected);
    if (!result.valid) {
      onFileSelected(null, result.error);
      return;
    }
    onFileSelected(selected);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(event.dataTransfer.files);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    event.target.value = '';
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  if (file) {
    return (
      <div className="dark:bg-surface-800 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800">
        <FileSpreadsheet
          className="size-8 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {file.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatFileSize(file.size)}
          </p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => onFileSelected(null)}
            aria-label="Quitar archivo"
            className="dark:hover:bg-surface-700 shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Seleccionar o arrastrar archivo Excel"
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors',
        isDragging
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <UploadCloud className="size-8 text-slate-400" aria-hidden />
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Arrastra tu archivo Excel aquí
        </p>
        <p className="text-xs text-slate-400">o haz clic para seleccionarlo</p>
      </div>
      <p className="text-xs text-slate-400">
        Formato permitido: .xlsx · Tamaño máximo: 10 MB
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        disabled={disabled}
        onChange={handleInputChange}
      />
    </div>
  );
}
