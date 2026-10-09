import React from 'react';
import Image from 'next/image';
import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react';

export interface AuthorSocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  website?: string;
}

interface FounderPhotoCardProps {
  authorName: string;
  photoSrc?: string;
  socialLinks?: AuthorSocialLinks;
}

export function FounderPhotoCard({
  authorName,
  photoSrc = '/founder.png',
  socialLinks,
}: FounderPhotoCardProps) {
  const items = [
    socialLinks?.github ? { name: 'GitHub', href: socialLinks.github, icon: Github } : null,
    socialLinks?.linkedin ? { name: 'LinkedIn', href: socialLinks.linkedin, icon: Linkedin } : null,
    socialLinks?.twitter ? { name: 'Twitter / X', href: socialLinks.twitter, icon: Twitter } : null,
    socialLinks?.email
      ? {
          name: 'Email',
          href: socialLinks.email.startsWith('mailto:') ? socialLinks.email : `mailto:${socialLinks.email}`,
          icon: Mail,
        }
      : null,
    socialLinks?.website ? { name: 'Website', href: socialLinks.website, icon: Globe } : null,
  ].filter(Boolean) as { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[];

  return (
    <div id="founder-photo-card" className="flex flex-col items-center sm:items-start gap-3 shrink-0">
      {/* Frame Container */}
      <div className="relative group">
        <div className="relative p-1.5 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-500 shadow-xl shadow-purple-500/25">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-[20px] overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image
              src={photoSrc}
              alt={`${authorName}, Founder of ColorPixo`}
              width={192}
              height={192}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
        </div>
      </div>

      {/* Professional Social Media Section */}
      {items.length > 0 && (
        <div className="flex items-center justify-center sm:justify-start gap-2 w-full pt-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${authorName} on ${item.name}`}
                title={`${authorName} on ${item.name}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
