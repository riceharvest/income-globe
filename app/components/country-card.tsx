import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { IncomeBar } from "~/components/income-bar";
import { formatUsd, type CountryData } from "~/data/countries";
import { ChevronRight } from "lucide-react";

interface CountryCardProps {
  country: CountryData;
  maxMedian?: number;
  onSelect?: (code: string) => void;
}

export function CountryCard({ country, maxMedian = 9000, onSelect }: CountryCardProps) {
  return (
    <div
      onClick={() => onSelect?.(country.code)}
      className="group block cursor-pointer"
    >
      <Card className="overflow-hidden border-border/50 transition-all duration-200 hover:border-border hover:shadow-md">
        <CardContent className="p-4">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label={`${country.name} flag`}>
                {country.flag}
              </span>
              <div>
                <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                  {country.name}
                </h3>
                <p className="text-xs text-muted-foreground">{country.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-lg font-bold tabular-nums">
                  {formatUsd(country.income.p50)}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Median/mo
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
          <IncomeBar income={country.income} maxValue={maxMedian * 2.5} />
          <div className="mt-2 flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px] font-normal">
              {country.dataSource}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-normal">
              {country.dataYear}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
