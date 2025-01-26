import { useEffect, useState } from 'react';

interface PageBackgroundProps {
    children: React.ReactNode;
}

export default function PageBackground({ children }: PageBackgroundProps) {
    const images = [
        '/img/course_1.jpg',
        '/img/course_2.jpg',
        '/img/course_3.jpg',
        '/img/course_4.jpg',
        '/img/course_5.jpg',
        '/img/course_6.jpg',
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);

    // Preload images
    useEffect(() => {
        const preloadImages = async () => {
            await Promise.all(
                images.map((src) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.src = src;
                        img.onload = resolve;
                    });
                })
            );
            setLoaded(true);
        };

        preloadImages();
    }, [images]);

    useEffect(() => {
        if (loaded) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 8000); // 8 seconds for each image

            return () => clearInterval(interval); // Clean up the interval on component unmount
        }
    }, [images.length, loaded]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[3000ms] ease-in-out ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                        backgroundImage: `url(${image})`,
                    }}
                ></div>
            ))}
            <div className="absolute inset-0 bg-black opacity-70"></div>
            <div className="relative z-10 flex flex-col flex-grow overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
