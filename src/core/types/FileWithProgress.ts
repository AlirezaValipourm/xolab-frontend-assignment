export interface FileWithProgress {
    id: string;
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'failed';
    error: string | null;
  } 