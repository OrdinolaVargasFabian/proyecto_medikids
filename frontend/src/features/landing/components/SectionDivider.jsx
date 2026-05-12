export const SectionDivider = ({ flip }) => (
  <div className="relative w-full h-24 pointer-events-none overflow-hidden -mb-1">
    <svg
      viewBox="0 0 1440 100"
      fill="none"
      preserveAspectRatio="none"
      className={`absolute bottom-0 w-full h-full ${flip ? "scale-x-[-1]" : ""}`}
    >
      <path
        d="M0 40C240 0 480 60 720 40S960 0 1200 40s240 60 240 60v60H0V40Z"
        fill="currentColor"
        className="text-medi-50/40"
      />
    </svg>
  </div>
);
