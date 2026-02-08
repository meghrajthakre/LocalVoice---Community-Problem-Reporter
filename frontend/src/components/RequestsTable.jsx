import { useEffect, useState } from "react";
import API from "../api/axios";

const demoData = [
  {
    _id: "1",
    title: { original: "Large pothole on Main Road" },
    category: "Pothole",
    status: "new",
    createdAt: "2026-02-05T10:20:00Z",
  },
  {
    _id: "2",
    title: { original: "Street light not working" },
    category: "Electricity",
    status: "in-progress",
    createdAt: "2026-02-03T14:10:00Z",
  },
  {
    _id: "3",
    title: { original: "Garbage not collected" },
    category: "Sanitation",
    status: "resolved",
    createdAt: "2026-02-01T09:00:00Z",
  },
  {
    _id: "4",
    title: { original: "Water leakage near market" },
    category: "Water",
    status: "new",
    createdAt: "2026-02-04T12:30:00Z",
  },
];

const RequestsTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/reports?limit=5");
        setReports(res.data.data);
      } catch (err) {
        console.log("API error, using demo data");
        setReports(demoData); // fallback demo data
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "new")
      return "bg-blue-100 text-blue-600";
    if (status === "in-progress")
      return "bg-yellow-100 text-yellow-700";
    if (status === "resolved")
      return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="px-10 py-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Recent Public Requests</h2>

      {loading ? (
        <p className="text-gray-500">Loading reports...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-gray-600">
                <th className="py-3">Issue</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">
                    {r.title?.original}
                  </td>

                  <td className="text-gray-600">
                    {r.category}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reports.length === 0 && (
            <p className="text-center py-6 text-gray-400">
              No requests found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestsTable;
