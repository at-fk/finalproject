import React, { useState } from 'react';
import { RegulationStructure } from './search/RegulationStructure';
import { RegulationSelect } from './search/SearchForm/RegulationSelect';

export const SidebarRegulationStructure: React.FC = () => {
  // regulationIdはサイドバー内でのみ管理
  const [regulationId, setRegulationId] = useState<string>('');

  const handleStructureClick = (_type: 'chapter' | 'section', _id: string) => {};
  const handleArticleClick = (_articleId: string) => {};

  return (
    <aside className="w-80 bg-white border-r h-full overflow-y-auto shadow-lg flex flex-col">
      {!regulationId && (
        <div className="p-4 text-gray-500">Please select a regulation to view its structure.</div>
      )}
      <div className="p-4 border-b">
        <div className="mb-2 font-semibold">Regulation Selection</div>
        <RegulationSelect value={regulationId} onChange={setRegulationId} />
      </div>
      {regulationId && (
        <RegulationStructure
          regulationId={regulationId}
          onStructureClick={handleStructureClick}
          onArticleClick={handleArticleClick}
        />
      )}
    </aside>
  );
};
