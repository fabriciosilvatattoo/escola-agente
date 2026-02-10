import { useState } from 'react'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o agente da escola. Como posso te ajudar hoje?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: newMessages.slice(1)
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Desculpe, tive um erro. Tente novamente.' }])
      }
    } catch (error) {
      console.error('Erro:', error)
      setMessages([...newMessages, { role: 'assistant', content: 'Erro de conexão. Tente novamente.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎓 Escola Inteligente</h1>
        <p style={styles.subtitle}>Agente GLM-4.7 - Pergunte sobre matrículas, notas, horários</p>
      </div>

      <div style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.assistantBubble}>
              <div style={styles.messageRole}>{msg.role === 'user' ? 'Você' : 'Agente'}</div>
              <div style={styles.messageText}>{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.assistantMessage}>
            <div style={styles.assistantBubble}>
              <div style={styles.messageRole}>Agente</div>
              <div style={styles.loading}>Digitando...</div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.inputContainer}>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua pergunta sobre a escola..."
          rows={3}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ ...styles.button, ...(loading || !input.trim() ? styles.buttonDisabled : {}) }}
        >
          {loading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '30px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
    fontWeight: 700
  },
  subtitle: {
    fontSize: '1rem',
    opacity: 0.95
  },
  chatContainer: {
    minHeight: '400px',
    marginBottom: '20px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  userMessage: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  assistantMessage: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  userBubble: {
    background: '#667eea',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '15px 15px 0 15px',
    maxWidth: '70%',
    wordWrap: 'break-word'
  },
  assistantBubble: {
    background: 'white',
    color: '#333',
    padding: '15px 20px',
    borderRadius: '15px 15px 15px 0',
    maxWidth: '70%',
    wordWrap: 'break-word',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  messageRole: {
    fontSize: '0.75rem',
    marginBottom: '5px',
    opacity: 0.7,
    fontWeight: 600
  },
  messageText: {
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  },
  loading: {
    color: '#999',
    fontStyle: 'italic'
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end'
  },
  textarea: {
    flex: 1,
    padding: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '1rem',
    fontFamily: 'Inter, sans-serif',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  textareaFocus: {
    borderColor: '#667eea'
  },
  button: {
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: 'auto'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}

export default App