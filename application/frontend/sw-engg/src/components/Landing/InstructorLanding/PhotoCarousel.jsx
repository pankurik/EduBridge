import React from 'react';
import Slider from 'react-slick';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import image1 from '../../../images/eduBridge Carousel/1.png';
import image2 from '../../../images/eduBridge Carousel/2.png';
import image3 from '../../../images/eduBridge Carousel/3.png';
import image4 from '../../../images/eduBridge Carousel/4.png';
import image5 from '../../../images/eduBridge Carousel/5.png';
import image6 from '../../../images/eduBridge Carousel/6.png';
import image7 from '../../../images/eduBridge Carousel/7.png';
import image8 from '../../../images/eduBridge Carousel/8.png';
import image9 from '../../../images/eduBridge Carousel/9.png';
import image10 from '../../../images/eduBridge Carousel/10.png';
import './InstructorLandingPage.css';

const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: 25, zIndex: 1 }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    );
  };

const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: 25, zIndex: 1 }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    );
  };

const photos = [
    { url: image1, alt: 'Image 1' },
    { url: image2, alt: 'Image 2' },
    { url: image3, alt: 'Image 3' },
    { url: image4, alt: 'Image 4' },
    { url: image5, alt: 'Image 5' },
    { url: image6, alt: 'Image 6' },
    { url: image7, alt: 'Image 7' },
    { url: image8, alt: 'Image 8' },
    { url: image9, alt: 'Image 9' },
    { url: image10, alt: 'Image 10' }
];

const PhotoCarousel = () => {
    const settings = {
        infinite: true,
        speed: 800,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            { breakpoint: 768, settings: { slidesToShow: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <Slider {...settings}>
            {photos.map((photo, index) => (
                <div key={index} className="photo-slide">
                    <img src={photo.url} alt={photo.alt} className="photo-image" />
                </div>
            ))}
        </Slider>
    );
};

export default PhotoCarousel;
