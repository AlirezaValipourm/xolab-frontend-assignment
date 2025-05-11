import React, { JSX } from 'react';

export type TypographyVariant =
    "h"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "h7"
    | "body1"
    | "body2"
    | "body3"
    | "caption1"
    | "caption2"
    | "caption3"
    ;

// Map of variant styles
const variants: Record<TypographyVariant, string> = {
    h: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h1: "scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl",
    h2: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h3: "scroll-m-20 text-xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-lg font-semibold tracking-tight",
    h5: "scroll-m-20 text-base font-semibold tracking-tight",
    h6: "scroll-m-20 text-sm font-semibold tracking-tight",
    h7: "scroll-m-20 text-xs font-medium leading-normal",
    body1: "leading-7 text-base [&:not(:first-child)]:mt-6",
    body2: "leading-7 text-sm [&:not(:first-child)]:mt-6",
    body3: "leading-normal text-xs [&:not(:first-child)]:mt-4",
    caption1: "text-xs font-medium leading-none",
    caption2: "text-[0.625rem] font-medium leading-none",
    caption3: "text-[0.5rem] font-medium leading-none",
};

// Default HTML element mapping for variants
const defaultElementMap: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
    h: "h1",
    h1: "h2",
    h2: "h3",
    h3: "h4",
    h4: "h5",
    h5: "h6",
    h6: "span",
    h7: "span",
    caption1: "p",
    caption2: "p",
    caption3: "p",
    body1: "p",
    body2: "p",
    body3: "p",
};

export type TypographyWeight = "regular" | "medium" | "bold"

const weights: Record<TypographyWeight, string> = {
   bold:"font-bold",
   regular:"font-normal",
   medium:"font-medium"
};

interface TypographyProps {
    variant: TypographyVariant;
    weight?:TypographyWeight
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    children: React.ReactNode;
    [key: string]: any;  // Allow any additional props
}

const Typography = ({
    variant,
    children,
    className = "",
    as,
    weight = "medium",
    ...props
}: TypographyProps): JSX.Element => {
    const Component = as || defaultElementMap[variant];

    return (
        <Component
            className={`${variants[variant]} ${weights[weight]} ${className} `}
            {...props}
        >
            {children}
        </Component>
    );
};

export { Typography };