import { Restaurant } from "@/types";
import { CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { Dot } from "lucide-react";


type Props = {
  restaurant: Restaurant
}

const RestaurantInfo = ({restaurant}: Props) => {
     return(
       <Card className="border-sla">
          <CardHeader>
            <CardTitle classname="text-3xl font-bold tracking-tight">
                 {restaurant.restaurantName}
            </CardTitle>
            <CardDecription>
                {restaurant.city}, {restaurant.country}
            </CardDecription>
          </CardHeader>
          <CardContent className="flex">
            {restaurant.cuisines.map((item, index)=>(
               <span className="flex">
                  <span>{item}</span>
                  {index < restaurant.cuisines.length -1 && <Dot />}
               </span>
            ))}
          </CardContent>
       </Card> 
     );
};

export default RestaurantInfo;