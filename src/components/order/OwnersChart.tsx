import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Owner {
    id: string;
    fullName: string;
    ownershipPercentage: number;
    isCompany: boolean;
}

interface OwnersChartProps {
    owners: Owner[];
}

// Purple color variations for the doughnut chart
const purpleColors = [
    '#7e22ce', // Dark purple
    '#9333ea', // Medium purple
    '#a855f7', // Light purple
    '#c084fc', // Lighter purple
    '#d8b4fe', // Lightest purple
];

const OwnersChart = ({ owners }: OwnersChartProps) => {
    // Prepare doughnut chart data for owners
    const getOwnersChartData = () => {
        if (owners.length === 0) return null;

        const labels = owners.map(owner => `${owner.ownershipPercentage}% - ${owner.fullName}`);
        const data = owners.map(owner => owner.ownershipPercentage);
        const backgroundColor = owners.map((_, index) => 
            purpleColors[index % purpleColors.length]
        );
        const borderColor = '#ffffff';
        const borderWidth = 2;

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor,
                    borderColor,
                    borderWidth,
                },
            ],
        };
    };

    const chartData = getOwnersChartData();
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    padding: 12,
                    font: {
                        size: 12,
                    },
                    color: '#1a1a1a',
                },
            },
            tooltip: {
                enabled: true,
            },
        },
        cutout: '60%',
    };

    if (!chartData) {
        return (
            <span className="text-sm text-muted-foreground">No owners added</span>
        );
    }

    return (
        <div className="w-full max-w-[300px] h-[200px]">
            <Doughnut data={chartData} options={chartOptions} />
        </div>
    );
};

export default OwnersChart;

