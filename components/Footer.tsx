"use client";

import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

type FooterProps = {
  companyName?: string;
  tagline?: string;
  sections?: FooterSection[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  copyrightText?: string;
};

const defaultSections: FooterSection[] = [
  {
    title: "Tools",
    links: [
      { label: "Unicode Scanner", href: "#unicode-scanner" },
      { label: "Code Comparator", href: "#code-comparator" },
      { label: "Documentation", href: "#docs" },
      { label: "API", href: "#api" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: "https://github.com/sedegah" },
      { label: "Blog", href: "#blog" },
      { label: "Community", href: "#community" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Security", href: "#security" },
      { label: "License", href: "#license" },
    ],
  },
];

export const Footer = ({
  companyName = "Code Comparator",
  tagline = "Free, open-source developer tools for code analysis and security",
  sections = defaultSections,
  socialLinks = {
    twitter: "https://twitter.com",
    linkedin: "https://www.linkedin.com/in/kimathi-sedegah/",
    github: "https://github.com/sedegah",
    email: "sedegahkim@gmail.com",
  },
  copyrightText,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const copyright =
    copyrightText || `© ${currentYear} ${companyName}. All rights reserved.`;

  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="col-span-2 sm:col-span-3 md:col-span-2"
          >
            <div className="mb-4">
              <h3
                className="text-lg sm:text-2xl font-semibold text-foreground mb-2"
                style={{ fontFamily: "Figtree", fontWeight: "500" }}
              >
                {companyName}
              </h3>
              <p
                className="text-xs sm:text-sm leading-5 text-foreground/60 max-w-xs"
                style={{ fontFamily: "Figtree" }}
              >
                {tagline}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-muted border border-border text-foreground/60 hover:text-primary hover:border-primary transition-colors duration-150"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-muted border border-border text-foreground/60 hover:text-primary hover:border-primary transition-colors duration-150"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-muted border border-border text-foreground/60 hover:text-primary hover:border-primary transition-colors duration-150"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-muted border border-border text-foreground/60 hover:text-primary hover:border-primary transition-colors duration-150"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

            {/* Link Sections */}
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="col-span-1"
              >
                <h4
                  className="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4 uppercase tracking-wide"
                  style={{ fontFamily: "Figtree", fontWeight: "500" }}
                >
                  {section.title}
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-xs sm:text-sm text-foreground/60 hover:text-primary transition-colors duration-150"
                        style={{ fontFamily: "Figtree" }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-6 sm:pt-8 border-t border-border"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-foreground/60" style={{ fontFamily: "Figtree" }}>
              {copyright}
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="#status"
                className="text-xs sm:text-sm text-foreground/60 hover:text-primary transition-colors duration-150"
                style={{ fontFamily: "Figtree" }}
              >
                Status
              </a>
              <a
                href="#sitemap"
                className="text-xs sm:text-sm text-foreground/60 hover:text-primary transition-colors duration-150"
                style={{ fontFamily: "Figtree" }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
