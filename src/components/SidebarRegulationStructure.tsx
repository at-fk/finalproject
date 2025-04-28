import React from 'react';
import { RegulationStructure } from './search/RegulationStructure';

interface SidebarRegulationStructureProps {
  regulationId: string | null;
}

export const SidebarRegulationStructure: React.FC<SidebarRegulationStructureProps> = ({ regulationId }) => {
  // No-op handlers for now, can be extended as needed
  const handleStructureClick = (_type: 'chapter' | 'section', _id: string) => {};
  const handleArticleClick = (_articleId: string) => {};

  if (!regulationId) {
    return (
      <div className="p-4 text-gray-500">Please select a regulation to view its structure.</div>
    );
  }

  return (
    <aside className="w-80 bg-white border-r h-full overflow-y-auto shadow-lg">
      <RegulationStructure
        regulationId={regulationId}
        onStructureClick={handleStructureClick}
        onArticleClick={handleArticleClick}
      />
    </aside>
  );
};
