import { baseURL } from '@/app/resources';
import { home, person } from '@/app/resources/content';
import { getPosts } from '@/app/utils/utils';
import { Home } from '@/components/Home';

export async function generateMetadata() {
	const title = home.title;
	const description = home.description;
	const ogImage = `https://${baseURL}/images/og.png`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'website',
			url: `https://${baseURL}`,
			images: [{ url: ogImage, alt: title }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}

export default function Page() {
	const projects = getPosts(['src', 'app', 'work', 'projects'])
		.sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
		.map((post) => ({
			slug: post.slug,
			title: post.metadata.title,
			summary: post.metadata.summary,
			category: post.metadata.category || '',
			tags: post.metadata.tags || [],
			link: post.metadata.link || '',
			linkLabel: post.metadata.linkLabel || '',
		}));

	return (
		<>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebPage',
						name: home.title,
						description: home.description,
						url: `https://${baseURL}`,
						image: `${baseURL}/images/og.png`,
						publisher: { '@type': 'Person', name: person.name },
					}),
				}}
			/>
			<Home projects={projects} />
		</>
	);
}
