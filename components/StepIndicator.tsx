'use client';

interface Step {
  label: string;
  completed?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className = '' }: StepIndicatorProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index < currentStep
                  ? 'bg-green-600 text-white'
                  : index === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="text-xs mt-1 text-center">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 ${index < currentStep ? 'bg-green-600' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
