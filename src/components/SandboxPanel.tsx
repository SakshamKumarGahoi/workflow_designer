import { useSimulate } from '../hooks/useSimulate'
import { Play, X, Loader2, Check, Minus, AlertCircle, Lightbulb } from 'lucide-react'

export function SandboxPanel() {
  const { run, result, loading, open, setOpen } = useSimulate()

  return (
    <>
      <button onClick={run} className="btn btn-primary">
        {loading ? (
          <Loader2 size={15} className="animate-spin-slow" />
        ) : (
          <Play size={15} />
        )}
        {loading ? 'Running...' : 'Run Workflow'}
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Simulation Results
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  padding: '4px',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Loader2 size={18} className="animate-spin-slow" />
                  <span style={{ fontSize: '14px' }}>Running simulation...</span>
                </div>
              )}

              {!loading && result?.error && (
                <div>
                  {/* Parse errors into individual cards if they contain node-specific info */}
                  {result.validationDetails && result.validationDetails.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        color: 'var(--accent-red)',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}>
                        <AlertCircle size={18} />
                        Fix the following issues to run the workflow:
                      </div>
                      {result.validationDetails.map((detail, i) => (
                        <div key={i} className="validation-error-card">
                          <div className="error-icon">
                            <Lightbulb size={16} />
                          </div>
                          <div>
                            <p className="error-title">{detail.title}</p>
                            <p className="error-fix">{detail.fix}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-red-light)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}>
                      <AlertCircle size={18} style={{ color: 'var(--accent-red)', flexShrink: 0, marginTop: '1px' }} />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '4px' }}>
                          Cannot run workflow
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{result.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!loading && result && !result.error && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {result.steps.map((step, i) => (
                    <div key={step.nodeId} style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className={`sim-step-icon sim-step-icon--${step.status}`}>
                          {step.status === 'success' ? <Check size={14} /> :
                            step.status === 'error' ? <X size={14} /> :
                              <Minus size={14} />}
                        </div>
                        {i < result.steps.length - 1 && <div className="sim-step-line" />}
                      </div>
                      <div style={{ paddingBottom: '16px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {step.nodeTitle}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          {step.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}