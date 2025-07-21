import { useState } from "react";
import pic1 from "../../assets/about.webp";
import pic2 from "../../assets/mission.webp";
import pic3 from "../../assets/why.webp";
import pic4 from "../../assets/start.webp";
import "./index.css";

const cards = [
  {
    img: pic1,
    alt: "About",
    title: "About",
    bg: "#eeeede",
    content: `At DnsTitle, we believe that creating an online presence should be simple, accessible, and free. Whether you're a developer, entrepreneur, or creative professional, our platform provides free subdomains to help you bring your ideas to life—without hidden costs or complicated setups.`,
  },
  {
    img: pic2,
    alt: "Our Mission",
    title: "Our Mission",
    bg: "#F5F5DC",
    content: `Our goal is to empower individuals and businesses by offering a seamless way to establish an online identity. We understand the importance of having a unique and reliable web address, and we make it easy for you to claim one, instantly.`,
  },
  {
    img: pic3,
    alt: "Why Choose DnsTitle?",
    title: "Why Choose DnsTitle?",
    bg: "#F5F5DC",
    isList: true,
    list: [
      "100% Free, Forever – No subscriptions, no hidden fees.",
      "Instant Activation – Get your subdomain up and running in seconds.",
      "Reliable & Secure – Optimized for performance and stability.",
      "Customizable & Versatile – Perfect for personal websites, portfolios, startups, and experimental projects.",
      "User-Friendly – No technical expertise required; just choose your subdomain and start using it.",
    ],
  },
  {
    img: pic4,
    alt: "Get Started Today",
    title: "Get Started Today",
    bg: "#F5F5DC",
    content: `DnsTitle is a simple and reliable tool that lets you claim a free subdomain instantly. Whether you're testing an idea, sharing your portfolio, or launching something new, it’s the easiest way to get online—no complexity, no hidden fees.`,
  },
];

export default function CardGrid() {
  const [expanded, setExpanded] = useState(Array(cards.length).fill(false));

  const toggleCard = (index: number) => {
    const updated = [...expanded];
    updated[index] = !updated[index];
    setExpanded(updated);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 place-items-center mt-20 px-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="text-center w-full max-w-md rounded font-bold shadow bg-opacity-90"
          style={{ backgroundColor: card.bg }}
        >
          <img
            src={card.img}
            className="w-full h-60 object-cover rounded-t"
            alt={card.alt}
            loading="lazy"
          />
          <h1 className="text-3xl underline my-4">{card.title}</h1>
          {card.isList ? (
            <div className="px-6 pb-4 text-[16px] font-normal text-left">
              <ul
                className={`list-disc pl-4 pr-4 transition-height ${
                  expanded[i] ? "max-h-[500px]" : "max-h-[96px]"
                }`}
              >
                {card.list.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
              <button
                className="text-blue-600 mt-2 text-sm underline"
                onClick={() => toggleCard(i)}
              >
                {expanded[i] ? "See Less" : "See More"}
              </button>
            </div>
          ) : (
            <div className="px-6 pb-4 text-[16px] font-normal text-left">
              <div
                className={`transition-height ${
                  expanded[i] ? "max-h-[500px]" : "max-h-[96px]"
                }`}
              >
                <p>{card.content}</p>
              </div>
              <button
                className="text-blue-800 mt-2 text-sm underline"
                onClick={() => toggleCard(i)}
              >
                {expanded[i] ? "See Less" : "See More"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
