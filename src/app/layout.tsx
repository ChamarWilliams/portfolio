import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";
import "@/app/elegant.css";

import { PageTransition } from "@/components/PageTransition";
import { baseURL } from '@/app/resources'
import { person, home } from '@/app/resources/content';

export async function generateMetadata() {
	return {
		metadataBase: new URL(`https://${baseURL}`),
		title: home.title,
		description: home.description,
		openGraph: {
			title: `${person.firstName}'s Portfolio`,
			description: 'Portfolio website showcasing my work.',
			url: `https://${baseURL}`,
			siteName: `${person.firstName}'s Portfolio`,
			locale: 'en_US',
			type: 'website',
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
	}
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" data-theme="light">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&display=swap" />
			</head>
			<body className="e-body">
				<PageTransition>{children}</PageTransition>
			</body>
		</html>
	);
}
