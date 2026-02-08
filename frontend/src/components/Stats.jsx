import { useEffect, useState } from "react";
import API from "../api/axios";

const Stats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/reports/stats")
      .then(res => setStats(res.data.data))
      .catch(err => console.log(err));
  }, []);

  if (!stats) return <div className="p-10">Loading stats...</div>;

  return (
    <div className="grid grid-cols-4 gap-6 px-10 py-10 bg-white">
      <StatCard title="Total Issues" value={stats.total}/>
      <StatCard title="New" value={stats.byStatus.new}/>
      <StatCard title="In Progress" value={stats.byStatus["in-progress"]}/>
      <StatCard title="Resolved" value={stats.byStatus.resolved}/>
    </div>
  );
};

const StatCard = ({title, value}) => (
  <div className="bg-gray-50 p-6 rounded-xl text-center shadow">
    <h2 className="text-2xl font-bold text-blue-600">{value}</h2>
    <p className="text-gray-600">{title}</p>
  </div>
);

export default Stats;
