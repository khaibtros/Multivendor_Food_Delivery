import type { Restaurant } from "@/types"
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Utensils } from "lucide-react"
import StarRating from "./ui/star-rating"
import { cn } from "@/lib/utils"

type Props = {
  restaurant: Restaurant
}

const SearchResultCard = ({ restaurant }: Props) => {
  const address = [
    restaurant.addressLine1,
    restaurant.street,
    restaurant.ward,
    restaurant.district,
    restaurant.city,
    restaurant.country,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <Link href={`/detail/${restaurant._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-0">
          {/* Image Section */}
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16 / 10} className="lg:h-full">
              <img
                src={restaurant.imageUrl || "/placeholder.svg"}
                alt={restaurant.restaurantName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </AspectRatio>

            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                variant={restaurant.isOpen ? "default" : "secondary"}
                className={cn(
                  "font-semibold shadow-sm",
                  restaurant.isOpen ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 text-white",
                )}
              >
                {restaurant.isOpen ? "Open Now" : "Closed"}
              </Badge>
            </div>

            {/* Rating Badge */}
            {restaurant.averageRating !== undefined && (
              <div className="absolute top-3 right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">{restaurant.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                  {restaurant.restaurantName}
                </h3>

                {/* Rating Row */}
                {restaurant.averageRating !== undefined && (
                  <div className="flex items-center gap-3">
                    <StarRating rating={restaurant.averageRating} size="sm" showNumber={false} />
                    <span className="text-sm text-gray-600">({restaurant.averageRating.toFixed(1)})</span>
                  </div>
                )}
              </div>

              {/* Cuisines */}
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {restaurant.cuisines.slice(0, 3).map((cuisine, index) => (
                    <Badge
                      key={cuisine}
                      variant="outline"
                      className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200"
                    >
                      {cuisine}
                    </Badge>
                  ))}
                  {restaurant.cuisines.length > 3 && (
                    <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
                      +{restaurant.cuisines.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{address}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-4 mt-4 border-t border-gray-100">
              {/* View Details Arrow */}
              <div className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200">
                View Details →
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SearchResultCard
