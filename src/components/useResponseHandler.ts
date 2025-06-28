import toast from "react-hot-toast";

type Response = { status: string; message: string; [key: string]: any };

export function useResponseHandler() {
  return function handleResponse(res: Response) {
    switch (res.status) {
      case "success":
        toast.success(res.message);
        break;
      case "error":
        toast.error(res.message);
        break;
      case "info":
        toast(res.message);
        break;
      case "warning":
        toast(res.message, { icon: "⚠️" });
        break;
      default:
        toast(res.message);
    }
    // return for further handling if needed
    return res;
  };
}
