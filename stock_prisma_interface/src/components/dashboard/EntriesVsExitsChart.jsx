import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function EntriesVsExitsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="entradas" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
        <Area type="monotone" dataKey="saidas" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}