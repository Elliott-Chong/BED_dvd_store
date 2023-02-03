import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../components/Loader";

type Props = {};
type Transaction = {
  date: string;
  amount: any;
};

const Transactions = (props: Props) => {
  const { data: transactions, isLoading } = useQuery({
    queryFn: async () => {
      let response = await axios.get(`/api/transactions`);
      response.data = response.data as Transaction[];
      response.data = response.data.sort(
        (a: Transaction, b: Transaction) =>
          new Date(a.date).valueOf() - new Date(b.date).valueOf()
      );
      response.data.map((transaction: Transaction) => {
        transaction.amount = parseFloat(transaction.amount.toFixed(2));
      });

      return response.data;
    },
    queryKey: ["transactions"],
  });
  if (isLoading) return <Loader />;
  return (
    <main className="px-12">
      <ResponsiveContainer className="center-it" width="90%" height={400}>
        <LineChart
          width={500}
          height={300}
          data={transactions}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
          <XAxis dataKey="date" />
          <YAxis dataKey="amount" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </ResponsiveContainer>
    </main>
  );
};

export default Transactions;
