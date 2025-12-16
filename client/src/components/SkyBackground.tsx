export default function SkyBackground({ imageUrl }: { imageUrl: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/35 to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,.18),transparent_45%),radial-gradient(circle_at_70%_30%,rgba(167,139,250,.16),transparent_50%)]" />
    </>
  );
}
