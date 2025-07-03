import React from "react";
import Heading from "../Heading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ForThePeople() {
  const testimonials = [
    {
      id: 1,
      content:
        "Now I don't care about football, I always hate it. A great quiver now, in the sauce of God's property. I am worried about my children. No Lacinia pulvinar policy. Until the end of the flight, the airline is not going to be able to finance the members of the group. It is important to drink at the borders of the land.",
      author: "Amanda Carol",
      role: "Designer",
      profilePicture: "./images/browse_one.png",
    },
    {
      id: 2,
      content:
        "Now I don't care about football, I always hate it. A great quiver now, in the sauce of God's property. I am worried about my children. No Lacinia pulvinar policy. Until the end of the flight, the airline is not going to be able to finance the members of the group. It is important to drink at the borders of the land.",
      author: "John Doe",
      role: "Developer",
      profilePicture: "./images/browse_two.png",
    },
    {
      id: 3,
      content:
        "Now I don't care about football, I always hate it. A great quiver now, in the sauce of God's property. I am worried about my children. No Lacinia pulvinar policy. Until the end of the flight, the airline is not going to be able to finance the members of the group. It is important to drink at the borders of the land.",
      author: "Jane Smith",
      role: "Product Manager",
      profilePicture: "./images/browse_three.png",
    },
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[16px] h-[16px] rounded-full bg-white"></div>
    ),
  };

  return (
    <div className="forThePeople bg-brown-500 mx-4 py-10 sm:py-20 mb-10 mt-20">
      <div className="container mx-auto">
        <p className="text-center pb-4">Testimonial</p>
        <Heading color="text-brown-900">Shop By Collection</Heading>
        <div className="flex justify-center py-8">
          <img src="/images/comma.png" alt="images" className="w-14" />
        </div>
        <div className="max-w-6xl text-center mx-auto sm:px-4">
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4">
                <div className="pb-8">
                  <p className="text-gray-500 text-md sm:text-lg  mb-6">
                    "{testimonial.content}"
                  </p>
                  <div className=" pt-4 flex justify-center items-center">
                    <div className="w-[80px] h-[80px] me-5">
                      <img
                        src={testimonial.profilePicture}
                        alt="testimonial img"
                        className="w-full h-full  rounded-full "
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-start text-xl text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-gray-600 text-start text-lg">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default ForThePeople;
