import { create } from 'zustand';
import { FileWithProgress } from '../core/types/FileWithProgress';

interface UploadState {
  files: FileWithProgress[];
  addFile: (file: FileWithProgress) => void;
  removeFile: (id: string) => void;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: FileWithProgress['status'], error: string | null) => void;
  clearFiles: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],
  
  addFile: (file) => 
    set((state) => ({ 
      files: [...state.files, file] 
    })),
  
  removeFile: (id) => 
    set((state) => ({ 
      files: state.files.filter((file) => file.id !== id) 
    })),
  
  updateFileProgress: (id, progress) => 
    set((state) => ({
      files: state.files.map((file) => 
        file.id === id ? { ...file, progress } : file
      )
    })),
  
  updateFileStatus: (id, status, error) => 
    set((state) => ({
      files: state.files.map((file) => 
        file.id === id ? { ...file, status, error } : file
      )
    })),
  
  clearFiles: () => set({ files: [] }),
})); 