import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CustomMDX } from '@/components/mdx'
import { Art } from '@/components/Art'
import { getPosts } from '@/app/utils/utils'
import { baseURL } from '@/app/resources';
import { person } from '@/app/resources/content';

interface WorkParams {
    params: {
        slug: string;
    };
}

const projectDir = ['src', 'app', 'work', 'projects'];

const sortedPosts = () =>
    getPosts(projectDir).sort(
        (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
    );

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    return getPosts(projectDir).map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params: { slug } }: WorkParams) {
	const post = getPosts(projectDir).find((post) => post.slug === slug)

	if (!post) {
		return
	}

	const { title, publishedAt: publishedTime, summary: description, images, image } = post.metadata
	const ogImage = image
		? `https://${baseURL}${image}`
		: `https://${baseURL}/images/og.png`;

	return {
		title,
		description,
		images,
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime,
			url: `https://${baseURL}/work/${post.slug}`,
			images: [{ url: ogImage }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	}
}

export default function Project({ params }: WorkParams) {
	const posts = sortedPosts();
	const index = posts.findIndex((post) => post.slug === params.slug);
	const post = posts[index];

	if (!post) {
		notFound()
	}

	const next = posts[(index + 1) % posts.length];
	const prev = posts[(index - 1 + posts.length) % posts.length];
	const { title, summary, category, tags, link, linkLabel, publishedAt } = post.metadata;

	return (
		<main className="e-case">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: title,
						datePublished: publishedAt,
						dateModified: publishedAt,
						description: summary,
						image: `https://${baseURL}/images/og.png`,
						url: `https://${baseURL}/work/${post.slug}`,
						author: { '@type': 'Person', name: person.name },
					}),
				}}
			/>
			<div className="e-top">
				<Link href="/#projects" className="e-back"><i />Projects</Link>
			</div>

			<div className="e-eyebrow">{category}</div>
			<h1 className="e-case-title">{title}</h1>
			<p className="e-lede">{summary}</p>
			<div className="e-tags">{tags.map((t) => <span className="e-tag" key={t}>{t}</span>)}</div>
			{link && (
				<div className="e-btns">
					<a className="e-btn e-fill" href={link} target="_blank" rel="noopener noreferrer">{linkLabel || 'Visit'}</a>
				</div>
			)}

			<div className="e-case-art"><Art kind={post.slug} /></div>

			<article className="e-prose">
				<CustomMDX source={post.content} />
			</article>

			<nav className="e-next" aria-label="More projects">
				<Link href={`/work/${prev.slug}`}><small>← Previous project</small>{prev.metadata.title}</Link>
				<Link href={`/work/${next.slug}`} className="e-r"><small>Next project →</small>{next.metadata.title}</Link>
			</nav>
		</main>
	)
}
