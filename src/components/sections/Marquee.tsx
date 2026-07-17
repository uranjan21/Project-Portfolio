import { usePortfolio } from '../../context/PortfolioContext';

/** Tilted amber ticker of service names, as in the reference design. */
export function Marquee() {
  const { data } = usePortfolio();
  if (!data || data.services.length === 0) return null;

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <span key={copy}>
            {data.services.map((s) => (
              <span key={s.id}>{s.title}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
