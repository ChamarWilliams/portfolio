import { RedirectHome } from '@/components/RedirectHome';

export const metadata = { title: 'About' };

export default function About() {
	return <RedirectHome hash="about" />;
}
