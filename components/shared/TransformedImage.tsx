import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = () => {};
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between">
        <h3 className="text-dark-600 h3-bold">Transformed</h3>

        {hasDownload && (
          <button onClick={downloadHandler} className="download-btn">
            <Image
              src="/assets/icons/download.svg"
              alt="download"
              width={24}
              height={24}
              className="cursor-pointer pb-[6px]"
            />
          </button>
        )}
      </div>
      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt={image.title}
            sizes={"(max-width: 768px) 100vw, 50vw"}
            placeholder={dataUrl as PlaceholderValue}
            className="media_uploader_cldImage"
            onLoad={() => setIsTransforming && setIsTransforming(false)}
            onError={() =>
              debounce(
                () => setIsTransforming && setIsTransforming(false),
                8000
              )
            }
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="loading">
              <Image
                src="/assets/icons/spinner.svg"
                alt="loading"
                width={24}
                height={24}
                className="cursor-pointer pb-[6px]"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
};

export default TransformedImage;
