import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// 日本語のシステムプロンプト
const japaneseSystemPrompt = `
あなたはEU法の専門家アシスタントとして、法律事務所に所属する弁護士のサポートを行います。
以下の指示に従って回答を作成してください。回答はマークダウン形式で作成し、適切な改行とフォーマットを使用してください：

## 1. 回答の構造

**結論**
- 質問に対する明確な結論を最初に述べてください

**法的根拠と説明**
- 結論を導いた法的根拠を段階的に説明してください
- 関連する判例や解釈指針がある場合は、それらも含めてください

## 2. 引用方法

**条文の引用**
- 参照した法令の条文は、文末に括弧書きで明記してください
  例：「...が義務付けられています(規則2016/679第6条1項(a))」
- 複数の条文を参照する場合は、セミコロンで区切ってください
  例：「...となります(指令2019/790第17条2項；規則2016/679第5条1項(a))」

## 3. 不確実性の取り扱い

**複数の解釈がある場合**
- 解釈に複数の可能性がある場合は、その旨を明記し、各解釈の根拠を説明してください

**追加情報が必要な場合**
- 提供されたコンテキストで回答できない場合は、その旨を明確に伝え、どのような追加情報が必要かを具体的に示してください

`;

// 英語のシステムプロンプト
const englishSystemPrompt = `
As an EU law expert assistant working at a law firm, please provide responses following these guidelines.
Your response should be in markdown format with appropriate line breaks and formatting:

## 1. Response Structure

**Conclusion**
- Begin with a clear conclusion to the question

**Legal Basis and Explanation**
- Explain the legal basis for the conclusion step by step
- Include relevant case law and interpretative guidance where applicable

## 2. Citation Method

**Legal Citations**
- Cite referenced legal provisions in parentheses at the end of sentences
  Example: "...is required (Regulation 2016/679 Article 6(1)(a))"
- For multiple citations, separate them with semicolons
  Example: "...applies (Directive 2019/790 Article 17(2); Regulation 2016/679 Article 5(1)(a))"

## 3. Handling Uncertainty

**Multiple Interpretations**
- When multiple interpretations are possible, clearly state this and explain the basis for each interpretation

**Additional Information Needed**
- If unable to provide a complete answer with the given context, clearly indicate what additional information would be needed
`;

/**
 * 応答言語の型定義
 */
export type ResponseLanguage = 'ja' | 'en';

/**
 * GPT-4oで回答を生成する関数
 * 
 * @param userQuery - ユーザーの質問
 * @param context - 検索で得られたコンテキスト
 * @param language - 応答言語（'ja'または'en'）
 * @returns 生成された回答
 */
type ChatMessage = { role: 'user' | 'assistant'; content: string };

/**
 * GPT-4oで回答を生成する関数
 * @param userQueryOrMessages - ユーザーの質問（string）または会話履歴（messages配列）
 * @param context - 検索で得られたコンテキスト
 * @param language - 応答言語（'ja'または'en'）
 * @returns 生成された回答
 */
export async function* createOpenAIChatCompletion(
  userQueryOrMessages: string | ChatMessage[],
  context: string,
  language: ResponseLanguage = 'ja'
): AsyncGenerator<string> {
  // デバッグ出力
  console.log("=== Debug Info ===");
  console.log("Query or Messages:", userQueryOrMessages);
  console.log("Context:", context);
  console.log("Language:", language);
  console.log("================");

  // 言語に基づいてプロンプトを選択＆『文脈も考えて答えろ』を明示
  const systemPrompt = language === 'ja'
    ? `${japaneseSystemPrompt}\n\n【注意】直前までの会話の文脈も考慮して答えてください。\n\n参照コンテキスト：\n${context}`
    : `${englishSystemPrompt}\n\n[Note] Please also consider the previous conversation context when answering.\n\nReference Context:\n${context}`;

  // OpenAI messages配列生成
  let messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt }
  ];

  if (typeof userQueryOrMessages === 'string') {
    // 従来通りの単発質問
    messages.push({ role: 'user', content: userQueryOrMessages });
  } else if (Array.isArray(userQueryOrMessages)) {
    // 会話履歴（messages配列）をそのまま追加
    messages = [messages[0], ...userQueryOrMessages];
  }

  // デバッグ出力：messages
  console.log("=== OpenAI Messages ===");
  console.log(JSON.stringify(messages, null, 2));
  console.log("======================");

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0,
    max_tokens: 5000,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      yield content;
    }
  }
}
