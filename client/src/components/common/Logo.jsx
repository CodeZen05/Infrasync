import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable InfraSync Brand Logo component
 * 
 * @param {Object} props
 * @param {'xs'|'sm'|'md'|'lg'|'xl'|'2xl'} [props.size='md'] Size preset
 * @param {boolean} [props.showText=true] Whether to display "InfraSync" text
 * @param {'light'|'dark'} [props.theme='light'] Theme for text contrast
 * @param {string} [props.badge] Optional sub-badge (e.g. "Enterprise", "AI Platform")
 * @param {string|null} [props.linkTo='/'] Destination link or null for plain container
 * @param {string} [props.className] Additional CSS class names
 */
export default function Logo({
  size = 'md',
  showText = true,
  theme = 'light',
  badge,
  linkTo = '/',
  className = ''
}) {
  const sizeMap = {
    xs: {
      img: 'w-6 h-6',
      text: 'text-base',
      badge: 'text-[8px]',
      gap: 'gap-1.5'
    },
    sm: {
      img: 'w-8 h-8',
      text: 'text-lg',
      badge: 'text-[8.5px]',
      gap: 'gap-2'
    },
    md: {
      img: 'w-9 h-9',
      text: 'text-xl',
      badge: 'text-[9px]',
      gap: 'gap-2.5'
    },
    lg: {
      img: 'w-11 h-11',
      text: 'text-2xl',
      badge: 'text-[10px]',
      gap: 'gap-3'
    },
    xl: {
      img: 'w-14 h-14',
      text: 'text-3xl',
      badge: 'text-[11px]',
      gap: 'gap-3.5'
    },
    '2xl': {
      img: 'w-20 h-20',
      text: 'text-4xl',
      badge: 'text-xs',
      gap: 'gap-4'
    }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isDark = theme === 'dark';

  const content = (
    <div className={`inline-flex items-center ${currentSize.gap} group cursor-pointer select-none ${className}`}>
      {/* Brand Emblem Icon with soft shadow & micro-hover scale */}
      <div className="relative shrink-0">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-blue-500/30 to-indigo-500/20 blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <img
          src="/logo-squircle.png"
          alt="InfraSync Logo"
          className={`${currentSize.img} rounded-xl object-contain shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300 relative z-10`}
          loading="eager"
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${currentSize.text} font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} transition-colors`}>
            Infra<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">Sync</span>
          </span>
          {badge && (
            <span className={`block font-extrabold uppercase tracking-widest mt-0.5 ${currentSize.badge} ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} aria-label="InfraSync Home">
        {content}
      </Link>
    );
  }

  return content;
}
