import { useState } from "react";
import { FileUploader } from "../../FileUploader";
import { FormatToggle } from "../../FormatToggle";
import logo from "../../../assets/images/logo.svg"
import { TypographyWithKeywords } from "@/components/TypographyWithKeywords";
import { Typography } from "@/components/Typography";
import { useUploadStore } from "@/store/uploadStore";
import { useUploadFileAPI } from "@/core/api/upload/uploadFile";
import { UploadItem } from "@/components/UploadItem";
import { toast } from "react-hot-toast";
export const Home = () => {
    const [allowedFormats, setAllowedFormats] = useState<string[]>(['.JPG', '.PNG']);
    const [maxSize, setMaxSize] = useState<number>(10); // 10MB
    const { mutate: uploadFile } = useUploadFileAPI()

    const {
        files,
        addFile,
        removeFile,
        updateFileProgress,
        updateFileStatus,
    } = useUploadStore();

    // Function to handle file upload
    const handleUpload = (file: File) => {
        const fileId = `file-${Date.now()}-${file.name}`
        addFile({
            id: fileId,
            file,
            progress: 0,
            status: 'uploading',
            error: null
        })

        uploadFile({
            file,
            onProgress: (percent) => {
                updateFileProgress(fileId, percent)
                if (percent === 100) {
                    updateFileStatus(fileId, 'completed', null)
                    toast.success(`File ${file.name} uploaded successfully`)
                }
            }
        }, {
            onError: (error) => {
                updateFileStatus(fileId, 'failed', error.message)
                toast.error(`Failed to upload file ${file.name} : ${error.message}`)
            }
        })
    }

    // Function to handle file retry
    const handleRetry = (fileId: string) => {
        const fileToRetry = files.find(f => f.id === fileId);
        if (fileToRetry && fileToRetry.file) {
            const validation = validateFile(fileToRetry.file);
            if (validation.valid) {
                removeFile(fileId);
                updateFileStatus(fileId, 'uploading', null);
                handleUpload(fileToRetry.file);
            } else {
                updateFileStatus(fileId, 'failed', validation.error || null);
                toast.error(`Failed to upload file ${fileToRetry.file.name} : ${validation.error}`)
            }
        }
    };


    // Function to check if file format is allowed
    const isFormatAllowed = (file: File): boolean => {
        return allowedFormats.some(format => {
            return file.type.toLowerCase() === format.toLowerCase() || file.name.toLowerCase().endsWith(format.toLowerCase());
        });
    };

    // Function to validate file before upload
    const validateFile = (file: File): { valid: boolean; error?: string } => {
        if (!isFormatAllowed(file)) {
            return { valid: false, error: 'Unsupported format' };
        }

        if (file.size > maxSize * 1024 * 1024) {
            return {
                valid: false,
                error: `Too Large`
            };
        }

        return { valid: true };
    };
    return (
        <div className="min-h-screen flex flex-col bg-background p-4 md:p-6">
            <header className="mb-8">
                <img src={logo} alt="logo" className="w-[51px] h-[51px] mx-auto" />
                <TypographyWithKeywords
                    keywords={["Files"]}
                    text="Upload Your Files"
                    variant="h2"
                    weight="bold"
                    className="text-center text-grey-1000 !text-[40px] font-[600] leading-[110%]"
                    keywordClassName="text-grey-500"
                />
            </header>

            <main className="flex flex-col gap-[28px] flex-1 max-w-4xl w-full mx-auto lg:w-[600px] border border-grey-50 py-5 px-[30px] rounded-[10px]">
                <div className="flex flex-col gap-2">
                    <Typography variant="h4" className="text-grey-750 font-interTight text-[16px] !font-[500]">File</Typography>
                    <FileUploader
                        allowedFormats={allowedFormats}
                        maxSize={maxSize}
                        variant="illustration"
                        onUpload={handleUpload}
                        validateFile={validateFile}
                        isInProgress={files.some(file => file.status === 'uploading')}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Typography variant="h4" className="text-grey-750 font-interTight text-[16px] !font-[500]">List</Typography>
                    {files.length > 0 && (
                        <div>
                            <div className="space-y-3">
                                {files.map((file) => (
                                    <UploadItem
                                        key={file.id}
                                        file={file}
                                        removeFile={removeFile}
                                        handleRetry={handleRetry}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 border rounded-lg p-4 max-w-2xl mx-auto w-full">
                    <h2 className="text-lg font-medium mb-4">Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Maximum file size: {maxSize}MB
                            </label>
                            <input
                                type="range"
                                min={1}
                                step={0.1}
                                max={50}
                                value={maxSize}
                                onChange={(e) => setMaxSize(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Allowed formats:
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <FormatToggle
                                    label="JPG"
                                    isActive={allowedFormats.includes('.JPG')}
                                    onChange={(active) => {
                                        if (active) {
                                            setAllowedFormats(prev => [...prev, '.JPG']);
                                        } else {
                                            setAllowedFormats(prev => prev.filter(f => f !== '.JPG'));
                                        }
                                    }}
                                />
                                <FormatToggle
                                    label="PNG"
                                    isActive={allowedFormats.includes('.PNG')}
                                    onChange={(active) => {
                                        if (active) {
                                            setAllowedFormats(prev => [...prev, '.PNG']);
                                        } else {
                                            setAllowedFormats(prev => prev.filter(f => f !== '.PNG'));
                                        }
                                    }}
                                />
                                <FormatToggle
                                    label="JPEG"
                                    isActive={allowedFormats.includes('.JPEG')}
                                    onChange={(active) => {
                                        if (active) {
                                            setAllowedFormats(prev => [...prev, '.JPEG']);
                                        } else {
                                            setAllowedFormats(prev => prev.filter(f => f !== '.JPEG'));
                                        }
                                    }}
                                />

                                <FormatToggle
                                    label="PDF"
                                    isActive={allowedFormats.includes('.PDF')}
                                    onChange={(active) => {
                                        if (active) {
                                            setAllowedFormats(prev => [...prev, '.PDF']);
                                        } else {
                                            setAllowedFormats(prev => prev.filter(f => f !== '.PDF'));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
