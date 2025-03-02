// src/pages/submit-case/index.tsx
import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { CaseSubmissionForm } from '../../components/cases/CaseSubmissionForm';

const SubmitCasePage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Submit Your Medical Case</h1>
        <p className="text-center mb-8">
          Fill out the form below to submit your medical case for verification. Once verified, 
          your case will be eligible for funding from donors around the world.
        </p>
        
        <CaseSubmissionForm />
      </div>
    </Layout>
  );
};

export default SubmitCasePage;