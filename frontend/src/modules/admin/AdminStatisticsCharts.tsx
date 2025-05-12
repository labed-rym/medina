import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export interface StatisticItem {
  name: string;
  count: number;
  color: string;
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const AdminStatisticsCharts: React.FC<{ statisticsData: StatisticItem[] }> = ({ statisticsData }) => {
  // Total count for percentage calculation
  const totalCount = statisticsData.reduce((sum, item) => sum + item.count, 0);

  // Add percentage to each item for pie chart
  const pieData = statisticsData.map(item => ({
    ...item,
    percentage: ((item.count / totalCount) * 100).toFixed(1)
  }));

  // Custom label for pie chart to show percentages
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = (props: LabelProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Title styling for both charts
  const titleStyle = {
    fontSize: '30px',
    fontWeight: 700,
    color: '#354618',
    textAlign: 'center',
    marginBottom: '15px'
  } as React.CSSProperties;

  // Custom styles for the charts text
  const chartLabelStyle = {
    fill: '#000000',  // Black color for labels
    fontSize: '19px'
    
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px', marginBottom: '40px' }}>
      {/* Pie Chart */}
      <div style={{ backgroundColor: '#F4F6F2', padding: '20px', borderRadius: '8px' }}>
        <h3 style={titleStyle}>Répartition des Utilisateurs par Catégorie</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                formatter={(value) => <span style={{ color: '#000000' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart - Direct representation of user types and counts */}
      <div style={{ backgroundColor: '#F4F6F2', padding: '20px', borderRadius: '8px' }}>
        <h3 style={titleStyle}>Nombre d'Utilisateurs par Profession</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statisticsData}
              margin={{
                top: 5,
                right: 40,
                left: 40,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#000000' }} // Black color for X-axis labels
                axisLine={{ stroke: '#000000' }}
              />
              <YAxis 
                domain={[0, 'dataMax + 10']} 
                tick={{ fill: '#000000' }} // Black color for Y-axis labels
                axisLine={{ stroke: '#000000' }}
              />
              <Bar dataKey="count" name="Nombre d'utilisateurs">
                {statisticsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsCharts;