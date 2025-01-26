import { NextRequest, NextResponse } from 'next/server';
import { SearchError } from '@/lib/error-handling';

const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY;
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL;

if (!EMBEDDING_API_KEY || !EMBEDDING_API_URL) {
  throw new Error('Missing required environment variables for embedding API');
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text must be a non-empty string' },
        { status: 400 }
      );
    }

    const response = await fetch(EMBEDDING_API_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EMBEDDING_API_KEY}`,
      },
      body: JSON.stringify({
        input: text,
        model: "jina-embeddings-v3",  // v3 マルチリンガルモデル
        dimensions: 256,  // 256次元の埋め込みベクトルを生成
        task: "retrieval.query",  // 検索クエリ用
        late_chunking: false  // チャンキングを無効化
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jina API error:', errorText);
      throw new SearchError(
        'Failed to generate embedding',
        'EMBEDDING_ERROR',
        errorText
      );
    }

    const data = await response.json();
    
    if (!data.data?.[0]?.embedding) {
      throw new Error('Invalid response format from Jina API');
    }

    return NextResponse.json({
      embedding: data.data[0].embedding
    });

  } catch (error) {
    console.error('Embedding error:', error);
    
    if (error instanceof SearchError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate embedding' },
      { status: 500 }
    );
  }
} 