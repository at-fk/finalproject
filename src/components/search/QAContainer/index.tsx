import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SearchResult } from '@/types/domain/search/result';

interface QAContainerProps {
  selectedResults: SearchResult[];
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  referencedContext?: string | null;
};

export function QAContainer({ selectedResults }: QAContainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openContextIdx, setOpenContextIdx] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!input.trim()) {
      setError('Question must be provided');
      return;
    }
    if (selectedResults.length === 0) {
      setError('Search results must be selected');
      return;
    }
    // 前回のリクエストがあればキャンセル
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    // ユーザーメッセージを履歴に追加
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);
    try {
      // APIへ履歴ごと送信
      const response = await fetch('/api/ask/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: input }],
          context: selectedResults,
        }),
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Answer generation failed');
      }
      // ストリーミング対応（仮実装: 一括受信）
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Streaming response reading failed');
      let aiContent = '';
      let referencedContext: string | null = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'context') {
                referencedContext = parsed.usedContext;
              } else if (parsed.content) {
                aiContent += parsed.content;
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error('Failed to parse SSE message:', e);
            }
          }
        }
      }
      // AIメッセージを履歴に追加
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiContent, referencedContext },
      ]);
      setInput('');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setError(error instanceof Error ? error.message : 'Answer generation failed');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };


  return (
    <div className="space-y-6">
      <div className="border rounded p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-gray-400 text-sm">質問履歴はありません</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <div className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <span className="font-semibold">
                {msg.role === 'user' ? 'ユーザー' : 'AI'}:
              </span>
              <div className="inline-block ml-2 align-top max-w-[80%]">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
              {msg.role === 'assistant' && msg.referencedContext && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2"
                    onClick={() => setOpenContextIdx(openContextIdx === idx ? null : idx)}
                  >
                    View Referenced Context
                  </Button>
                  {openContextIdx === idx && (
                    <Dialog open={true} onOpenChange={() => setOpenContextIdx(null)}>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Referenced Context</DialogTitle>
                        </DialogHeader>
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap">{msg.referencedContext}</pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your question based on the selected search results"
            disabled={loading}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating answer...' : 'Ask a question'}
          </Button>
          {loading && (
            <Button
              type="button"
              variant="outline"
              onClick={() => abortControllerRef.current?.abort()}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 