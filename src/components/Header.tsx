"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";
import { Icon } from "@/once-ui/components"
import styles from '@/components/Header.module.scss'

import { routes } from '@/app/resources'
import { home, about, blog, work, gallery } from '@/app/resources/content';

type TimeDisplayProps = {
    timeZone: string;
    locale?: string;  // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = 'en-GB' }) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };
            const timeString = new Intl.DateTimeFormat(locale, options).format(now);
            setCurrentTime(timeString);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, [timeZone, locale]);

    return (
        <>
            {currentTime}
        </>
    );
};

export default TimeDisplay;

export const Header = () => {
    const pathname = usePathname() ?? '';

    const items = [
        { href: '/', icon: 'home', label: home.label, enabled: routes['/'], active: pathname === '/' },
        { href: '/about', icon: 'person', label: about.label, enabled: routes['/about'], active: pathname.startsWith('/about') },
        { href: '/work', icon: 'grid', label: work.label, enabled: routes['/work'], active: pathname.startsWith('/work') },
        { href: '/blog', icon: 'book', label: blog.label, enabled: routes['/blog'], active: pathname.startsWith('/blog') },
        { href: '/gallery', icon: 'gallery', label: gallery.label, enabled: routes['/gallery'], active: pathname.startsWith('/gallery') },
    ].filter((item) => item.enabled);

    return (
        <nav className={styles.rail} aria-label="Main">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.item} ${item.active ? styles.active : ''}`}
                    data-label={item.label}
                    aria-label={item.label}
                    aria-current={item.active ? 'page' : undefined}>
                    <Icon name={item.icon} size="m"/>
                </Link>
            ))}
        </nav>
    );
}
