import React from "react";
import { useNavigate } from "react-router-dom";

const Info: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center text-center gap-[20px] w-[80%] my-[80px] mx-auto"
    >
      <div>
        <h1
          className="font-bold text-[#2e2e2e] leading-[1.2]"
          style={{
            fontSize: "32px",
          }}
        >
          Connect with your customers today
        </h1>
      </div>

      <div>
        <p className="text-[#777777] text-[18px] max-w-[600px]">
          Join our platform to grow your restaurant business 
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-[20px]">
        <button
          className="bg-[#4caf50] text-white px-6 py-2 rounded hover:bg-[#43a047]"
          onClick={() => navigate("/manage-restaurant")}
        >
          Register Restaurant
        </button>
        
        
      </div>
    </div>
  );
};

export default Info;