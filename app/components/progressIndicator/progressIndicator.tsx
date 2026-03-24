type ProgressIndicatorProps = {
  steps: readonly string[];
  step: number;
};

export const ProgressIndicator = (props: ProgressIndicatorProps) => {
  const { step = 0, steps = [] } = props;
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = step > stepNum;
        const isActive = step === stepNum;

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isActive
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  isCompleted ? "bg-emerald-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
