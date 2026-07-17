import type { Education, Experience } from '../../../shared/types';
import { useAdminUI } from '../../context/AdminUIContext';

interface JourneyCardsProps {
  education: Education[];
  experiences: Experience[];
  /** Show experience highlight bullets (About page) or keep it compact (Home). */
  detailed?: boolean;
}

/** Side-by-side Education / Work Experience timeline cards. */
export function JourneyCards({ education, experiences, detailed }: JourneyCardsProps) {
  const { editFor } = useAdminUI();
  const editEducation = editFor('education');
  const editExperiences = editFor('experiences');

  return (
    <div className="grid-2">
      <div className="card journey-card">
        <div className="journey-head">
          <div className="icon-circle">🎓</div>
          <h3>Education</h3>
          {editEducation && (
            <button className="edit-chip" onClick={editEducation}>
              ✎ Edit
            </button>
          )}
        </div>
        {education.map((edu) => (
          <div className="journey-item" key={edu.id}>
            <div className="period">{edu.period}</div>
            <h4>{edu.institution}</h4>
            <div className="detail">{edu.degree}</div>
            {detailed && edu.detail && <div className="detail">{edu.detail}</div>}
          </div>
        ))}
      </div>
      <div className="card journey-card">
        <div className="journey-head">
          <div className="icon-circle">💼</div>
          <h3>Work Experience</h3>
          {editExperiences && (
            <button className="edit-chip" onClick={editExperiences}>
              ✎ Edit
            </button>
          )}
        </div>
        {experiences.map((exp) => (
          <div className="journey-item" key={exp.id}>
            <div className="period">
              {exp.period} · {exp.location}
            </div>
            <h4>{exp.company}</h4>
            <div className="detail">{exp.role}</div>
            {detailed && exp.highlights.length > 0 && (
              <ul>
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
