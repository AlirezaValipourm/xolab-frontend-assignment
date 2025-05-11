import { FC } from "react";

interface FormatToggleProps {
    label: string;
    isActive: boolean;
    onChange: (active: boolean) => void;
}

export const FormatToggle: FC<FormatToggleProps> = ({ label, isActive, onChange }) => {
    return (
        <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
            onClick={() => onChange(!isActive)}
        >
            {label}
        </button>
    );
}

