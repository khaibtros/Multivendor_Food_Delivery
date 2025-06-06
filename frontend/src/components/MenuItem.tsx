import { Card, CardContent, CardHeader } from "@mui/material";
import { MenuItem } from "../types";

type Props ={
  menuItem: MenuItem;
  addTOCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
    return (
        <Card className="cursor-poiter" onClick={addToCart}>
           <CardHeader>
              <CardTitle>{menuItem.name}</CardTitle>
           </CardHeader>
           <CardContent className="font-bold">
             ${(menuItem.price / 100).toFixed(2)}
           </CardContent>
        </Card>
    );
};

export default MenuItem;
