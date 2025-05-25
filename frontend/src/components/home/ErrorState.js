import React from 'react';
import { ErrorMessage } from '../shared';

function ErrorState({ error, onRetry }) {
  return (
    <ErrorMessage
      title="Error Loading Data"
      message={error}
      onRetry={onRetry}
      retryText="Retry"
      fullScreen
    />
  );
}

export default ErrorState; 