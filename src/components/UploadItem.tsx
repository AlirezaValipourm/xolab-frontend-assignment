import FailedIcon from '@/assets/icons/failedIcon.svg';
import SuccessIcon from '@/assets/icons/successIcon.svg';
import UploadingIcon from '@/assets/icons/uploadingIcon.svg';
import XIcon from '@/assets/icons/xIcon.svg';
import RetryIcon from '@/assets/icons/retryIcon.svg';
import { FileWithProgress } from '@/core/types/FileWithProgress';
import { FC } from 'react';
import { Typography } from './Typography';
import { useDeleteFileAPI } from '@/core/api/upload/deleteFile';
import { cn } from './shadcn/lib/utils';

interface UploadItemProps {
    file: FileWithProgress;
    removeFile: (id: string) => void;
    handleRetry: (id: string) => void;
}

export const UploadItem = ({ file, removeFile, handleRetry }: UploadItemProps) => {
    const { mutate: deleteFile } = useDeleteFileAPI()

    // Function to handle file delete
    const handleDelete = () => {
        deleteFile({ fileName: file.file.name }, {
            onSuccess: () => {
                removeFile(file.id)
            },
            onError: () => {
                console.error('Failed to delete file')
            }
        })
    }

    // Function to get the icon based on the file status
    const getIcon = () => {
        if (file.status === 'uploading') {
            return <img src={UploadingIcon} alt="uploading" className='w-[13px] h-[13px]' />
        }
        if (file.status === 'completed') {
            return <img src={SuccessIcon} alt="success" className='w-[13px] h-[13px]' />
        }
        if (file.status === 'failed') {
            return <img src={FailedIcon} alt="failed" className='w-[13px] h-[13px]' />
        }
    }

    // Function to get the action based on the file status
    const getAction = () => {
        if (file.status === 'completed') {
            return <div onClick={handleDelete} className='flex items-center justify-center gap-1 border border-grey-200 h-[22px] w-[22px] rounded-[6px] cursor-pointer'>
                <img src={XIcon} alt="x" className='w-[6px] h-[6px]' />
            </div>
        }
        // using abort controller the upload can be cancelled (not implemented: simplified to remove the file)
        if (file.status === 'uploading') {
            return <div onClick={() => removeFile(file.id)} className='flex items-center justify-center gap-1 border border-grey-200 h-[22px] w-[22px] rounded-[6px] cursor-pointer'>
                <img src={XIcon} alt="x" className='w-[6px] h-[6px]' />
            </div>
        }
        if (file.status === 'failed') {
            return <div onClick={() => handleRetry(file.id)} className='flex items-center justify-center gap-1 border border-grey-200 h-[22px] w-[22px] rounded-[6px] cursor-pointer'>
                <img src={RetryIcon} alt="retry" className='w-[11px] h-[11px]' />
            </div>
        }
    }

    // Function to get the status based on the file status
    const getStatus = () => {
        if (file.status === 'uploading') {
            return <UploadingStatus />
        }
        if (file.status === 'completed') {
            return <CompletedStatus />
        }
        if (file.status === 'failed') {
            return <FailedStatus reason={file.error} />
        }
    }

    // Function to get the file name
    const getFileName = () => {
        return file.file.name.length > 15 ? file.file.name.slice(0, 15) + '...' : file.file.name
    }

    // Function to get the file size
    const getFileSize = () => {
        return file.file.size > 1024 * 1024 ? (file.file.size / (1024 * 1024)).toFixed(2) + 'MB' : (file.file.size / 1024).toFixed(2) + 'KB'
    }
    return (
        <div
            className="border rounded-[6px] py-[6px] px-[10px] flex items-center justify-between h-[34px] relative overflow-hidden"
        >
            <div className="flex items-center gap-1">
                {/* icon based on status */}
                {getIcon()}
                <div className="flex gap-1 items-center">
                    <Typography variant="h7" className="text-grey-750 font-interTight text-[14px] !font-[500]">
                        {getFileName()}
                    </Typography>
                    <Typography variant="h7" className={cn("text-grey-400 font-interTight text-[12px] !font-[500]", file.error?.includes('Too Large') && "text-[#F13C72]")}>
                        {`(${getFileSize()})`}
                    </Typography>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {getStatus()}
                {getAction()}
            </div>
            {file.progress !== 100 && <div className={'h-[4px] bg-grey-1200 rounded-[6px] absolute bottom-0 translate-y-[50%]'} style={{width:file.progress ? `${file.progress}%` : "0", maxWidth:'calc(100% - 20px)'}}>
            </div>}
        </div>
    )
}

interface FailedStatusProps {
    reason: string | null;
}

const FailedStatus: FC<FailedStatusProps> = ({ reason }) => {
    const getReason = () => {
        return reason ? `Failed — ${reason}` : 'Failed'
    }
    return (
        <div className="flex items-center gap-1 border border-grey-200 h-[22px] rounded-[6px] px-[10px] py-[4px]">
            <div className='w-[7px] h-[7px] rounded-[2px] bg-[#F13C72]' />
            <Typography variant="h7" className="text-grey-750 font-interTight text-[14px] !font-[500]">
                {getReason()}
            </Typography>
        </div>
    )
}

const CompletedStatus: FC = () => {
    return (
        <div className="flex items-center gap-1 border border-grey-200 h-[22px] rounded-[6px] px-[10px] py-[4px]">
            <div className='w-[7px] h-[7px] rounded-[2px] bg-[#32B587]' />
            <Typography variant="h7" className="text-grey-750 font-interTight text-[14px] !font-[500]">
                Completed
            </Typography>
        </div>
    )
}

const UploadingStatus: FC = () => {
    return (
        <div className="flex items-center gap-1 border border-grey-200 h-[22px] rounded-[6px] px-[10px] py-[4px]">
            <div className='w-[7px] h-[7px] rounded-[2px] bg-[#3CA5F1]' />
            <Typography variant="h7" className="text-grey-750 font-interTight text-[14px] !font-[500]">
                Uploading
            </Typography>
        </div>
    )
}