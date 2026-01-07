import { getAllInstructorCertificates } from '@/lib/actions/instructor/certificate';
import InstructorCertificateDataTableDetails from './InstructorCertificateDataTableDetails';

const InstructorCertificateDataTable = async () => {
  const instructorCertificates = await getAllInstructorCertificates();

  return (
    <InstructorCertificateDataTableDetails
      certificates={instructorCertificates}
    />
  );
};

export default InstructorCertificateDataTable;
