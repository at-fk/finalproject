import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const GlobeIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] text-blue-600 mb-6">
    <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="4" fill="#e0f2fe" />
    <ellipse cx="32" cy="32" rx="18" ry="30" stroke="currentColor" strokeWidth="3" fill="none" />
    <ellipse cx="32" cy="32" rx="30" ry="10" stroke="currentColor" strokeWidth="3" fill="none" />
    <circle cx="32" cy="32" r="2.5" fill="currentColor" />
  </svg>
);

const DatabaseIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] text-green-600 mb-6">
    <ellipse cx="32" cy="16" rx="24" ry="10" fill="#dcfce7" stroke="currentColor" strokeWidth="3" />
    <rect x="8" y="16" width="48" height="32" rx="12" fill="#dcfce7" stroke="currentColor" strokeWidth="3" />
    <ellipse cx="32" cy="48" rx="24" ry="10" fill="#dcfce7" stroke="currentColor" strokeWidth="3" />
    <ellipse cx="32" cy="32" rx="24" ry="10" fill="#dcfce7" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const SearchIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[64px] h-[64px] md:w-[80px] md:h-[80px] lg:w-[100px] lg:h-[100px] text-purple-600 mb-6">
    <circle cx="30" cy="30" r="18" stroke="currentColor" strokeWidth="4" fill="#ede9fe" />
    <rect x="44" y="44" width="10" height="4" rx="2" transform="rotate(45 44 44)" fill="currentColor" />
    <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const featureCards = [
  {
    id: 1,
    title: "Comprehensive\nCoverage",
    description:
      "Access legal info across all EU member states. Always up to date.",
    icon: GlobeIcon,
  },
  {
    id: 2,
    title: "User-Friendly\nSearch",
    description:
      "Quickly find the rules you need with smart filters & intuitive tools",
    icon: SearchIcon,
  },
  {
    id: 3,
    title: "Open & Reliable\nData",
    description:
      "Transparent, trusted,\nand based on verified official sources.",
    icon: DatabaseIcon,
  },
];

const FilterIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[64px] h-[64px] md:w-[70px] md:h-[70px] text-indigo-600">
    <rect x="12" y="16" width="40" height="6" rx="3" fill="#c7d2fe" stroke="currentColor" strokeWidth="2" />
    <rect x="20" y="29" width="24" height="6" rx="3" fill="#c7d2fe" stroke="currentColor" strokeWidth="2" />
    <rect x="28" y="42" width="8" height="6" rx="3" fill="#c7d2fe" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const LightbulbIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[64px] h-[64px] md:w-[70px] md:h-[70px] text-yellow-400">
    <ellipse cx="32" cy="28" rx="16" ry="18" fill="#fef9c3" stroke="currentColor" strokeWidth="2" />
    <rect x="26" y="46" width="12" height="8" rx="3" fill="#fde68a" stroke="currentColor" strokeWidth="2" />
    <rect x="28" y="54" width="8" height="4" rx="2" fill="#fde68a" stroke="currentColor" strokeWidth="2" />
    <path d="M32 10V4M54 28h6M4 28h6M47.5 12.5l4-4M12.5 12.5l-4-4M47.5 43.5l4 4M12.5 43.5l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FolderIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[64px] h-[64px] md:w-[70px] md:h-[70px] text-amber-700">
    <rect x="8" y="20" width="48" height="32" rx="6" fill="#fef3c7" stroke="currentColor" strokeWidth="2" />
    <rect x="8" y="12" width="20" height="16" rx="4" fill="#fde68a" stroke="currentColor" strokeWidth="2" />
    <path d="M44 32l-8 8-4-4-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BellIcon = (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[64px] h-[64px] md:w-[70px] md:h-[70px] text-rose-500">
    <ellipse cx="32" cy="36" rx="18" ry="14" fill="#fee2e2" stroke="currentColor" strokeWidth="2" />
    <rect x="28" y="50" width="8" height="8" rx="4" fill="#fecaca" stroke="currentColor" strokeWidth="2" />
    <path d="M32 12v8M20 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const keyFeatures = [
  {
    title: "Advanced Search",
    description:
      "Find EU regulations by topic, country, date, or type with smart filters.",
    icon: FilterIcon,
  },
  {
    title: "Smart Suggestions",
    description: "Get smart recommendations based on your search.",
    icon: LightbulbIcon,
  },
  {
    title: "Save & Organize",
    description:
      "Bookmark important documents and manage them in custom folders.",
    icon: FolderIcon,
  },
  {
    title: "Real-Time Updates",
    description:
      "Receive notifications when regulations or case law are updated",
    icon: BellIcon,
  },
];

export const HeroSection = (): JSX.Element => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Area */}
      <section
        className="w-full flex justify-center items-center min-h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: "url(https://c.animaapp.com/ma32rn6vyAuY50/img/hero-section.png)" }}
        data-model-id="1:2"
      >
        <div className="w-full max-w-[1440px] flex flex-col items-center px-4 py-12 md:py-20 relative">
          <div className="text-[#edcc17] text-base md:text-lg lg:text-2xl font-['Poppins',Helvetica] mb-4 md:mb-8 text-center">
            Open Source • Reliable • Updated
          </div>
          <div className="flex flex-col-reverse md:flex-row items-center w-full gap-8 md:gap-12 lg:gap-20">
            <div className="flex-1 flex flex-col items-start justify-center text-left">
              <h1 className="font-['Poppins',Helvetica] font-semibold text-4xl md:text-6xl lg:text-[75px] leading-tight mb-4">
                <span className="text-white">Explore</span>
                <span className="text-[#ffd700]"> EU <br className="hidden md:block" />Regulations</span>
                <span className="text-white"> <br className="hidden md:block" />Easily</span>
              </h1>
              <p className="text-white text-lg md:text-2xl lg:text-[35px] mb-8 max-w-[445px]">
                A simple, searchable database for European Laws and regulations
              </p>
              <Link href="/search" passHref legacyBehavior>
                <Button className="bg-[#ffd700] hover:bg-[#e6c300] rounded-[18px] font-['Poppins',Helvetica] font-semibold text-black text-xl md:text-2xl lg:text-[35px] px-8 py-4 md:px-12 md:py-6 w-full max-w-[400px]">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <img
                className="object-contain w-full max-w-[400px] md:max-w-[500px] lg:max-w-[639px] h-auto"
                alt="Hero section girl"
                src="https://c.animaapp.com/ma32rn6vyAuY50/img/hero-section-girl-charecter.png"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Area */}
      <section className="w-full flex justify-center bg-gray-50 py-16 md:py-24">
        <div className="w-full max-w-[1440px] flex flex-col items-center px-4">
          <h1 className="font-['Poppins',Helvetica] font-semibold text-blue-900 text-3xl md:text-4xl lg:text-[50px] mb-12 text-center">
            Why use our Platform?
          </h1>
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center">
            {featureCards.map((card) => (
  <Card
    key={card.id}
    className="flex-1 min-w-[260px] max-w-[409px] w-full h-auto rounded-xl border border-solid shadow-md"
  >
    <CardContent className="flex flex-col items-center justify-center p-8 h-full">
      {card.icon && (
        <span>{card.icon}</span>
      )}
      <h2 className="font-['Poppins',Helvetica] font-semibold text-black text-2xl md:text-3xl text-center whitespace-pre-line mb-4">
        {card.title}
      </h2>
      <p className="font-['Poppins',Helvetica] font-normal text-[#606266] text-lg md:text-xl lg:text-[25px] text-center whitespace-pre-line">
        {card.description}
      </p>
    </CardContent>
  </Card>
))}
          </div>
        </div>
      </section>

      {/* Key Features Area */}
      <section className="bg-indigo-50 w-full flex justify-center py-16 md:py-24">
        <div className="w-full max-w-[1440px] min-h-[400px] px-4">
          <div className="max-w-[1053px] mx-auto">
            <h1 className="text-center font-['Poppins',Helvetica] font-semibold text-black text-3xl md:text-4xl lg:text-[50px] mb-14">
              Key Features
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="border border-solid shadow-md h-auto flex flex-col justify-center"
                >
                  <CardContent className="flex items-start p-6 h-full">
                    <div className="flex-shrink-0 mr-6 flex items-center justify-center">
                      <span>{feature.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <h2 className="font-['Poppins',Helvetica] font-semibold text-gray-900 text-2xl md:text-3xl lg:text-[35px]">
                        {feature.title}
                      </h2>
                      <p className="font-['Poppins',Helvetica] font-normal text-gray-500 text-lg md:text-xl mt-4">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Explore Section */}
      <section className="bg-indigo-100 flex justify-center w-full py-12">
        <div className="container max-w-[1440px] px-4">
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="flex flex-col items-center text-center space-y-6 py-12">
              <h1 className="font-['Poppins',Helvetica] font-semibold text-[#0e4592] text-3xl md:text-5xl max-w-[961px]">
                Ready to Explore EU Regulations?
              </h1>
              <p className="font-['Poppins',Helvetica] font-normal text-[#858688] text-base md:text-lg max-w-[726px]">
                Start your journey today — fast, simple, and free.
              </p>
              <Link href="/search" passHref legacyBehavior>
                <Button className="mt-6 bg-[#ffd700] hover:bg-[#e6c200] text-black font-['Poppins',Helvetica] font-semibold text-xl md:text-2xl lg:text-[35px] h-[60px] md:h-[80px] lg:h-[103px] w-full max-w-[350px] md:max-w-[400px] lg:max-w-[517px] rounded-[18px]">
                  Explore the Database
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#1E3A8A] py-8 flex flex-col items-center text-white mt-0">
        <div className="w-full max-w-[1440px] flex flex-col items-center px-4">
          <h1 className="font-['Poppins',Helvetica] font-semibold text-2xl md:text-3xl lg:text-4xl mb-2 mt-2 text-center">EU Insights</h1>
          <nav className="flex flex-wrap justify-center gap-8 mb-2 text-base md:text-lg">
            <span>About</span>
            <span>Terms</span>
            <span>Privacy</span>
            <span>Contact</span>
          </nav>
          <div className="mb-2 text-center text-sm md:text-base">Open-source educational tool. Not legal advice.</div>
          <div className="text-xs md:text-sm text-center">Copyright © 2025 EURegInsights</div>
        </div>
      </footer>
    </div>
  );
};
