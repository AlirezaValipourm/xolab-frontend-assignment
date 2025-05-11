import { FC, Fragment, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Typography, TypographyVariant, TypographyWeight } from './Typography';

interface ITypographyWithKeywordsProps {
    text: string;
    variant: TypographyVariant;
    weight?: TypographyWeight;
    className?: string;
    keywords: string[];
    keywordClassName?: string;
    renderTag?: (text: string, index: number) => ReactNode;
}

export const TypographyWithKeywords: FC<ITypographyWithKeywordsProps> = ({
    keywords,
    keywordClassName,
    text,
    variant,
    weight,
    className,
    renderTag,
}) => {
    // Memoize sorted keywords to prevent unnecessary recalculations
    const sortedKeywords = useMemo(() => 
        // Sort keywords by length to handle nested or overlapping cases correctly (longer first)
        [...keywords].sort((a, b) => b.length - a.length),
    [keywords]);

    // Moved validation to a callback to properly handle dependencies
    const validateKeywords = useCallback(() => {
        const missingKeywords = keywords.filter(
            (keyword) => !text.toLowerCase().includes(keyword.toLowerCase())
        );
        if (missingKeywords.length > 0) {
            console.warn(
                `The following keywords are not found in the text: ${missingKeywords.join(', ')}`
            );
        }
    }, [text, keywords]);

    // Client-side only validation
    useEffect(() => {
        validateKeywords();
    }, [validateKeywords]);

    // Memoize content generation to prevent recalculation on each render
    const content = useMemo(() => {
        if (!keywords.length) return [text];

        let parts: ReactNode[] = [];
        let remainingText = text;

        while (remainingText) {
            const keywordIndex = sortedKeywords.reduce(
                (acc, keyword) => {
                    const index = remainingText.toLowerCase().indexOf(keyword.toLowerCase());
                    return index !== -1 && (acc === -1 || index < acc) ? index : acc;
                },
                -1
            );

            if (keywordIndex === -1) {
                parts.push(remainingText);
                break;
            }

            const matchedKeyword = sortedKeywords.find(
                (keyword) =>
                    remainingText
                        .toLowerCase()
                        .indexOf(keyword.toLowerCase()) === keywordIndex
            );

            if (!matchedKeyword) break;

            const beforeKeyword = remainingText.substring(0, keywordIndex);
            
            // Use the actual matched text from the original string to preserve case
            const actualMatchedText = remainingText.substring(
                keywordIndex, 
                keywordIndex + matchedKeyword.length
            );
            
            const highlightedKeyword = renderTag
                ? renderTag(
                    actualMatchedText, 
                    keywords.findIndex(k => k.toLowerCase() === matchedKeyword.toLowerCase())
                  )
                : <span className={keywordClassName}>{actualMatchedText}</span>;
            
            const afterKeyword = remainingText.substring(
                keywordIndex + matchedKeyword.length
            );

            if (beforeKeyword) parts.push(beforeKeyword);
            parts.push(highlightedKeyword);
            remainingText = afterKeyword;
        }

        return parts;
    }, [text, sortedKeywords, renderTag, keywordClassName, keywords]);

    return (
        <Typography variant={variant} weight={weight} className={className}>
            {content.map((item, index) => {
                // Use a more stable key strategy
                const key = typeof item === 'string' 
                    ? `text-${index}-${item.substring(0, 10)}` 
                    : `element-${index}`;
                    
                return <Fragment key={key}>{item}</Fragment>;
            })}
        </Typography>
    );
};