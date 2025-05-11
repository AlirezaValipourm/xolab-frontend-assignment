import { AxiosError, AxiosResponse } from "axios";
import { api } from "../interceptor";
import { useMutation } from "@tanstack/react-query";

type DeleteFileParams = {
    fileName: string
}

type DeleteFileResponse = {
    message: string
    success: boolean
}

const deleteFile = async (fileName: string) => {
    const url = `/upload`
    try {
        const deleteResponse = await api.delete<DeleteFileResponse>(url, {
            data: { filename: fileName }
        })
        console.log("deleteResponse", deleteResponse)
        return deleteResponse
    } catch (error) {
        console.log("error", error)
        throw error
    }
}

export const useDeleteFileAPI = () => {
    return useMutation<AxiosResponse<DeleteFileResponse>, AxiosError, DeleteFileParams>({
        mutationFn: ({ fileName }) => deleteFile(fileName),
    })
}