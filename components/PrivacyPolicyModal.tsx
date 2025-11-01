
import React, { Fragment } from 'react';
import { XIcon } from './icons/Icons';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Privacy Policy</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-gray-300 space-y-4 text-sm">
            <h3 className="text-lg font-bold mb-2 text-white">Introduction</h3>
            <p>Welcome to StreamVerse. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.</p>
            
            <h3 className="text-lg font-bold mb-2 text-white">Data We Collect</h3>
            <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
            <ul className="list-disc ml-6 space-y-1">
                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and demographic information that you voluntarily give to us when you register with the service.</li>
                <li><strong>Usage Data:</strong> Information your browser sends whenever you visit our service, such as your IP address, browser type, pages visited, time spent on pages, and other diagnostic data.</li>
                <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our service and hold certain information.</li>
            </ul>

            <h3 className="text-lg font-bold mb-2 text-white">How We Use Your Data</h3>
            <p>We use the collected data for various purposes:</p>
            <ul className="list-disc ml-6 space-y-1">
                <li>To provide and maintain our service.</li>
                <li>To notify you about changes to our service.</li>
                <li>To provide personalized content recommendations.</li>
                <li>To monitor the usage of our service.</li>
                <li>To detect, prevent and address technical issues.</li>
            </ul>

            <h3 className="text-lg font-bold mb-2 text-white">Data Sharing and Disclosure</h3>
            <p>We do not sell your personal data. We may share information with third-party vendors and service providers that perform services for us, under confidentiality agreements. We may also disclose your information where required by law.</p>

            <h3 className="text-lg font-bold mb-2 text-white">Your Data Protection Rights</h3>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc ml-6 space-y-1">
                <li>The right to access, update or delete the information we have on you.</li>
                <li>The right of rectification.</li>
                <li>The right to object.</li>
                <li>The right of restriction.</li>
                <li>The right to data portability.</li>
                <li>The right to withdraw consent.</li>
            </ul>

            <h3 className="text-lg font-bold mb-2 text-white">Changes to This Policy</h3>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        </div>
        <div className="p-4 border-t border-gray-700 text-right">
            <button
                onClick={onClose}
                className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
