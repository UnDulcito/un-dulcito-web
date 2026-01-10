import Link from "next/link";

interface ButtonProps {
  text: string;
  href?: string; // El ? significa que es opcional
  onClick?: () => void;
  className?: string;
}

export default function Button({ text, href, onClick, className = "" }: ButtonProps) {
  const baseStyles = "inline-block px-8 py-3 bg-gradient-to-r from-deep-rose to-rose text-white rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 border-2 border-soft-gold/50 cursor-pointer";
  
  // Si le pasamos un link, se comporta como enlace
  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${className}`}>
        {text}
      </Link>
    );
  }

  // Si no, es un botón normal
  return (
    <button onClick={onClick} className={`${baseStyles} ${className}`}>
      {text}
    </button>
  );
}