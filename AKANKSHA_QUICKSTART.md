# Akanksha AI - Quick Start Guide

## Setup (5 minutes)

### 1. Environment Variables
```bash
# Add to .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxx
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 2. Install Dependencies
```bash
pnpm add ai @ai-sdk/anthropic react-markdown
```

### 3. Create Database Tables
Run these in Supabase SQL editor:

```sql
-- Conversations
CREATE TABLE ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  language varchar(10) DEFAULT 'en',
  summary text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Messages
CREATE TABLE ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id),
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  metadata jsonb,
  tokens_used integer,
  created_at timestamp DEFAULT now()
);

-- Crop Analysis
CREATE TABLE crop_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  image_url text,
  analysis_result jsonb,
  confidence float,
  disease text,
  recommendations jsonb,
  created_at timestamp DEFAULT now()
);

-- Recommendations
CREATE TABLE recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  field_id uuid,
  type text NOT NULL,
  recommendation text NOT NULL,
  urgency text DEFAULT 'medium',
  status text DEFAULT 'new',
  created_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Usage Examples

### Basic Chat
```typescript
import { useAI } from '@/lib/hooks/useAI'

export function ChatComponent() {
  const { messages, sendMessage, isLoading } = useAI('conv-123', 'en')

  return (
    <div>
      {messages.map(m => <p key={m.id}>{m.content}</p>)}
      <button onClick={() => sendMessage('My tomato leaves are yellow')}>
        Send
      </button>
    </div>
  )
}
```

### Image Analysis
```typescript
async function analyzeImage(file: File) {
  const formData = new FormData()
  formData.append('image', file)
  
  const res = await fetch('/api/ai/analyze-image', {
    method: 'POST',
    body: formData
  })
  
  return res.json()
  // Returns: { disease, confidence, recommendations }
}
```

### Voice Input
```typescript
function VoiceChat() {
  const recognition = new webkitSpeechRecognition()
  recognition.lang = 'te-IN'
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    sendMessage(transcript)
  }
  
  return <button onClick={() => recognition.start()}>🎤 Speak</button>
}
```

## Routes

### User Pages
- `/ai-assistant` - Dashboard with AI insights
- `/ai-assistant/chat` - Main chat interface
- `/ai-assistant/disease-detection` - Image upload and analysis
- `/ai-assistant/dashboard` - Analytics and history

### Admin Pages
- `/admin/ai-monitoring` - Usage analytics and monitoring

### API Routes
- `POST /api/ai/chat` - Stream chat responses
- `POST /api/ai/analyze-image` - Analyze crop images
- `POST /api/ai/conversations` - Create new conversation
- `GET /api/ai/conversations` - List conversations

## Testing

### Test Chat
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What causes yellowing tomato leaves?"}],
    "conversationId": "test-123",
    "language": "en"
  }'
```

### Test Image Analysis
```bash
curl -X POST http://localhost:3000/api/ai/analyze-image \
  -F "image=@tomato-disease.jpg" \
  -F "fieldId=field-123"
```

## Common Issues

### API Key Not Found
- Ensure `ANTHROPIC_API_KEY` is set in `.env.local`
- Restart dev server after changing env vars

### Database Connection Error
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify Supabase project is active
- Check network connectivity

### Image Upload Fails
- File size limit: 10MB
- Supported formats: JPG, PNG, WebP
- Check Supabase Storage permissions

### Voice Not Working
- Only works in Chrome/Edge (HTTPS required for production)
- Check browser microphone permissions
- Language codes: en-US, te-IN, hi-IN

## Performance Tips

1. **Cache Conversations**: Load from DB, cache in React state
2. **Lazy Load Messages**: Show first 50, then paginate
3. **Optimize Images**: Compress before upload
4. **Use CDN**: Serve images from Supabase CDN
5. **Stream Responses**: Show partial responses as they arrive

## Monitoring

Check these metrics:
- API response time: < 2 seconds for chat
- Image analysis: < 5 seconds
- Database query time: < 100ms
- Error rate: < 0.1%
- User engagement: messages per user per day

## Support

- Docs: AKANKSHA_AI_IMPLEMENTATION.md
- Issues: Report in GitHub
- Questions: Check FAQ in app
