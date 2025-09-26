import useAppStore from "../store/useAppStore";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import type { Result, Intent } from "../types";
import { useMemo } from "react";

export default function ResultsDashboard() {
    const { results, filter, setFilter } = useAppStore();

    const filteredResults: Result[] = useMemo(() => (
        Array.isArray(results) ? (filter === "All" ? results : results.filter((r) => r.intent === filter)) : []
    ), [results, filter]);

    const COLORS: Record<Intent, string> = {
        All: "", // Not used in chart
        High: "#22c55e",
        Medium: "#eab308",
        Low: "#ef4444",
    };

    const chartData = useMemo(() => (
        (["High", "Medium", "Low"] as const).map((intent) => ({
            name: intent,
            value: results.filter((r) => r.intent === intent).length,
            color: COLORS[intent],
        })).filter(data => data.value > 0)
    ), [results]);

    const handleExport = () => {
        const csv = [
            ["Name", "Role", "Company", "Industry", "Intent", "Score", "Reasoning", "Rules Score", "AI Points"],
            ...results.map((r) => [
                `"${r.name}"`, // Wrap in quotes to handle commas
                `"${r.role}"`,
                `"${r.company}"`,
                `"${r.industry}"`,
                r.intent,
                r.score,
                `"${r.reasoning.replace(/"/g, '""')}"`, // Handle quotes in reasoning
                r.rules_score,
                r.ai_points,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "lead_scoring_results.csv";
        link.click();
    };

    if (results.length === 0) {
        return (
            <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-blue-500 text-center text-gray-500">
                <h2 className="text-xl font-semibold mb-2">Results Dashboard</h2>
                <p>Run the scoring pipeline to see results here.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-blue-500 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">Results Dashboard ({results.length} Leads)</h2>
                <button
                    onClick={handleExport}
                    className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200 flex items-center shadow-md text-sm"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Export CSV
                </button>
            </div>

            {/* MODIFICATION: Removed lg:flex-row to ensure vertical stacking (Chart above Table) 
                on all screen sizes, including desktop.
            */}
            <div className="flex flex-col gap-6">
                
                {/* Intent Distribution Chart - Now always full width */}
                <div className="w-full flex flex-col items-center bg-gray-50 p-4 rounded-xl shadow-inner">
                    <h3 className="text-lg font-semibold mb-3">Intent Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent as number * 100).toFixed(0)}%)`}
                            >
                                {(chartData || []).map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} Leads`, name]} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Filtering and Table - Now always full width */}
                <div className="w-full">
                    <div className="flex flex-wrap gap-3 mb-4">
                        {(["All", "High", "Medium", "Low"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full font-medium transition duration-150 shadow-sm text-sm ${
                                    filter === f 
                                        ? 'bg-blue-600 text-white shadow-blue-300' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {f} ({f === "All" ? results.length : (results || []).filter(r => r.intent === f).length})
                            </button>
                        ))}
                    </div>
                    
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (Role)</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intent</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reasoning</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredResults.map((r, index) => (
                                    // Use index as a fallback key, though r.id should be preferred if guaranteed unique
                                    <tr key={r.id || index} className="hover:bg-gray-50 transition duration-100">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{r.name}</div>
                                            <div className="text-xs text-gray-500">{r.role} at {r.company}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    r.intent === "High" ? "bg-green-100 text-green-800" :
                                                    r.intent === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                                    "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {r.intent}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{r.score?.toFixed(1) || 'N/A'}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700 max-w-xs">{r.reasoning}</td>
                                    </tr>
                                ))}
                                {filteredResults.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No leads match the selected filter.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
