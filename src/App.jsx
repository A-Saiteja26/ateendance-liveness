import React from 'react';
import { ThemeProvider } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsexports from './aws-exports';
import { LivenessQuickStartReact } from './FaceLivenessDetector';

Amplify.configure(awsexports);

export default function App() {
  return (
    <LivenessQuickStartReact/>
  );
}