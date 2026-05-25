function DefaultAvatar({ name, size = 'md', className = '' }) {
  // Pegar primeira letra do nome
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  
  // Cores baseadas na primeira letra (consistente)
  const colors = [
    'from-orange-400 to-red-500',
    'from-blue-400 to-indigo-500',
    'from-green-400 to-emerald-500',
    'from-purple-400 to-pink-500',
    'from-yellow-400 to-orange-500',
    'from-cyan-400 to-blue-500',
    'from-rose-400 to-pink-500',
    'from-teal-400 to-green-500',
  ];
  
  const colorIndex = initial.charCodeAt(0) % colors.length;
  const gradient = colors[colorIndex];
  
  // Tamanhos
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
    '2xl': 'w-24 h-24 text-4xl',
  };
  
  return (
    <div 
      className={`
        ${sizes[size]} 
        rounded-full 
        bg-gradient-to-br ${gradient}
        flex items-center justify-center
        text-white font-bold
        ${className}
      `}
    >
      {initial}
    </div>
  );
}

export default DefaultAvatar;