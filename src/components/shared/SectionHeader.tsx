import React from "react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  headingId: string;
  title: string;
  linkTo: string;
  linkLabel: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  headingId,
  title,
  linkTo,
  linkLabel,
}) => (
  <div className="mb-3 flex items-center justify-between">
    <h2
      id={headingId}
      className="text-sm font-semibold uppercase tracking-widest text-muted-foreground"
    >
      {title}
    </h2>
    <Link
      to={linkTo}
      className="
        text-sm font-medium text-muted-foreground
        underline underline-offset-2 decoration-foreground/20
        hover:decoration-foreground/60 hover:text-foreground
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring/40 rounded
      "
    >
      {linkLabel}
    </Link>
  </div>
);
