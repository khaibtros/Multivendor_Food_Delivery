import Tick from "./Tick"; 

import CustomerIcon from "../../assets/icons/CustomerIcon.svg";
import RestaurantIcon from "../../assets/icons/RestuarantIcon.svg";
import RiderIcon from "../../assets/icons/RiderIcon.svg";

type TickItem = {
  heading: string;
  text: string;
};

type CardProps = {
  IconSrc: string;
  heading: string;
  ticksList: TickItem[];
};

const Card = ({ IconSrc, heading, ticksList }: CardProps) => {
  return (
    <div className="border border-gray-300 rounded-lg p-8 flex flex-col items-center max-w-[320px] w-full">
      <img src={IconSrc} alt={heading} className="mb-4 w-12 h-12" />
      <h3 className="text-xl font-semibold leading-tight mb-4 text-center break-words w-full" style={{wordBreak: 'break-word'}}>{heading}</h3>
      <div className="w-full">
        {ticksList.map((item, idx) => (
          <Tick key={idx} heading={item.heading} text={item.text} />
        ))}
      </div>
    </div>
  );
};

const functionalityList = [
  {
    icon: RestaurantIcon,
    heading: "For Restaurant",
    ticksList: [
      { heading: "Menu Management", text: "Manage menu and dishes" },
      { heading: "Order Tracking", text: "Track orders in real time" },
      { heading: "Register restaurant", text: "Register new restaurant" },
      { heading: "Sales Report", text: "Revenue reports and statistics" },
    ],
  },
  {
    icon: CustomerIcon,
    heading: "For Customer",
    ticksList: [
      { heading: "Account", text: "Login and manage profile." },
      { heading: "Order History", text: "View order history and print invoices." },
      { heading: "Review & Pay", text: "Review and flexible payment." },
      { heading: "Chat Support", text: "Chat with sales staff." },
    ],
  },
  {
    icon: RestaurantIcon,
    heading: "For Sales Staff",
    ticksList: [
      { heading: "Order Management", text: "Update order status" },
      { heading: "Inventory Control", text: "Manage dish inventory" },
      { heading: "Order List", text: "View & confirm orders" },
      { heading: "Customer Support", text: "Support customers & shippers" },
    ],
  },
  {
    icon: RiderIcon,
    heading: "For Shipper",
    ticksList: [
      { heading: "Delivery Orders", text: "View orders to deliver" },
      { heading: "Status Update", text: "Update delivery status" },
      { heading: "Completion", text: "Confirm delivery completion" },
    ],
  },
];

const CardComponent = () => {
  return (
    <div className="mb-12">
      <h2 className="text-center mt-12 mb-10 text-4xl font-medium leading-[60.72px]">
        How It Works
      </h2>
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-[1300px]">
        {functionalityList.map((item, index) => (
          <Card
            key={index}
            IconSrc={item.icon}
            heading={item.heading}
            ticksList={item.ticksList}
          />
        ))}
      </div>
    </div>
  );
};

export default CardComponent;