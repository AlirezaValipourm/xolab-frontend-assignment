import { AxiosError, AxiosResponse } from "axios";
import { api } from "../interceptor";
import { useMutation } from "@tanstack/react-query";

type UploadFileParams = {
    file: File,
    onProgress: (percent: number) => void
}

type UploadFileResponse = {
    data: {
        fileName: string
    },
    message: string
    success: boolean
}

const uploadFile = async (file: File, onProgress: (percent: number) => void) => {
    const url = `/upload`
    try {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await api.post<UploadFileResponse>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                onProgress(percent);
            }
        })
        console.log("uploadResponse", uploadResponse)
        return uploadResponse
    } catch (error) {
        console.log("error", error)
        throw error
    }
}

export const useUploadFileAPI = () => {
    return useMutation<AxiosResponse<UploadFileResponse>, AxiosError, UploadFileParams>({
        mutationFn: ({ file, onProgress }) => uploadFile(file, onProgress),
        mutationKey: ['uploadFile'],
    })
}