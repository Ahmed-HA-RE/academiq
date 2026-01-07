import InstructorCertificateDataTable from '@/app/components/instructor/certificate/InstructorCertificateDataTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructor Certificates',
  description: 'Manage and issue certificates for your courses.',
};

const CertificatesPage = async () => {
  return <InstructorCertificateDataTable />;
};

export default CertificatesPage;
