import React, { useRef } from "react";
import { Carousel, Button as AntButton } from "antd";
import { Quote, Star, ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Rahul Sharma",
    role: "Chief Cardiologist",
    review: "CureSync has transformed our clinical operations. The patient record synchronization is flawless and the interface is incredibly intuitive.",
    img: "https://i.pravatar.cc/100?u=dr1"
  },
  {
    name: "Dr. Priya Verma",
    role: "Dental Director",
    review: "The scheduling engine is a game changer. We've reduced patient wait times by 40% since implementing the orchestration layer.",
    img: "https://i.pravatar.cc/100?u=dr2"
  },
  {
    name: "Dr. Amit Singh",
    role: "HOD Internal Medicine",
    review: "Finally, a hospital management system that feels like modern software. Secure, fast, and extremely reliable for enterprise use.",
    img: "https://i.pravatar.cc/100?u=dr3"
  },
  {
    name: "Dr. Sneha Kapoor",
    role: "Radiology Head",
    review: "The AI-driven insights have significantly improved our diagnostic accuracy and reporting speed. Highly recommended for modern clinics.",
    img: "https://i.pravatar.cc/100?u=dr4"
  },
  {
    name: "Dr. Vikram Malhotra",
    role: "Orthopedic Surgeon",
    review: "Managing surgical schedules and follow-ups has never been easier. The platform is truly built for high-throughput environments.",
    img: "https://i.pravatar.cc/100?u=dr5"
  }
];

const Testimonials = () => {
  const carouselRef = useRef();

  return (
    <section id="testimonials" className="relative px-8 md:px-16 py-32 bg-slate-50 overflow-hidden border-b border-slate-100">
      <div className="container mx-auto relative z-10">

        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 mb-4">Institutional Trust</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 leading-[0.9] uppercase">
              Trusted by <br />
              <span className="text-sky-500">Visionaries</span>.
            </h2>
          </div>

          <div className="flex gap-2 mb-4">
            <AntButton
              onClick={() => carouselRef.current.prev()}
              className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
              icon={<ArrowLeft size={20} />}
            />
            <AntButton
              onClick={() => carouselRef.current.next()}
              className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-sky-500 transition-all shadow-xl shadow-slate-200 border-none"
              icon={<ArrowRight size={20} />}
            />
          </div>
        </div>

        <div className="relative">
          <Carousel
            ref={carouselRef}
            autoplay
            autoplaySpeed={5000}
            infinite
            slidesToShow={3}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 640, settings: { slidesToShow: 1 } }
            ]}
            dots={false}
            className="testimonial-carousel"
          >
            {testimonials.map((item, index) => (
              <div key={index} className="px-3 pb-12">
                <div className="bg-white/40 backdrop-blur-xl p-12 border border-white/50 transition-all duration-500 hover:bg-slate-900 group rounded-[3rem] shadow-sm hover:shadow-2xl h-full flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-10">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="text-sky-500 fill-sky-500" />)}
                    </div>

                    <div className="relative mb-12">
                      <p className="text-lg font-bold leading-relaxed text-slate-900 group-hover:text-white transition-colors italic">
                        "{item.review}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-10 border-t border-white/20 group-hover:border-white/10 transition-colors">
                    <img src={item.img} className="w-12 h-12 rounded-xl border border-white/30 group-hover:border-white/20 transition-all" alt={item.name} />
                    <div>
                      <h4 className="font-black text-slate-900 group-hover:text-white text-xs leading-none mb-1 uppercase tracking-tighter transition-colors">{item.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 group-hover:text-slate-500 uppercase tracking-widest transition-colors">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .testimonial-carousel .slick-track {
          display: flex !important;
        }
        .testimonial-carousel .slick-slide {
          height: inherit !important;
        }
        .testimonial-carousel .slick-slide > div {
          height: 100% !important;
        }
      `}} />
    </section>
  );
};

export default Testimonials;









