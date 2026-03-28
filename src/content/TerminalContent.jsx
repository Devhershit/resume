import { useMemo, useRef, useState } from 'react'

const getMatrixLine = () => {
  const chars = '01#@$%&*'
  return Array.from({ length: 48 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const getCommandLines = (normalized, prompt) => {
  if (normalized === 'help') {
    return [
      'Available commands:',
      'whoami  - quick intro',
      'skills  - tech stack snapshot',
      'projects - current project focus',
      'matrix  - mini matrix rain',
      'date    - current local date/time',
      'socials - social links',
      'clear   - clear terminal history',
    ]
  }

  if (normalized === 'whoami') {
    return ['Harshit - Software Engineering student focused on Frontend and AI/ML.']
  }

  if (normalized === 'skills') {
    return ['React, JavaScript, Python, Tailwind CSS, REST APIs, NLP, SQL, Git']
  }

  if (normalized === 'projects') {
    return [
      'Building Harshit OS portfolio with interactive windows and dock.',
      'Type `photos` from the dock to see project screenshots.',
    ]
  }

  if (normalized === 'matrix') {
    return ['Initializing matrix stream...', getMatrixLine(), getMatrixLine(), getMatrixLine()]
  }

  if (normalized === 'date') {
    return [new Date().toLocaleString()]
  }

  if (normalized === 'socials') {
    return [
      'Instagram: https://www.instagram.com/',
      'X: https://x.com/CarbonClicks',
      'LinkedIn: https://linkedin.com/in/harshit-gahlawat',
      'Mail: mailto:harshitgahlawat33@gmail.com',
      'GitHub: https://github.com/Devhershit',
    ]
  }

  if (normalized === 'clear') {
    return [{ __clear: true, prompt }]
  }

  return [`Command not found: ${normalized}. Type 'help' for a list of commands.`]
}

export function TerminalContent() {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to Harshit Terminal v1.0' },
    { type: 'output', text: "Type 'help' to see all commands." },
  ])
  const [command, setCommand] = useState('')
  const inputRef = useRef(null)

  const prompt = useMemo(() => 'harshit@portfolio:~$', [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const normalized = command.trim().toLowerCase()
    if (!normalized) return

    const commandLines = getCommandLines(normalized, prompt)
    const shouldClear =
      commandLines.length === 1 &&
      typeof commandLines[0] === 'object' &&
      commandLines[0] !== null &&
      commandLines[0].__clear

    if (shouldClear) {
      setHistory([
        { type: 'output', text: 'Welcome to Harshit Terminal v1.0' },
        { type: 'output', text: "Type 'help' to see all commands." },
      ])
      setCommand('')
      return
    }

    const next = [
      ...history,
      { type: 'command', text: `${prompt} ${command}` },
      ...commandLines.map((line) => ({ type: 'output', text: line })),
    ]

    setHistory(next)
    setCommand('')
  }

  return (
    <div
      className="h-full bg-slate-950 p-4 font-mono text-sm text-emerald-300"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="h-full overflow-auto rounded-xl border border-emerald-400/20 bg-black/40 p-3">
        {history.map((line, index) => (
          <p key={`${line.text}-${index}`} className={line.type === 'command' ? 'text-emerald-200' : 'text-emerald-400'}>
            {line.text}
          </p>
        ))}

        <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
          <span className="text-emerald-200">{prompt}</span>
          <input
            ref={inputRef}
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            className="w-full bg-transparent text-emerald-100 outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
