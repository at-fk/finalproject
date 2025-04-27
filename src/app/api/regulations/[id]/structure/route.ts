import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase/server';

interface ArticleNode {
  id: string;
  article_number: string;
  title: string;
}

interface SectionNode {
  id: string;
  section_number: string;
  title: string;
  articles: ArticleNode[];
}

interface ChapterNode {
  id: string;
  chapter_number: string;
  title: string;
  sections: SectionNode[];
  articles: ArticleNode[];          // section を持たない条文
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const regulationId = params.id;

  /* ───────────── ① Chapter 一覧 ───────────── */
  const { data: chapters, error: chapterErr } = await supabase
    .from('chapters')
    .select('id, chapter_number, title, order_index')
    .eq('regulation_id', regulationId)
    .order('order_index');

  if (chapterErr) {
    return NextResponse.json({ error: chapterErr }, { status: 500 });
  }

  const chapterNodes: ChapterNode[] = [];

  /* ───────────── ② Chapter ごとの Section / Article ───────────── */
  if (chapters && chapters.length > 0) {
    for (const ch of chapters) {
      /* Section を取得 */
      const { data: sectionsData, error: secErr } = await supabase
        .from('sections')
        .select('id, section_number, title, order_index')
        .eq('chapter_id', ch.id)
        .order('order_index');

      if (secErr) {
        return NextResponse.json({ error: secErr }, { status: 500 });
      }

      /* Section ごとの Article を取得 */
      const sectionNodes: SectionNode[] = [];
      for (const sec of sectionsData ?? []) {
        const { data: secArts, error: secArtErr } = await supabase
          .from('articles')
          .select('id, article_number, title')
          .eq('section_id', sec.id)
          .order('order_index');

        if (secArtErr) {
          return NextResponse.json({ error: secArtErr }, { status: 500 });
        }

        sectionNodes.push({
          ...sec,
          articles: secArts ?? [],
        });
      }

      /* Section を持たず、Chapter に直接ぶら下がる Article */
      const { data: chapterArts } = await supabase
        .from('articles')
        .select('id, article_number, title')
        .eq('chapter_id', ch.id)
        .is('section_id', null)
        .order('order_index');

      chapterNodes.push({
        ...ch,
        sections: sectionNodes,
        articles: chapterArts ?? [],
      });
    }

    return NextResponse.json({ chapters: chapterNodes });
  }

  /* ───────────── ③ Chapter が無い規則（直接 Article）───────────── */
  const { data: rootArts, error: rootErr } = await supabase
    .from('articles')
    .select('id, article_number, title')
    .eq('regulation_id', regulationId)
    .is('chapter_id', null)
    .is('section_id', null)
    .order('order_index');

  if (rootErr) {
    return NextResponse.json({ error: rootErr }, { status: 500 });
  }

  return NextResponse.json({
    chapters: [],        // Chapter レイヤーは無い
    articles: rootArts ?? [],
  });
}