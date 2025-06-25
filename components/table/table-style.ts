export const tableStyle = {
    th: [
        "first:rounded-none",
        "last:rounded-none",
        "light:bg-white",
        "dark:bg-background",
    ],
    base: "min-w-full whitespace-nowrap gap-0",
    table: "w-full whitespace-nowrap",
    thead: [
        "dark:bg-background",
        "data-[focus-visible=true]:z-0",
        "bg-white",
        "[&>tr]:first:shadow-none",
        "[&>tr]:first:dark:bg-background",
    ],
    tr: [
        "border-b",
        "first:border-t-none",
        "last:border-none",
    ]
}

export const paginationStyle = {
    wrapper: "bg-secondary dark:bg-background border dark:border-neutral-800",
    item: "dark:bg-background",
    prev: "dark:bg-background",
    next: "dark:bg-background"
}