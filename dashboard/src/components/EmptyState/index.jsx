import { Inbox } from "lucide-react";

const EmptyState = ({ title = "No items to show", description }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-10 w-10 text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700">{title}</p>

        {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
    </div>
);

export default EmptyState;
