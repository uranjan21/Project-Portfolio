import type { PricingPlan } from '../../types/portfolio';
import { useAdminUI } from '../../context/AdminUIContext';
import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';

/**
 * Dark pricing band. Hidden for visitors until real plans are published;
 * admins always see it (with a prompt to add plans).
 */
export function PricingBand({ pricing }: { pricing: PricingPlan[] }) {
  const { editFor } = useAdminUI();
  const onEdit = editFor('pricing');
  if (pricing.length === 0 && !onEdit) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="band">
          <div className="section-head">
            <div>
              <span className="eyebrow">Pricing Table</span>
              <h2>
                My <span className="accent">Pricing Model</span>
              </h2>
            </div>
            <div className="head-actions">
              {onEdit && (
                <button className="edit-chip" onClick={onEdit}>
                  <Icon name="edit" size={14} /> Edit
                </button>
              )}
              <Pill to="/contact" variant="amber">
                Get Started
              </Pill>
            </div>
          </div>
          {pricing.length === 0 ? (
            <p>No public pricing yet — add your real plans from this Edit button. Visitors won’t see this section until you do.</p>
          ) : (
            <div className="pricing-grid">
              {pricing.map((plan) => (
                <div className={`price-card${plan.highlighted ? ' highlighted' : ''}`} key={plan.id}>
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-price">
                    {plan.price} <span className="unit">{plan.unit}</span>
                  </div>
                  <ul>
                    {plan.features.map((f, i) => (
                      <li key={i}>
                        <Icon name="check" size={15} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
