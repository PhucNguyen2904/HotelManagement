import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

export function SocialLinks() {
  const socials = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com',
      color: 'text-blue-600',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'text-pink-600',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com',
      color: 'text-red-600',
    },
    {
      name: 'TikTok',
      icon: Linkedin,
      url: 'https://tiktok.com',
      color: 'text-black',
    },
  ];

  return (
    <section className="bg-[var(--color-accent)] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h3 className="mb-8 text-2xl font-semibold text-[var(--color-primary)]">
          Theo Dõi Chúng Tôi
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                title={social.name}
              >
                <Icon
                  size={40}
                  className={`${social.color} opacity-70 hover:opacity-100`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
