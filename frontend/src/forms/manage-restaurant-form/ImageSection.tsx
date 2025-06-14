import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

const ImageSection = () => {
  const { control, watch, setValue } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const existingImageUrl = watch("imageUrl");

  const validateImageFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a valid image file (JPEG, JPG, or PNG)");
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage("Image size should be less than 5MB");
      return false;
    }

    return true;
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setValue("imageFile", null);
      return;
    }

    if (!validateImageFile(file)) {
      setValue("imageFile", null);
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");
      setValue("imageFile", file);
      
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setValue("imageUrl", previewUrl);
    } catch (error) {
      console.error("Error handling image:", error);
      setErrorMessage("Failed to process image. Please try again.");
      setValue("imageFile", null);
      setValue("imageUrl", existingImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Image</h2>
        <FormDescription>
          Add an image that will be displayed on your restaurant listing in the
          search results. Adding a new image will overwrite the existing one.
        </FormDescription>
      </div>

      <div className="flex flex-col gap-8 md:w-[50%]">
        {(existingImageUrl || isUploading) && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={existingImageUrl}
              className="rounded-md object-cover h-full w-full"
              alt="Restaurant image"
            />
          </AspectRatio>
        )}
        <FormField
          control={control}
          name="imageFile"
          render={() => (
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
              {errorMessage && (
                <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
              )}
              {isUploading && (
                <p className="text-sm text-blue-500 mt-1">Uploading image...</p>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ImageSection;
