"use client";

import toast from "react-hot-toast";
import { ReactNode } from "react";
import { ErrorComponent } from "@/components/error-component";

type Response = { status: string; message: string;[key: string]: unknown };

interface ResponseHandlerOptions {
    showSuccess?: boolean;
    showError?: boolean;
    showInfo?: boolean;
    showWarning?: boolean;
    errorUI?: boolean;
}

export function useClientResponseHandler(options: ResponseHandlerOptions = {}) {
    const {
        showSuccess = true,
        showError = true,
        showInfo = true,
        showWarning = true,
        errorUI = false
    } = options;

    return function handleResponse(res: Response): Response | ReactNode {
        switch (res.status) {
            case "success":
                if (showSuccess) {
                    toast.success(res.message);
                }
                break;
            case "error":
                if (showError) {
                    toast.error(res.message);
                }
                break;
            case "info":
                if (showInfo) {
                    toast(res.message);
                }
                break;
            case "warning":
                if (showWarning) {
                    toast(res.message, { icon: "⚠️" });
                }
                break;
            default:
                toast(res.message);
        }

        // Return error component if errorUI is enabled and there's an error
        if (errorUI && res.status === "error") {
            return ErrorComponent({ message: res.message });
        }

        // return for further handling if needed
        return res;
    };
} 