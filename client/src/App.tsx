import { useState } from 'react'
import './App.css'

type SubscriberStatus = 'active' | 'unsubscribed'

type Subscriber = {
  id: number
  name: string
  email: string
  status: SubscriberStatus
  addedAt: string
}

type CampaignStatus = 'Draft' | 'Scheduled' | 'Sent'

type Campaign = {
  id: number
  name: string
  subject: string
  status: CampaignStatus
  sentAt?: string
  scheduledFor?: string
}

const initialSubscribers: Subscriber[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    status: 'active',
    addedAt: 'Feb 10, 2026',
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    status: 'active',
    addedAt: 'Feb 14, 2026',
  },
  {
    id: 3,
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    status: 'unsubscribed',
    addedAt: 'Feb 3, 2026',
  },
]

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Welcome Series',
    subject: 'Welcome to FlowMail',
    status: 'Sent',
    sentAt: 'Feb 21, 2026 · 10:15 AM',
  },
  {
    id: 2,
    name: 'Product Launch',
    subject: 'Meet the new spring collection',
    status: 'Scheduled',
    scheduledFor: 'Mar 2, 2026 · 9:00 AM',
  },
  {
    id: 3,
    name: 'Churn Winback',
    subject: 'We’d love to see you again',
    status: 'Draft',
  },
]

type SendMode = 'now' | 'schedule'

function App() {
  const [subscribers] = useState<Subscriber[]>(initialSubscribers)
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [campaignSubject, setCampaignSubject] = useState('')
  const [template, setTemplate] = useState('')
  const [sendMode, setSendMode] = useState<SendMode>('now')
  const [scheduledFor, setScheduledFor] = useState('')
  const [csvFileName, setCsvFileName] = useState<string | null>(null)

  const handleCsvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setCsvFileName(file ? file.name : null)
  }

  const resetForm = () => {
    setCampaignName('')
    setCampaignSubject('')
    setTemplate('')
    setSendMode('now')
    setScheduledFor('')
  }

  const handleCreateCampaign = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!campaignName.trim() || !template.trim()) {
      return
    }

    const nextId = campaigns.length > 0 ? campaigns[campaigns.length - 1].id + 1 : 1

    const newCampaign: Campaign = {
      id: nextId,
      name: campaignName.trim(),
      subject: campaignSubject.trim() || 'Untitled subject',
      status: sendMode === 'now' ? 'Sent' : 'Scheduled',
      sentAt: sendMode === 'now' ? 'Just now' : undefined,
      scheduledFor: sendMode === 'schedule' && scheduledFor ? scheduledFor : undefined,
    }

    setCampaigns((previous) => [newCampaign, ...previous])
    resetForm()
    setIsCreateOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">FlowMail Campaigns</h1>
          <p className="app-subtitle">
            Minimal, focused workspace to manage subscribers and dispatch campaigns.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsCreateOpen(true)}
        >
          Create campaign
        </button>
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Subscribers</h2>
              <p className="panel-description">Keep your subscriber list clean and up to date.</p>
            </div>
            <div className="panel-actions">
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleCsvChange}
                className="visually-hidden"
              />
              <label htmlFor="csv-upload" className="btn btn-ghost">
                Import CSV
              </label>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td>{subscriber.name}</td>
                    <td className="cell-muted">{subscriber.email}</td>
                    <td>
                      <span
                        className={`status-pill status-${subscriber.status === 'active' ? 'active' : 'unsubscribed'}`}
                      >
                        {subscriber.status === 'active' ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="cell-muted">{subscriber.addedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {csvFileName && (
            <p className="hint-text">Imported file (preview only): {csvFileName}</p>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Campaigns</h2>
              <p className="panel-description">
                Draft, schedule, and dispatch email campaigns to your audience.
              </p>
            </div>
            <div className="panel-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCreateOpen(true)}
              >
                New campaign
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Timing</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td className="cell-muted">{campaign.subject}</td>
                    <td>
                      <span className={`status-pill status-${campaign.status.toLowerCase()}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="cell-muted">
                      {campaign.status === 'Sent' && campaign.sentAt}
                      {campaign.status === 'Scheduled' && campaign.scheduledFor}
                      {campaign.status === 'Draft' && 'Not scheduled'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {isCreateOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Create campaign</h2>
                <p className="modal-description">
                  Paste or type your email template and choose when to send.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  resetForm()
                  setIsCreateOpen(false)
                }}
              >
                Close
              </button>
            </div>

            <form className="modal-body" onSubmit={handleCreateCampaign}>
              <div className="field-group">
                <label className="field-label" htmlFor="campaign-name">
                  Campaign name
                </label>
                <input
                  id="campaign-name"
                  className="field-input"
                  placeholder="Spring Launch"
                  value={campaignName}
                  onChange={(event) => setCampaignName(event.target.value)}
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="campaign-subject">
                  Subject line
                </label>
                <input
                  id="campaign-subject"
                  className="field-input"
                  placeholder="Announcing our latest update"
                  value={campaignSubject}
                  onChange={(event) => setCampaignSubject(event.target.value)}
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="campaign-template">
                  Template
                </label>
                <textarea
                  id="campaign-template"
                  className="field-textarea"
                  placeholder="Paste your HTML or plain-text email template here."
                  rows={8}
                  value={template}
                  onChange={(event) => setTemplate(event.target.value)}
                />
              </div>

              <div className="field-group">
                <span className="field-label">Send options</span>
                <div className="segmented-control">
                  <button
                    type="button"
                    className={`segment ${sendMode === 'now' ? 'segment-active' : ''}`}
                    onClick={() => setSendMode('now')}
                  >
                    Send now
                  </button>
                  <button
                    type="button"
                    className={`segment ${sendMode === 'schedule' ? 'segment-active' : ''}`}
                    onClick={() => setSendMode('schedule')}
                  >
                    Schedule
                  </button>
                </div>
                {sendMode === 'schedule' && (
                  <div className="schedule-row">
                    <label className="field-label" htmlFor="scheduled-for">
                      Schedule for
                    </label>
                    <input
                      id="scheduled-for"
                      type="datetime-local"
                      className="field-input"
                      value={scheduledFor}
                      onChange={(event) => setScheduledFor(event.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    resetForm()
                    setIsCreateOpen(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {sendMode === 'now' ? 'Send now' : 'Schedule campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
