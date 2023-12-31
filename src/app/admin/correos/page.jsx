import TabOne from '@/components/bulkmailer/bulkEmailsPage/tabOne';
import Template from '@/components/bulkmailer/template';
import React from 'react';

export default function BulkEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Template />
      <br />
      <div className="border border-1 shadow-lg p-8 rounded-lg w-full">
        <TabOne />
      </div>
    </div>
  );
}
