import { AnalyseResultCategory } from "../../types/result";

export const highlightErrors = (
  text: string,
  payload: AnalyseResultCategory
) => {
  if (!payload || !payload.errors) {
    return [
      {
        text,
      },
    ];
  }

  const allErrors = payload.errors.flatMap((e) => e.items);

  const resultArray: {
    text: string;
    error?: {
      errorId: string;
      itemId: string;
      newText?: string;
    };
  }[] = [
    {
      text: text.substring(0, allErrors[0]?.position || text.length),
    },
  ];

  payload.errors.forEach((error) => {
    error.items.forEach((item) => {
      resultArray.push({
        text: item.error,
        error: {
          errorId: error.id,
          itemId: item.id,
          newText: item.newText,
        },
      });

      resultArray.push({
        text: text.substring(
          (item.position || 0) + item.error.length,
          allErrors[allErrors.indexOf(item) + 1]?.position || text.length
        ),
      });
    });
  });

  return resultArray;
};

// export const replaceTextOnPosition = (
//   text: string,
//   position: number,
//   length: number,
//   newText: string
// ) => {
//   const before = text.slice(0, position);
//   const after = text.slice(position + length);
//   return before + newText + after;
// };
