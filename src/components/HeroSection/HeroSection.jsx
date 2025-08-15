import { Carousel } from "antd";

import "./HeroSection.css";

const HeroSection = () => {
  // Default slides if no heroData is provided
  const defaultSlides = [
    {
      id: 1,
      title: "Unleash Your Style",
      subtitle: "Trendy Fashion Starts Here",
      description:
        "Discover the latest trends and express your unique personality with our curated collection",
      image: "/img/LP_NIKE_FOOTBALL_KV.webp",
      cta: "Shop New Arrivals",
    },
    {
      id: 2,
      title: "Bold & Beautiful",
      subtitle: "Fashion for the Fearless",
      description:
        "Step into confidence with pieces designed for those who dare to stand out",
      image: "/img/LP_NIKE_TRAIN_KV.webp",
      cta: "Explore Collection",
    },
    {
      id: 3,
      title: "Summer Vibes",
      subtitle: "Fresh Looks for Every Day",
      description:
        "Light, breezy, and effortlessly chic - perfect for the season ahead",
      image: "/img/LP_NIKE_RUNNING_KV.webp",
      cta: "Shop Summer",
    },
  ];

  const slides = defaultSlides;
  console.log(
    "Slides with images:",
    slides.map((slide) => ({
      id: slide.id,
      title: slide.title,
      image: slide.image,
    }))
  );

  const handleCTAClick = (slide) => {
    console.log("CTA clicked for:", slide);
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <Carousel
          autoplay
          autoplaySpeed={5000}
          dots={{ className: "hero-carousel-dots" }}
          arrows
          pauseOnHover
          fade
          className="hero-carousel"
        >
          {slides.map((slide) => (
            <div key={slide.id} className="hero-slide">
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "114%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 0,
                }}
              />

              <div className="hero-overlay"></div>
              <div className="hero-content">
                <div className="hero-text">
                  <h2 className="hero-subtitle animate-fade-in-up">
                    {slide.subtitle}
                  </h2>
                  <h1 className="hero-title animate-fade-in-up">
                    {slide.title}
                  </h1>
                  <p className="hero-description animate-fade-in-up">
                    {slide.description}
                  </p>
                  <button
                    className="hero-cta animate-fade-in-up"
                    onClick={() => handleCTAClick(slide)}
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default HeroSection;
