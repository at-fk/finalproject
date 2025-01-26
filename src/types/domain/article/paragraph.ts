/**
 * パラグラフを表すインターフェース
 */
export interface Paragraph {
  number: string;
  content: string;
  subparagraphs?: Subparagraph[];
}

/**
 * サブパラグラフを表すインターフェース
 */
export interface Subparagraph {
  letter: string;
  content: string;
} 