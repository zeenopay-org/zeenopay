import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/css/HeroSlider.css";
import Slider1 from "../../assets/Images/HeroSliderImages/Slider1.jpeg"
import Slider2 from "../../assets/Images/HeroSliderImages/Slider2.jpeg"
import Slider3 from "../../assets/Images/HeroSliderImages/Slider3.jpeg"
import Slider4 from "../../assets/Images/HeroSliderImages/Slider4.jpeg"
import Slider5 from "../../assets/Images/HeroSliderImages/Slider5.jpeg"
import Slider6 from "../../assets/Images/HeroSliderImages/Slider6.jpeg"
import Slider7 from "../../assets/Images/HeroSliderImages/Slider7.jpeg"
import Slider8 from "../../assets/Images/HeroSliderImages/Slider8.jpeg"


function HeroSlider() {
  const slides = [
    { id: 1, icon: Slider1 },
    { id: 2, icon: Slider2 },
    { id: 3, icon: Slider3 },
    { id: 4, icon: Slider4 },
    { id: 5, icon: Slider5 },
    { id: 6, icon: Slider6 },
    { id: 7, icon: Slider7 },
    { id: 8, icon: Slider8 },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "180px",
    focusOnSelect: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "100px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "1px",
        },
      },
    ],
  };

  return (
    <div className="slider-container bg-customBlue h-[200px] sm:h-[500px] flex justify-center items-center px-4 sm:px-8 relative z-[-1]">
      <Slider {...settings} className="w-full max-w-[1080px]">
        {slides.map((slide) => (
          <div key={slide.id} className=" sm:p-6 flex justify-center items-center">
            <div className="bg-transparent w-full max-w-[750px] h-[300px] md:h-[360px] relative flex flex-col justify-center items-center text-white px-4 sm:px-6 z-[-1]">
              <div className="flex justify-center items-center w-full h-full z-[-1]">
                <img
                  src={slide.icon}
                  alt={slide.title}
                  className="w-full h-[200px] md:h-[120%] object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroSlider;
