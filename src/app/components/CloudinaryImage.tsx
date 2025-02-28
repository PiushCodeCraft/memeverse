"use client";
import { CldImage } from "next-cloudinary";

const CloudinaryImage = ({ src }: { src: string }) => {
  return (
    <CldImage
          src={src} // Pass dynamic image source
          width="500"
          height="500"
          crop={{ type: "auto", source: true }} alt={""}    />
  );
};

export default CloudinaryImage;
