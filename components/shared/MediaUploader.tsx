import { useToast } from "@/hooks/use-toast";
import { CldUploadWidget } from "next-cloudinary";

const MediaUploader = () => {
  const toast = useToast();
  return (
    <CldUploadWidget uploadPreset="m7md-image-ai-saas">
    </CldUploadWidget>
  )
}

export default MediaUploader