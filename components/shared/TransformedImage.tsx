"use client";
import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";
import { CldImage, getCldImageUrl } from "next-cloudinary";
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
  const downloadHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      }),
      title
    );
  };
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
              )() // The extra () immediately invokes the debounced function
              // Without the (), we would just be creating a debounced function but not executing it
              // We need to call it right away when an error occurs
            }
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="transforming-loader">
              <Image
                className="cursor-pointer pb-[6px]"
                src="/assets/icons/spinner.svg"
                alt="loading"
                width={24}
                height={24}
              />
              <p className="text-white/80">Please wait...</p>
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
