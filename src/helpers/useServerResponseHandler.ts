import { ReactNode } from "react"
import { ErrorComponent } from "../components/error-component"

type Response = { status: string; message: string; [key: string]: unknown }

interface ResponseHandlerOptions {
  showSuccess?: boolean
  showError?: boolean
  showInfo?: boolean
  showWarning?: boolean
  errorUI?: boolean
}

export function useServerResponseHandler(options: ResponseHandlerOptions = {}) {
  const { errorUI = false } = options

  return function handleResponse(res: Response): Response | ReactNode {
    // Return error component if errorUI is enabled and there's an error
    if (errorUI && res.status === "error") {
      return ErrorComponent({ message: res.message })
    }

    // return for further handling if needed
    return res
  }
}
