import { useEffect, useState } from "react";
import API from "../api/axios";

const RequestsTable = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    API.get("/reports?limit=5")
      .then(res => setReports(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="px-10 py-10 bg-white">
      <h2 className="text-xl font-bold mb-4">Recent Public Requests</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th>Issue</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((r, i) => (
            <tr key={i} className="border-b">
              <td className="py-3">{r.title?.original}</td>
              <td>{r.category}</td>
              <td>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {r.status}
                </span>
              </td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
