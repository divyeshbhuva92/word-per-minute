import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";

export default function SampleCarousel() {
  const images = [
    "https://img.freepik.com/free-vector/online-testing-banner_107791-3684.jpg?w=1380&t=st=1676983254~exp=1676983854~hmac=a7122b70e172490ebe4e459f5f958d757026adfd241c2ca0bac332f367c77d1a",
    "https://img.freepik.com/premium-vector/people-testing-software-fixing-bugs-hardware-device_186332-605.jpg",
    "https://img.freepik.com/free-vector/seo-ranking-analysis-internet-technology_107791-2380.jpg?t=st=1676960227~exp=1676960827~hmac=73dc1e72c8e8a281aa8846c89f18a7311eef6770e0de1bfed7580ae5cf40b4ea",
    "https://img.freepik.com/free-vector/hand-drawn-business-strategy-with-statistics_52683-76711.jpg?t=st=1676960930~exp=1676961530~hmac=8fe015a60c724643679dcaa6c313f991ea0a40a4ca8dfc4139a93f9cc4bd6ab8",
    "https://img.freepik.com/free-vector/banner-policies-rules-agreement_107791-3232.jpg?t=st=1676960930~exp=1676961530~hmac=f54f2fea599385325041737df4be53fab376870a11d483d36740c96d6fb48925",
  ];

  const slides = images.map((imgUrl) => {
    return (
      <Carousel.Slide key={imgUrl}>
        <Image radius="lg" fit="fill" height={250} src={imgUrl} alt={imgUrl} />
      </Carousel.Slide>
    );
  });
  return (
    <div className="carousel-container">
      <Carousel
        slideSize="30%"
        mx="auto"
        slideGap="md"
        styles={{
          control: {
            "&[data-inactive]": {
              opacity: 0,
              cursor: "default",
            },
          },
        }}
        // withIndicators
        breakpoints={[
          { maxWidth: "md", slideSize: "60%", slideGap: "md" },
          { maxWidth: "sm", slideSize: "90%", slideGap: "md" },
        ]}
        // loop
      >
        {slides}
      </Carousel>
    </div>
  );
}
