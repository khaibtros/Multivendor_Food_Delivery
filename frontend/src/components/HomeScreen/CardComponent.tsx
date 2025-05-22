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
    <div className="border border-gray-300 rounded-lg p-10 flex flex-col items-center md:h-[380px]">
      <img src={IconSrc} alt={heading} className="mb-6 w-12 h-12" />
      <h3 className="text-2xl font-normal leading-10 mb-8 h-[85px] text-center">{heading}</h3>
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
      { heading: "Register", text: "Sign up your restaurant easily." },
      { heading: "Receive Orders", text: "Manage your incoming orders." },
      { heading: "Grow", text: "Expand your business efficiently." },
    ],
  },
  {
    icon: RiderIcon,
    heading: "For Rider",
    ticksList: [
      { heading: "Sign Up", text: "Become a delivery rider." },
      { heading: "Accept Orders", text: "Pick up and deliver orders." },
      { heading: "Earn Money", text: "Make money flexibly." },
    ],
  },
  {
    icon: CustomerIcon,
    heading: "For Customer",
    ticksList: [
      { heading: "Browse Menu", text: "Explore delicious dishes." },
      { heading: "Place Order", text: "Order food quickly." },
      { heading: "Relax", text: "Enjoy your meal stress-free." },
    ],
  },
];

const CardComponent = () => {
  return (
    <div className="mb-12">
      <h2 className="text-center mt-12 mb-10 text-4xl font-medium leading-[60.72px]">
        How It Works
      </h2>
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-[1000px]">
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
