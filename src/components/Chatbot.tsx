import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, useTheme } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

// Chatbot API URL - uses environment variable in production
const CHATBOT_URL = process.env.REACT_APP_CHATBOT_URL || 'http://localhost:3001';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotProps {
  onAnimation?: (animationName: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onAnimation }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm Pixel 🤖 Ask me anything about Divyam's portfolio!", sender: 'bot' }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    // Prevent focusing from scrolling the whole page (fixes scroll-jump on open).
    const el = inputRef.current as (HTMLInputElement & { focus: (opts?: any) => void }) | null;
    el?.focus?.({ preventScroll: true });
  };

  const scrollToBottom = () => {
    // Scroll ONLY the chat messages container (never the page).
    const el = messagesContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  // Auto-focus input on mount
  useEffect(() => {
    // Defer a tick so layout is stable, and avoid page scrolling.
    requestAnimationFrame(() => focusInput());
  }, []);

  // Scroll to bottom and refocus input after messages update
  useEffect(() => {
    scrollToBottom();
    // Refocus after bot responds
    if (!loading) {
      focusInput();
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Normalize endpoint to avoid common misconfigurations like:
      // - base ends with "/"  -> double slashes
      // - base already ends with "/chat" -> "/chat/chat"
      const base = String(CHATBOT_URL).replace(/\/$/, '');
      const endpoint = base.endsWith('/chat') ? base : `${base}/chat`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      const contentType = response.headers.get('content-type') || '';

      // If the server responds with non-2xx (e.g. 404 "Not Found"),
      // don't try to JSON-parse it blindly.
      if (!response.ok) {
        const bodyText = await response.text().catch(() => '');
        throw new Error(
          `Chatbot request failed: ${response.status} ${response.statusText} at ${endpoint}. ` +
          `Response: ${bodyText.slice(0, 200)}`
        );
      }

      if (!contentType.toLowerCase().includes('application/json')) {
        const bodyText = await response.text().catch(() => '');
        throw new Error(
          `Chatbot returned non-JSON response at ${endpoint}. ` +
          `content-type="${contentType}". Response: ${bodyText.slice(0, 200)}`
        );
      }

      const data = await response.json();
      const botMessage: Message = { text: data.answer, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // Trigger robot animation based on response
      if (data.animation && onAnimation) {
        onAnimation(data.animation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { 
        text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment! 🤖', 
        sender: 'bot' 
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Messages Area - Compact */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: 'transparent',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(144, 202, 249, 0.3)' : 'rgba(63, 81, 181, 0.3)',
            borderRadius: '3px',
          },
        }}
        ref={messagesContainerRef}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <Box
              sx={{
                maxWidth: '85%',
                px: 1.5,
                py: 1,
                borderRadius: 2.5,
                bgcolor: msg.sender === 'user' 
                  ? (isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(63, 81, 181, 0.8)')
                  : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                color: msg.sender === 'user' ? 'white' : 'text.primary',
                borderBottomLeftRadius: msg.sender === 'bot' ? 0.5 : undefined,
                borderBottomRightRadius: msg.sender === 'user' ? 0.5 : undefined,
                boxShadow: msg.sender === 'user' 
                  ? '0 2px 8px rgba(0,0,0,0.15)' 
                  : 'none',
                backdropFilter: 'blur(15px) saturate(120%)',
                border: msg.sender === 'user' 
                  ? 'none'
                  : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              <Typography variant="body2" sx={{ 
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}>
                {msg.text}
              </Typography>
            </Box>
          </Box>
        ))}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2.5,
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                borderBottomLeftRadius: 0.5,
                display: 'flex',
                gap: 0.4,
                backdropFilter: 'blur(10px)',
              }}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
                    animation: 'typing 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                    '@keyframes typing': {
                      '0%, 60%, 100%': { transform: 'translateY(0)' },
                      '30%': { transform: 'translateY(-6px)' },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Compact Input Area */}
      <Box
        sx={{
          p: 1.5,
          borderTop: `1px solid ${isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.15)'}`,
          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            variant="outlined"
            disabled={loading}
            inputRef={inputRef}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '0.875rem',
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(15px) saturate(120%)',
                '& fieldset': {
                  borderColor: isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.15)',
                },
                '&:hover fieldset': {
                  borderColor: isDark ? 'rgba(144, 202, 249, 0.3)' : 'rgba(63, 81, 181, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDark ? 'rgba(144, 202, 249, 0.5)' : 'rgba(63, 81, 181, 0.5)',
                },
              },
              '& .MuiOutlinedInput-input': {
                py: 1,
              }
            }}
          />
          <IconButton
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            size="small"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              width: 36,
              height: 36,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
              '&:disabled': {
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatbot;
