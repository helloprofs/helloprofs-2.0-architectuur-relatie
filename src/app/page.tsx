import { redirect } from 'next/navigation';

export default function Home() {
  // Voor dit concept prototype sturen we de gebruiker direct door naar het Client Dashboard
  redirect('/client/dashboard');
}
