export default function StarField() {
  const stars = Array.from({ length: 26 });

  return (
    <div className="absolute inset-0 opacity-60" aria-hidden>
      {stars.map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 19) % 100}%`,
            animation: `twinkle ${2 + (i % 5)}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
