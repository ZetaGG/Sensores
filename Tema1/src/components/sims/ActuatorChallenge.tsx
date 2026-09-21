import { useEffect, useRef, useState } from 'react';
import { ACTUATOR_CHALLENGES, SELECTION_CRITERIA } from '../../data/actuadores.ts';
import { isChallengeCorrect } from './challengeLogic.ts';

export default function ActuatorChallenge() {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const challenge = ACTUATOR_CHALLENGES[challengeIndex];
  const correct = selectedId !== null && isChallengeCorrect(challenge, selectedId);

  useEffect(() => {
    if (hasNavigated.current) window.requestAnimationFrame(() => promptRef.current?.focus());
    hasNavigated.current = true;
  }, [challengeIndex]);

  const next = () => {
    setChallengeIndex((current) => (current + 1) % ACTUATOR_CHALLENGES.length);
    setSelectedId(null);
    setSubmitted(false);
  };

  return (
    <div className="panel challenge" style={{ '--c': 'var(--act-sel)' } as React.CSSProperties}>
      <div className="panel-tag">
        <span>SELECCIONA EL ACTUADOR CORRECTO</span>
        <span>RETO {challengeIndex + 1}/{ACTUATOR_CHALLENGES.length}</span>
      </div>
      <div className="panel-inner col" style={{ gap: 16 }}>
        <div className="challenge-prompt">
          <span className="mono-label">SITUACIÓN INDUSTRIAL</span>
          <h3 ref={promptRef} tabIndex={-1} style={{ margin: 0 }}>{challenge.situation}</h3>
          <p className="text-dim" style={{ margin: 0, maxWidth: 'none' }}>{challenge.detail}</p>
        </div>

        <div className="challenge-options" role="radiogroup" aria-label="Opciones de actuador">
          {challenge.options.map((option) => {
            const isSelected = selectedId === option.id;
            const isCorrect = submitted && option.id === challenge.correct;
            const isWrong = submitted && isSelected && !isCorrect;
            return (
              <label
                key={option.id}
                className={`challenge-option${isSelected ? ' is-selected' : ''}${isCorrect ? ' is-correct' : ''}${isWrong ? ' is-wrong' : ''}`}
              >
                <input type="radio" name={`actuator-challenge-${challenge.id}`} value={option.id} checked={isSelected} disabled={submitted} onChange={() => setSelectedId(option.id)} />
                <span className="mono">{String.fromCharCode(65 + challenge.options.indexOf(option))}</span>
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>

        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button className="btn is-active" style={{ '--c': 'var(--act-sel)' } as React.CSSProperties} disabled={!selectedId || submitted} onClick={() => setSubmitted(true)}>
            COMPROBAR RESPUESTA
          </button>
          {submitted && (
            <button className="btn" style={{ '--c': 'var(--act-sel)' } as React.CSSProperties} onClick={next}>
              SIGUIENTE SITUACIÓN →
            </button>
          )}
        </div>

        {submitted && (
          <div className={`challenge-feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status" aria-live="polite">
            <strong>{correct ? '✓ Elección adecuada' : '✗ Revisa la selección'}</strong>
            <p>{correct ? challenge.explanation : `La opción recomendada es ${challenge.options.find((option) => option.id === challenge.correct)?.label}. ${challenge.explanation}`}</p>
            <div className="challenge-criteria">
              {challenge.criteria.map((criterion) => (
                <span key={criterion} className="chip">{SELECTION_CRITERIA.find((item) => item.id === criterion)?.title}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
