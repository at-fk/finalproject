'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RegulationSelect } from '../SearchForm/RegulationSelect';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ResponseLanguage } from '@/lib/ai/createOpenAIChatCompletion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AISearchSectionProps {
  onSearch: (params: {
    regulation_id: string;
    query: string;
    searchLevel: 'article' | 'paragraph';
    similarityThreshold: number;
  }) => void;
  onRegulationChange?: (regulationId: string) => void;
}

export function AISearchSection({ onSearch, onRegulationChange }: AISearchSectionProps) {
  // チャット履歴（UI用）
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  // 直前のQ&A履歴を保持
  const [lastQA, setLastQA] = useState<{ question: string; answer: string } | null>(null);
  const [regulationId, setRegulationId] = useState<string>('');
  const [query, setQuery] = useState('');
  // Similarity Threshold is fixed to 0.3 (30%)
  const similarityThreshold = 0.3;
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Number of Contexts is fixed to 15
  const maxContexts = 15;
  const [usedContext, setUsedContext] = useState<string | null>(null);
  const [isContextDialogOpen, setIsContextDialogOpen] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Response language is fixed to English
  const responseLanguage: ResponseLanguage = 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);
    setAnswer('');
    setUsedContext(null);

    // ユーザーの質問を履歴に追加
    setHistory(prev => [...prev, { role: 'user', content: query }]);

    // ストリーミング開始時に空のassistantメッセージを履歴に追加
    setHistory(prev => [...prev, { role: 'assistant', content: '' }]);

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();
    setAnswer('');
    setUsedContext(null);

    // 新しいAbortControllerを作成
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ask/semantic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          searchParams: {
            regulation_id: regulationId,
            searchLevel: 'paragraph',
            similarityThreshold,
            maxContexts,
          },
          language: responseLanguage,
          lastQA, // 直前のQ&A履歴をAPIへ送信
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Answer generation failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming response reading failed');
      }

      // 検索結果を更新
      onSearch({
        regulation_id: '', // Semantic Searchには空欄で渡す
        query,
        searchLevel: 'paragraph',
        similarityThreshold,
      });

      let buffer = '';  // 不完全なチャンクを保持するバッファ
      let answerBuffer = '';

      // ストリーミングレスポンスを処理
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 受信したチャンクをデコード
        const chunk = new TextDecoder().decode(value);
        buffer += chunk;

        // 完全なメッセージを処理
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 最後の不完全な行をバッファに保持

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          // SSEメッセージのフォーマットをチェック
          const match = line.match(/^data: (.+)$/);
          if (!match) continue;

          try {
            const data = match[1].trim();
            if (data === '[DONE]') {
              break;
            }

            // 空のデータをスキップ
            if (!data) continue;

            // エラーメッセージのデバッグ用（開発環境のみ）
            if (process.env.NODE_ENV === 'development') {
              console.debug('Received data:', data);
            }

            try {
              const parsed = JSON.parse(data);
              
              // レスポンスの型に応じた処理
              if (parsed.type === 'context' && parsed.usedContext) {
                setUsedContext(parsed.usedContext);
              } else if (parsed.content) {
                // ストリーミングで受信した内容を履歴の末尾assistantメッセージに反映
                answerBuffer += parsed.content;
                setHistory(prev => {
                  // assistantメッセージが履歴末尾にある前提
                  if (prev.length === 0) return prev;
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last.role === 'assistant') {
                    updated[updated.length - 1] = { ...last, content: answerBuffer };
                  }
                  return updated;
                });
                setAnswer(answerBuffer);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              } else if (parsed.type === 'done') {
                break;
              }
            } catch (parseError) {
              // 開発環境でのみエラーを表示
              if (process.env.NODE_ENV === 'development') {
                console.debug('JSON parse error:', parseError, 'Raw data:', data);
              }
              continue;
            }
          } catch (e) {
            // 重大なエラーのみをユーザーに表示
            if (e instanceof Error) {
              if (e.message.includes('No relevant content found')) {
                setError('no relevant content found');
              } else if (e.message.includes('No content above similarity threshold')) {
                setError('no content above similarity threshold');
              } else if (e.message.includes('AbortError')) {
                // リクエストがキャンセルされた場合は何もしない
                return;
              } else {
                // その他の重大なエラーのみをユーザーに表示
                setError(`error: ${e.message}`);
              }
            }
          }
        }
      }
      // 回答取得後にlastQAを更新
      setLastQA({ question: query, answer: answerBuffer });
      // すでにストリーミングで履歴末尾に反映済みなので追加処理は不要
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // リクエストがキャンセルされた場合は何もしない
        return;
      }
      const errorMessage = error instanceof Error ? error.message : 'Answer generation failed';
      console.error('AI search error:', errorMessage);
      
      // エラーメッセージをユーザーフレンドリーに変換
      let userMessage = 'Error occurred.';
      if (errorMessage.includes('No relevant content found')) {
        userMessage = 'No relevant content found. Please try changing the search conditions.';
      } else if (errorMessage.includes('No content above similarity threshold')) {
        userMessage = 'No content above similarity threshold. Please try lowering the threshold.';
      } else {
        userMessage = `Error: ${errorMessage}`;
      }
      setError(userMessage);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* チャット履歴 */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 mb-2 bg-gray-50 rounded">
        {history.length === 0 && (
          <div className="w-full bg-[#e7f0ff] rounded flex flex-col md:flex-row items-center justify-center py-8 px-4 md:px-12 min-h-[320px]">
            <div className="flex-1 flex flex-col items-start justify-center mb-6 md:mb-0">
              <h1 className="font-['Poppins',Helvetica] font-semibold text-black text-2xl md:text-4xl lg:text-5xl leading-tight">
                Welcome to<br />EU Insights
              </h1>
              <p className="mt-6 font-['Poppins',Helvetica] font-normal text-[#858688] text-base md:text-xl">
                Get Started by searching EU laws and Regulations
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img
                className="w-full max-w-[600px] md:max-w-[720px] lg:max-w-[900px] h-auto object-contain rounded shadow"
                alt="Screenshot"
                src="https://c.animaapp.com/ma20lfwh77sO2R/img/screenshot-2025-04-26-at-8-39-43-am-1.png"
              />
            </div>
          </div>
        )}
        {history.map((msg, idx) => (
          msg.role === 'user' ? (
            <div key={idx} className="flex justify-end">
              <div className="rounded-lg px-4 py-2 max-w-[70%] shadow text-sm bg-blue-100 text-blue-900">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={idx} className="flex justify-start">
              <div className="prose prose-sm max-w-none my-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                 </ReactMarkdown>
              </div>
            </div>
          )
        ))}
      </div>

      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-end mt-auto">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question..."
          disabled={loading}
          className="min-h-[48px] flex-1"
        />
        <Button type="submit" disabled={loading || !query} className="h-[48px]">
          {loading ? '...' : 'Send'}
        </Button>
        {loading && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => abortControllerRef.current?.abort()}
            className="h-[48px]"
          >
            Cancel
          </Button>
        )}
      </form>

      {/* 参照コンテキストの表示 */}
      {usedContext && (
        <Dialog open={isContextDialogOpen} onOpenChange={setIsContextDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2">View Referenced Context</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Referenced Context</DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap">{usedContext}</pre>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

        