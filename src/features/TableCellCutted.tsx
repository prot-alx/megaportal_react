import { useState } from "react";

interface TableCellCuttedProps {
  text: string | null;
  maxChars?: number;
}

export const TableCellCutted: React.FC<TableCellCuttedProps> = ({
  text,
  maxChars = 150,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleExpand();
    }
  };

  if (text === null) {
    return <div className="block xl:table-cell py-2"> - </div>;
  }

  const truncatedDescription =
    text.length > maxChars ? text.substring(0, maxChars) + " @..." : text;

  return (
    <div className="block xl:table-cell py-2">
      <span
        className="cursor-pointer"
        onClick={toggleExpand}
        onKeyDown={handleKeyPress}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        {isExpanded ? text : truncatedDescription}
      </span>
    </div>
  );
};
