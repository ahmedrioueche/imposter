import React from 'react';

interface UserAvatarProps {
  avatar?: string;
  alt?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, alt = 'User Avatar', className = '' }) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={alt}
        className={`h-9 w-9 rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      className={`h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center ${className}`}
    >
      <svg
        className='w-5 h-5 text-white'
        fill='currentColor'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
          clipRule='evenodd'
        />
      </svg>
    </div>
  );
};

export default UserAvatar;
export type { UserAvatarProps };
