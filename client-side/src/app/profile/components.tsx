export const DataCard = ({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string;
}) => {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
                <Icon size={20} className="text-blue-600" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-all">
                    {value}
                </p>
            </div>
        </div>
    );
};
