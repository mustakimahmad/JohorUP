import StudentDetailClient from './StudentDetailClient';

// Generate static params for all possible student IDs
export async function generateStaticParams() {
  // Return a few sample IDs for static generation
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

export default function StudentDetailPage() {
  return <StudentDetailClient />;
}