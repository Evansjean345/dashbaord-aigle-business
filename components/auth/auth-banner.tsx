import {Carousel, CarouselApi, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {useEffect, useState} from "react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import {Image} from "@heroui/react";

const slides = [
    {
        title: "Inscrivez-vous maintenant",
        description: "Profitez d'une plateforme rapide, sécurisée et accessible partout.",
        image: "/onboarding/onboarding3.png",
    },
    {
        title: "Rejoignez l'innovation",
        description: "Découvrez des services avancés pour optimiser vos finances.",
        image: "/onboarding/onboarding2.png",
    },
    {
        title: "Boostez vos revenus",
        description: "Optimisez paiements, transferts et gestion grâce à Aigle Business.",
        image: "/onboarding/onboarding1.png",
    },
];

export const AuthBanner = () => {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        // Set initial state and add listener for updates
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => setCurrent(api.selectedScrollSnap()));
    }, [api]);

    const buttonBaseClass = "h-3 rounded-full transition-all duration-300";

    return (
        <div className="hidden lg:block bg-gray-100 dark:bg-gray-800">
            <Carousel
                setApi={setApi}
                className="h-full"
                plugins={[
                    Autoplay({playOnInit: true, delay: 5000}),
                    Fade(),
                ]}
            >
                <CarouselContent>
                    {slides.map((item, index) => (
                        <CarouselItem key={index} className="relative w-full h-full">
                            <Image
                                className="h-screen w-screen object-cover rounded-none z-0 brightness-[.95] dark:brightness-[.85]"
                                src={item.image}
                                alt={item.title}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation Dots */}
                <div className="absolute bottom-10 w-full flex gap-2 mb-6 justify-center">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`${buttonBaseClass} ${current === index ? "bg-blue-700 w-9" : "bg-white/70 w-4"}`}
                            onClick={() => api?.scrollTo(index)}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    );
};
