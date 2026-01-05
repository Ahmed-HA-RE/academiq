'use client';

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from '@/app/components/ui/stepper';

const steps = [1, 2];

const ApplicationStepper = ({ currentStep = 1 }: { currentStep: number }) => {
  return (
    <div className='mx-auto max-w-xl space-y-8 text-center my-8'>
      <div className='space-y-3'>
        <Stepper value={currentStep}>
          {steps.map((step) => (
            <StepperItem className='flex-1' key={step} step={step}>
              <StepperTrigger
                asChild
                className='w-full flex-col items-start gap-2'
              >
                <StepperIndicator asChild className='h-2 w-full rounded-none'>
                  <span className='sr-only'>{step}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>
        <div className='font-medium text-muted-foreground text-sm tabular-nums'>
          Step {currentStep} of {steps.length}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStepper;
