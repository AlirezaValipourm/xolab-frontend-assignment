import illustration from "@/assets/images/box.png";
import { Button } from '@/components/shadcn/components/ui/button';
import React, { useRef, useState } from 'react';
import { useUploadStore } from '../store/uploadStore';
import { Typography } from './Typography';
import { TypographyWithKeywords } from './TypographyWithKeywords';
import { toast } from "react-hot-toast";
import { cn } from "./shadcn/lib/utils";
export interface FileUploaderProps {
  variant?: 'simple' | 'illustration'
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Allowed file formats (mime types or extensions)
   */
  allowedFormats?: string[];
  /**
   * Function to handle file upload
   */
  onUpload: (file: File) => void;
  /**
   * Function to validate file
   */
  validateFile: (file: File) => { valid: boolean; error?: string };
  /**
   * Whether the file upload is in progress
   */
  isInProgress?: boolean;
}

const DEFAULT_MAX_SIZE = 5; // 5MB
const DEFAULT_ALLOWED_FORMATS = [] as string[];

export const FileUploader: React.FC<FileUploaderProps> = ({
  maxSize = DEFAULT_MAX_SIZE,
  allowedFormats = DEFAULT_ALLOWED_FORMATS,
  onUpload,
  variant = 'simple',
  validateFile,
  isInProgress,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    addFile,
  } = useUploadStore();

  // Function to handle file upload
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    Array.from(fileList).forEach(file => {
      const validation = validateFile(file);

      if (validation.valid) {
        onUpload(file);
      } else if (validation.error) {
        // Add file with error status
        const fileId = `file-${Date.now()}-${file.name}`
        addFile({
          id: fileId,
          file,
          progress: 0,
          status: 'failed',
          error: validation.error,
        });
        toast.error(`Failed to upload file ${file.name} : ${validation.error}`)
      }
    });

    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  // Function to handle file drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  // Function to handle file drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  // Function to handle file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto bg-[url('/src/assets/images/bg-pattern.svg')]  bg-repeat-x bg-center",
      isInProgress ? "animate-move-background" : "bg-cover"
    )}>
      <div
        className={cn(
          "px-2.5 py-[70px] h-[267px] border-2 border-dashed border-grey-300 rounded-lg flex flex-col gap-[11px] items-center justify-center",
          isDragging ? 'border-grey-600 bg-grey-100' : 'border-grey-300 hover:border-grey-600'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {variant === 'illustration' && (
          <img src={illustration} alt="illustration" className="w-[115px] object-cover translate-y-[8px]" />
        )}
        <TypographyWithKeywords
          keywords={['file', 'browse']}
          className="!text-[24px] w-3/5 text-center text-grey-500 font-[600] leading-[110%]"
          keywordClassName="text-grey-800"
          text="Drag & drop a file or browse to upload"
          variant="h4"
        />
        <Button
          variant="default"
          size="sm"
          className="w-fit font-interTight"
        >
          Browse
        </Button>
        <div className="text-xs text-muted-foreground text-center font-interTight">
          <TypographyWithKeywords
            keywords={allowedFormats}
            text={`File must be ${allowedFormats.join(' or ')}`}
            variant="body1"
            className="text-grey-500 mb-[6px]"
            keywordClassName="text-grey-700"
          />
          <Typography variant="h7" className="text-grey-700 font-interTight text-[12px]">Max → {maxSize}MB</Typography>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept={allowedFormats.join(',')}
        />
      </div>
    </div>
  );
}; 