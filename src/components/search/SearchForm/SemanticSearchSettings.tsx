import { SearchLevel } from '@/types/domain/search/params';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SemanticSearchSettingsProps {
  searchLevel: SearchLevel;
  similarityThreshold: number;
  useAllMatches: boolean;
  onSearchLevelChange: (value: SearchLevel) => void;
  onSimilarityThresholdChange: (value: number) => void;
  onUseAllMatchesChange: (value: boolean) => void;
}

export function SemanticSearchSettings({
  searchLevel,
  similarityThreshold,
  useAllMatches,
  onSearchLevelChange,
  onSimilarityThresholdChange,
  onUseAllMatchesChange,
}: SemanticSearchSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-8">
        {/* 検索レベルの選択 */}
        <div className="flex items-center gap-4">
          <RadioGroup
            value={searchLevel}
            onValueChange={(value) => onSearchLevelChange(value as SearchLevel)}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <RadioGroupItem value="article" id="article-level" />
                <Label htmlFor="article-level" className="cursor-pointer font-semibold">
                  Article Level
                </Label>
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="cursor-help">
                      <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="max-w-xs">
                    <p className="text-sm">Search based on the content of the article</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <RadioGroupItem value="paragraph" id="paragraph-level" />
                <Label htmlFor="paragraph-level" className="cursor-pointer font-semibold">
                  Paragraph Level
                </Label>
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="cursor-help">
                      <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="max-w-xs">
                    <p className="text-sm">Search based on the content of each paragraph</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </RadioGroup>
        </div>

        {/* 類似度閾値の設定 */}
        <div className="flex items-center gap-2">
          <Label className="font-semibold whitespace-nowrap">Similarity Threshold</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={similarityThreshold}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 1) {
                  onSimilarityThresholdChange(value);
                }
              }}
              min={0}
              max={1}
              step={0.05}
              className="w-20 text-right"
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="cursor-help">
                    <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-xs">
                  <p className="text-sm">Set between 0 and 1. Higher values show only results with higher similarity.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}