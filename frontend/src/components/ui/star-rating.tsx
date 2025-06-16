import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showNumber?: boolean
  className?: string
}

const StarRating = ({ rating, maxRating = 5, size = "md", showNumber = true, className }: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const isFilled = index < Math.floor(rating)
          const isHalfFilled = index < rating && index >= Math.floor(rating)

          return (
            <div key={index} className="relative">
              <Star className={cn(sizeClasses[size], "text-gray-300")} fill="currentColor" />
              {(isFilled || isHalfFilled) && (
                <Star
                  className={cn(sizeClasses[size], "absolute top-0 left-0 text-yellow-400")}
                  fill="currentColor"
                  style={{
                    clipPath: isHalfFilled ? `inset(0 ${100 - (rating - Math.floor(rating)) * 100}% 0 0)` : undefined,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      {showNumber && (
        <span className={cn("font-medium text-gray-700", textSizeClasses[size])}>{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

export default StarRating