import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "./DetailsSection";
import { Separator } from "@/components/ui/separator";
import CuisinesSection from "./CuisinesSection";
import MenuSection from "./MenuSection";
import ImageSection from "./ImageSection";
import OpeningHoursSection from "./OpeningHoursSection";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types/index";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formSchema = z
  .object({
    restaurantName: z.string({
      required_error: "restaurant name is required",
    }),
    city: z.string({
      required_error: "city is required",
    }),
    country: z.string({
      required_error: "country is required",
    }),
  
    cuisines: z.array(z.string()).nonempty({
      message: "please select at least one item",
    }),
    menuItems: z.array(
      z.object({
        name: z.string().min(1, "name is required"),
        price: z.coerce.number().min(0, "price must be positive"),
        imageUrl: z.string().optional(),
        imageFile: z.instanceof(File, { message: "image is required" }).optional(),
        toppings: z.array(
          z.object({
            categoryName: z.string().min(1, "category name is required"),
            options: z.array(
              z.object({
                name: z.string().min(1, "option name is required"),
                price: z.number().min(0, "price must be positive"),
              })
            ).min(1, "at least one option is required"),
          })
        ).optional(),
      })
    ),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional(),
    addressLine1: z.string({
      required_error: "address line 1 is required",
    }),
    street: z.string({
      required_error: "street is required",
    }),
    ward: z.string({
      required_error: "ward is required",
    }),
    district: z.string({
      required_error: "district is required",
    }),
    phoneNumber: z
      .string({
        required_error: "phone number is required",
      })
      .regex(/^(\+?[0-9]{1,4}[\s-])?(?!0+\s+,?$)\d{10,11}$/, "Please enter a valid phone number (e.g., 07123456789 or +44 7123456789)"),
    description: z.string().optional(),
    openingHours: z.array(
      z.object({
        day: z.string().refine((val) => DAYS_OF_WEEK.includes(val), {
          message: "invalid day of week",
        }),
        open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
          message: "invalid time format (HH:MM)",
        }),
        close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
          message: "invalid time format (HH:MM)",
        }),
      })
    ).min(1, "Please add at least one opening hour"),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
  })
  .refine(
    (data) => {
      const days = data.openingHours.map((hours) => hours.day);
      return new Set(days).size === days.length;
    },
    {
      message: "Each day can only appear once in opening hours",
      path: ["openingHours"],
    }
  );

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading, restaurant }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      city: "",
      country: "",
      addressLine1: "",
      street: "",
      ward: "",
      district: "",
      phoneNumber: "",
      description: "",
      cuisines: [],
      menuItems: [{ name: "", price: 0 }],
      openingHours: [],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    const menuItemsFormatted = restaurant.menuItems.map((item) => ({
      ...item,
      price: parseInt((item.price / 100).toFixed(2)),
    }));

    const updatedRestaurant = {
      ...restaurant,
      menuItems: menuItemsFormatted,
    };

    form.reset(updatedRestaurant);
  }, [form, restaurant]);

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("restaurantName", formDataJson.restaurantName);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("addressLine1", formDataJson.addressLine1);
    formData.append("street", formDataJson.street);
    formData.append("ward", formDataJson.ward);
    formData.append("district", formDataJson.district);
    formData.append("phoneNumber", formDataJson.phoneNumber);
    if (formDataJson.description) {
      formData.append("description", formDataJson.description);
    }

    // Stringify arrays and objects before appending
    formData.append("cuisines", JSON.stringify(formDataJson.cuisines));
    formData.append("menuItems", JSON.stringify(formDataJson.menuItems));
    formData.append("openingHours", JSON.stringify(formDataJson.openingHours));

    if (formDataJson.imageFile) {
      formData.append("imageFile", formDataJson.imageFile);
    }

    onSave(formData);
  };

  const renderStatusAlert = () => {
    if (!restaurant) return null;

    switch (restaurant.status) {
      case "pending":
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your restaurant is pending approval. You will be notified once it's reviewed.
            </AlertDescription>
          </Alert>
        );
      case "approved":
        return (
          <Alert className="bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Your restaurant has been approved and is now live!
            </AlertDescription>
          </Alert>
        );
      case "rejected":
        return (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Your restaurant was rejected. Reason: {restaurant.approvalNote}
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailsSection />
        <Separator />
        <OpeningHoursSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? <LoadingButton /> : <Button type="submit">Submit</Button>}
        {renderStatusAlert()}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
