import TestButton from '../components/TestButton';

export default {
  title: 'Components/TestButton',
  component: TestButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onTestComplete: { action: 'test completed' },
    onTestStart: { action: 'test started' },
    isLoading: { control: 'boolean' },
    hasError: { control: 'boolean' },
    errorMessage: { control: 'text' },
    errorType: { 
      control: 'select', 
      options: ['network', 'api', 'timeout', 'validation']
    },
  },
};

// Default success state
export const Default = {
  args: {
    zoneId: 'zone-1',
    isLoading: false,
    hasError: false,
  },
};

// Loading state while test is running
export const Loading = {
  args: {
    zoneId: 'zone-2',
    isLoading: true,
    hasError: false,
  },
};

// Failed test state
export const TestFailed = {
  args: {
    zoneId: 'zone-3',
    isLoading: false,
    hasError: true,
    errorMessage: 'API endpoint not responding',
    errorType: 'api',
  },
};

// Network Error state with disabled test
export const NetworkError = {
  args: {
    zoneId: 'zone-4',
    isLoading: false,
    hasError: true,
    errorMessage: 'Network connection failed',
    errorType: 'network',
  },
};

// Timeout Error state
export const TimeoutError = {
  args: {
    zoneId: 'zone-5',
    isLoading: false,
    hasError: true,
    errorMessage: 'Test timed out after 30 seconds',
    errorType: 'timeout',
  },
};

// Invalid Zone ID state
export const InvalidZoneId = {
  args: {
    zoneId: 'invalid-zone',
    isLoading: false,
    hasError: true,
    errorMessage: 'Invalid zone identifier',
    errorType: 'validation',
  },
}; 