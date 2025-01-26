// components/Card.tsx

export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[rgba(44,175,204,0.25)] rounded-16px shadow-custom backdrop-blur-12px border border-[rgba(44,175,204,0.5)] p-6">
            {children}
        </div>
    );
}
