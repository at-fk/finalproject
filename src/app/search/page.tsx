"use client";
import React, { useState } from "react";
import { AISearchSection } from "@/components/search/AISearchSection";
import { SidebarRegulationStructure } from "@/components/SidebarRegulationStructure";

export default function SearchPage() {
  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [usedContext, setUsedContext] = useState<string | null>(null);

  const handleAISearch = async (params: {
    regulation_id: string;
    query: string;
    similarityThreshold: number;
  }) => {
    try {
      setIsLoading(true);
      setAnswer("");
      setUsedContext(null);

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "semantic",
          regulation_id: params.regulation_id,
          semanticQuery: params.query,
          searchLevel: "paragraph",
          similarityThreshold: params.similarityThreshold,
          useAllMatches: true,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;
          const match = line.match(/^data: (.*)$/);
          if (!match) continue;

          const data = match[1].trim();
          if (data === "[DONE]") break;
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "context") {
              setUsedContext(parsed.usedContext);
            } else if (parsed.content) {
              setAnswer((prev) => prev + parsed.content);
            } else if (parsed.type === "done") {
              break;
            }
          } catch (e) {
            console.log("Skipping invalid JSON:", e);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">EU Insight</h2>
          </div>
          <div className="flex gap-6">
            <SidebarRegulationStructure />
            <div className="flex-1">
              <AISearchSection
                onSearch={handleAISearch}
                onRegulationChange={setSelectedRegulationId}
              />
              {answer && (
                <div className="space-y-4 mt-8">
                  <div className="prose max-w-none bg-white p-6 rounded-lg shadow">
                    {answer}
                  </div>
                  {usedContext && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Referenced Context</h3>
                      <pre className="whitespace-pre-wrap text-sm">{usedContext}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
