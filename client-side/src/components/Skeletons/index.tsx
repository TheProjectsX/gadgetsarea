export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
        {/* header */}
        <div className="grid grid-cols-4 gap-4 bg-gray-50 px-4 py-3">
            {Array.from({ length: cols }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 w-24 rounded bg-gray-200 animate-pulse"
                />
            ))}
        </div>

        {/* body */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
                key={rowIdx}
                className="grid grid-cols-4 gap-4 px-4 py-3 border-t"
            >
                {Array.from({ length: cols }).map((_, colIdx) => (
                    <div
                        key={colIdx}
                        className="h-4 w-full rounded bg-gray-200 animate-pulse"
                    />
                ))}
            </div>
        ))}
    </div>
);
