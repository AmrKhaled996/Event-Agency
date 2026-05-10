import { Label } from "./../shadcn/label";
import { Input } from "./../shadcn/input";
import { Button } from "./../shadcn/button";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export function VenueSettings({
  rows,
  seatsPerRow,
  onRowsChange,
  onSeatsPerRowChange,
  onApply,
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h3 className="font-semibold">{t("ui.venue.title")}</h3>
      </div>

      <div>
        <Label htmlFor="rows">{t("ui.venue.rowsLabel")}</Label>
        <Input
          id="rows"
          type="number"
          min="1"
          max="26"
          value={rows}
          onChange={(e) => onRowsChange(parseInt(e.target.value) || 1)}
        />
      </div>

      <div>
        <Label htmlFor="seatsPerRow">{t("ui.venue.seatsLabel")}</Label>
        <Input
          id="seatsPerRow"
          type="number"
          min="1"
          max="50"
          value={seatsPerRow}
          onChange={(e) => onSeatsPerRowChange(parseInt(e.target.value) || 1)}
        />
      </div>

      <Button onClick={onApply} className="w-full">
        {t("ui.venue.applyButton")}
      </Button>
    </div>
  );
}

