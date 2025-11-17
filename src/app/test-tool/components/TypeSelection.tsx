import clsx from "clsx";

export const TypeSelection = ({
  onSelect,
}: {
  onSelect: (sel: any) => void;
}) => {
  const selections = [
    {
      id: "1",
      name: "Leserbrief",
      description: "Argumentativer Text an eine Redaktion.",
    },
    {
      id: "2",
      name: "Meinungsrede",
      description: "Überzeuge dein Publikum mit starken Argumenten.",
      disabled: true,
    },
    {
      id: "3",
      name: "Kommentar",
      description: "Eine begründete Stellungnahme zu einem aktuellen Thema.",
      disabled: true,
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="selection-container box">
        <h1>Wähle deine Textsorte</h1>
        <div className="flex gap-6">
          {selections.map((selection) => (
            <button
              type="button"
              key={selection.id}
              onClick={() => onSelect(selection)}
              className={clsx(
                "text-type-card",
                selection.disabled && "disabled"
              )}
            >
              <h3>{selection.name}</h3>
              <p>{selection.description}</p>
              {selection.disabled ? (
                <span className="soon-badge">Bald verfügbar</span>
              ) : (
                <span className="start-button">Starten</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
