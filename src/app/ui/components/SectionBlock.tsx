interface SectionBlockProps {
  title: string;
  content?: string;
  icon?: React.ReactNode;
  emphasize?: boolean;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  title,
  content,
  icon,
  emphasize = false,
}) => {
  return (
    <div className="bg-white rounded-xl p-2 px-3 shadow-md border border-gray-200">
      <div className="flex items-center gap-2 text-base sm:text:sm font-semibold text-gray-800">
        {icon && <span className="text-blue-500">{icon}</span>}
        <h3 className="mb-0 sm:text-sm">{title}</h3>
      </div>
      {content && (
        <div
          className={`prose max-w-none ${
            emphasize
              ? "text-blue-900 font-bold text-base sm:text-sm"
              : "text-gray-800"
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};
