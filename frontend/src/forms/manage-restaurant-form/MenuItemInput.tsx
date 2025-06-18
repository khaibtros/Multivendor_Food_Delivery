import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { X } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Props = {
  index: number;
  removeMenuItem: () => void;
};

type ToppingOption = {
  name: string;
  price: number | string;
};

type ToppingCategory = {
  categoryName: string;
  options: ToppingOption[];
};

const MenuItemInput = ({ index, removeMenuItem }: Props) => {
  const { control, setValue, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [tempToppings, setTempToppings] = useState<ToppingCategory[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const existingImageUrl = watch(`menuItems.${index}.imageUrl`);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTempToppings([]);
      setErrorMessage("");
    }
    setIsOpen(open);
  };

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
      setValue(`menuItems.${index}.imageFile`, null);
      return;
    }

    if (!validateImageFile(file)) {
      setValue(`menuItems.${index}.imageFile`, null);
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");
      setValue(`menuItems.${index}.imageFile`, file);
      
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setValue(`menuItems.${index}.imageUrl`, previewUrl);
    } catch (error) {
      console.error("Error handling image:", error);
      setErrorMessage("Failed to process image. Please try again.");
      setValue(`menuItems.${index}.imageFile`, null);
      setValue(`menuItems.${index}.imageUrl`, existingImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    // Get current toppings from temp state or form
    const currentToppings = tempToppings.length > 0 ? tempToppings : control._formValues.menuItems[index].toppings || [];

    // Check if there are any toppings to save
    if (currentToppings.length === 0) {
      setIsOpen(false);
      return;
    }

    // Validate each category and option
    for (let i = 0; i < currentToppings.length; i++) {
      const category: ToppingCategory = currentToppings[i];
      
      // Check category name
      if (!category.categoryName?.trim()) {
        setErrorMessage(`Category ${i + 1} name is required`);
        return;
      }

      // Check each option in the category
      for (let j = 0; j < category.options.length; j++) {
        const option: ToppingOption = category.options[j];
        
        // Check option name
        if (!option.name?.trim()) {
          setErrorMessage(`Option ${j + 1} in Category ${i + 1} name is required`);
          return;
        }

        // Check price
        const priceStr = option.price?.toString() || "";
        if (!priceStr) {
          setErrorMessage(`Price for Option ${j + 1} in Category ${i + 1} is required`);
          return;
        }

        const price = parseFloat(priceStr);
        if (isNaN(price)) {
          setErrorMessage(`Price for Option ${j + 1} in Category ${i + 1} must be a valid number`);
          return;
        }

        if (price < 0) {
          setErrorMessage(`Price for Option ${j + 1} in Category ${i + 1} cannot be negative`);
          return;
        }
      }
    }

    // If we get here, all validations passed
    // Convert all prices to numbers
    const validatedToppings = currentToppings.map((category: ToppingCategory) => ({
      ...category,
      options: category.options.map((option: ToppingOption) => ({
        ...option,
        price: parseFloat(option.price.toString())
      }))
    }));

    // Save to form
    setValue(`menuItems.${index}.toppings`, validatedToppings);
    
    // Close dialog and reset temp state
    setTempToppings([]);
    setErrorMessage("");
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-end gap-2">
        <FormField
          control={control}
          name={`menuItems.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Name <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Cheese Pizza"
                  className="bg-white"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`menuItems.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Price (£) <FormMessage />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="8.00" className="bg-white" />
              </FormControl>
            </FormItem>
          )}
        />
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="max-h-fit">
              Manage Toppings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Manage Toppings</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={control}
                name={`menuItems.${index}.toppings`}
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-4">
                      {(tempToppings.length > 0 ? tempToppings : field.value || []).map((category: ToppingCategory, categoryIndex: number) => (
                        <div key={categoryIndex} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              value={category.categoryName}
                              onChange={(e) => {
                                const newToppings = [...(tempToppings.length > 0 ? tempToppings : field.value || [])];
                                newToppings[categoryIndex] = {
                                  ...newToppings[categoryIndex],
                                  categoryName: e.target.value,
                                };
                                if (tempToppings.length > 0) {
                                  setTempToppings(newToppings);
                                } else {
                                  field.onChange(newToppings);
                                }
                                setErrorMessage("");
                              }}
                              placeholder="Category Name"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newToppings = [...(tempToppings.length > 0 ? tempToppings : field.value || [])];
                                newToppings.splice(categoryIndex, 1);
                                if (tempToppings.length > 0) {
                                  setTempToppings(newToppings);
                                } else {
                                  field.onChange(newToppings);
                                }
                                setErrorMessage("");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 pl-4">
                            {category.options.map((option: ToppingOption, optionIndex: number) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <Input
                                  value={option.name}
                                  onChange={(e) => {
                                    const newToppings = [...(tempToppings.length > 0 ? tempToppings : field.value || [])];
                                    newToppings[categoryIndex].options[optionIndex] = {
                                      ...newToppings[categoryIndex].options[optionIndex],
                                      name: e.target.value,
                                    };
                                    if (tempToppings.length > 0) {
                                      setTempToppings(newToppings);
                                    } else {
                                      field.onChange(newToppings);
                                    }
                                    setErrorMessage("");
                                  }}
                                  placeholder="Option Name"
                                />
                                <Input
                                  value={option.price === 0 ? "" : option.price.toString()}
                                  onChange={(e) => {
                                    const newToppings = [...(tempToppings.length > 0 ? tempToppings : field.value || [])];
                                    newToppings[categoryIndex].options[optionIndex] = {
                                      ...newToppings[categoryIndex].options[optionIndex],
                                      price: e.target.value,
                                    };
                                    if (tempToppings.length > 0) {
                                      setTempToppings(newToppings);
                                    } else {
                                      field.onChange(newToppings);
                                    }
                                    setErrorMessage("");
                                  }}
                                  placeholder="Price"
                                  type="text"
                                  inputMode="decimal"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newToppings = [...(tempToppings.length > 0 ? tempToppings : field.value || [])];
                                    newToppings[categoryIndex].options.splice(optionIndex, 1);
                                    if (tempToppings.length > 0) {
                                      setTempToppings(newToppings);
                                    } else {
                                      field.onChange(newToppings);
                                    }
                                    setErrorMessage("");
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newToppings = [...(tempToppings.length > 0 ? tempToppings : field.value || [])];
                                newToppings[categoryIndex].options.push({
                                  name: "",
                                  price: "",
                                });
                                if (tempToppings.length > 0) {
                                  setTempToppings(newToppings);
                                } else {
                                  field.onChange(newToppings);
                                }
                                setErrorMessage("");
                              }}
                            >
                              Add Option
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newToppings = [
                            ...(tempToppings.length > 0 ? tempToppings : field.value || []),
                            {
                              categoryName: "",
                              options: [{ name: "", price: "" }],
                            },
                          ];
                          if (tempToppings.length > 0) {
                            setTempToppings(newToppings);
                          } else {
                            field.onChange(newToppings);
                          }
                          setErrorMessage("");
                        }}
                      >
                        Add Category
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {errorMessage && (
              <div className="text-sm text-red-500 mb-4">
                {errorMessage}
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setTempToppings([]);
                  setErrorMessage("");
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          type="button"
          onClick={removeMenuItem}
          className="bg-red-500 max-h-fit"
        >
          Remove
        </Button>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <div>
          <h3 className="text-lg font-semibold">Item Image</h3>
          <p className="text-sm text-gray-500">
            Add an image for this menu item. Adding a new image will overwrite the existing one.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:w-[30%]">
          {(existingImageUrl || isUploading) && (
            <AspectRatio ratio={16 / 9}>
              <img
                src={existingImageUrl}
                className="rounded-md object-cover h-full w-full"
                alt={`${watch(`menuItems.${index}.name`)} image`}
              />
            </AspectRatio>
          )}
          <FormField
            control={control}
            name={`menuItems.${index}.imageFile`}
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
    </div>
  );
};

export default MenuItemInput;
