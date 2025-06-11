import DoneIcon from "@mui/icons-material/Done";

function FAQ() {
  return (
    <div className="flex flex-col mt-12 mb-28 w-full px-4 md:px-20">
      <div className="w-full md:w-5/6 mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">
          Order food online from the best restaurants and shops on Enatega
        </h2>
        <p className="text-base md:text-lg text-gray-500 font-light my-6">
          Are you hungry? Had a long and busy day? Then Enatega is the right place for you! Enatega, offers you a long
          and detailed <b>list of the best restaurants near you</b>. Whether it is a delicious Pizza, Burger, Japanese
          or any kind of Fast Food you are craving, Enatega has an extensive roaster restaurants available for you to <b>order food online with home delivery</b>.
        </p>

        <h2 className="text-2xl md:text-4xl font-bold mb-4">What's new?</h2>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <DoneIcon className="text-blue-500 mt-1 mr-2" />
            <span>Selection of premium restaurants, all kind of cuisines.</span>
          </li>
          <li className="flex items-start">
            <DoneIcon className="text-blue-500 mt-1 mr-2" />
            <span>High quality delivery service.</span>
          </li>
          <li className="flex items-start">
            <DoneIcon className="text-blue-500 mt-1 mr-2" />
            <span>Live chat feature to give App users instant help when they need it.</span>
          </li>
          <li className="flex items-start border-b pb-2 mb-4">
            <DoneIcon className="text-blue-500 mt-1 mr-2" />
            <span>
              NEW: Enatega grocery delivery! Discover the best shops, pharmacies, bakeries and more near you.
            </span>
          </li>
        </ul>

        <h3 className="text-xl md:text-2xl font-bold mb-4">Frequently Asked Questions</h3>

        <h4 className="text-lg md:text-xl font-bold mb-2">How can I get enatega delivery?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          To get enatega delivery, simply locate the restaurants near you by typing in your address, browse through a
          variety of restaurants and cuisines, check menus and prices, choose your dishes and add them to the basket.
          Now you only need to checkout and make the payment. Soon your delicious food will arrive at your doorstep!
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">How can I order food?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          <b>Find a restaurant.</b> Enter your delivery address in the location form to see all the places that deliver
          to your location. It can be your home, office, a hotel or even parks! <br />
          <b>Choose your dishes.</b> Browse the menu of the chosen restaurant, select your dishes and add them to your
          basket. When you are done, press the "Checkout" button. <br />
          <b>Checkout & Payment.</b> Check your order, payment method selection and exact delivery address. Simply follow
          the checkout instructions from there. <br />
          <b>Delivery.</b> We will send you an email and SMS confirming your order and delivery time. Sit back, relax and
          wait for piping hot food to be conveniently delivered to you!.
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">Does enatega deliver 24 hours?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          Yes, enatega in Pakistan delivers 24 hours. However, many restaurants may be unavailable for a late night
          delivery. Please check which places in Pakistan deliver to you 24 hours by using your address.
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">Can you pay cash for enatega?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          Yes, you can pay cash on delivery for enatega in Pakistan.
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">How can I pay enatega online?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          You can pay online while ordering at enatega Pakistan by using a credit or debit card or PayPal.
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">Can I order enatega for someone else?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          Yes, enatega Pakistan allows you to place an order for someone else. During checkout, just update the name
          and delivery address of the person you're ordering for. Please keep in mind that if the delivery details are
          not correct and the order cannot be delivered, we won't be able to process a refund.
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">How much does enatega charge for delivery?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          Delivery fee charged by enatega in Pakistan depends on many operational factors, most of all - location and a
          restaurant you are ordering from. You can always check the delivery fee while forming your order. Besides, you
          can filter the restaurants by clicking on "Free Delivery" icon on the top of your restaurants listing.
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">What restaurants let you order online?</h4>
        <p className="text-base text-gray-500 font-light mb-6">
          There are hundreds of restaurants on enatega Pakistan that let you order online. For example, KFC, McDonald's,
          Pizza Hut, OPTP, Hardee's, Domino's, Kababjees and many-many more! In order to check all the restaurants near
          you that deliver, just type in your address and discover all the available places.
        </p>

        <h4 className="text-lg md:text-xl font-bold mb-2">Does enatega have minimum order?</h4>
        <p className="text-base text-gray-500 font-light">
          Yes, many restaurants have a minimum order. The minimum order value depends on the restaurant you order from
          and is indicated during your ordering process.
        </p>
      </div>
    </div>
  );
}

export default FAQ;
