import { Carousel } from "antd";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const navigate = useNavigate();

  // Default slides with Vietnamese content
  const defaultSlides = [
    {
      id: 1,
      title: "Thể Hiện Phong Cách Của Bạn",
      subtitle: "Thời Trang Xu Hướng Bắt Đầu Từ Đây",
      description:
        "Khám phá những xu hướng mới nhất và thể hiện cá tính độc đáo của bạn với bộ sưu tập được tuyển chọn",
      image: "/img/LP_NIKE_FOOTBALL_KV.webp",
      cta: "Mua Sắm Hàng Mới",
      ctaPath: "/new-arrivals",
    },
    {
      id: 2,
      title: "Táo Bạo & Quyến Rũ",
      subtitle: "Thời Trang Cho Người Dũng Cảm",
      description:
        "Bước vào sự tự tin với những món đồ được thiết kế cho những ai dám nổi bật",
      image: "/img/LP_NIKE_TRAIN_KV.webp",
      cta: "Khám Phá Bộ Sưu Tập",
      ctaPath: "/collections",
    },
    {
      id: 3,
      title: "Không Khí Mùa Hè",
      subtitle: "Phong Cách Tươi Mới Cho Mọi Ngày",
      description:
        "Nhẹ nhàng, thoáng mát và thanh lịch một cách tự nhiên - hoàn hảo cho mùa sắp tới",
      image: "/img/LP_NIKE_RUNNING_KV.webp",
      cta: "Mua Sắm Mùa Hè",
      ctaPath: "/summer-collection",
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
    if (slide.ctaPath) {
      navigate(slide.ctaPath);
    }
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
