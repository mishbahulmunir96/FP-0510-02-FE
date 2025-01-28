// "use client";
// import React from "react";
// import TransactionListCard, {
//   Transaction,
// } from "./component/TransactionListCard";
// import useGetTransactionsByUser from "@/hooks/api/transaction/useGetTransactionByUser";

// const TransactionListPage = () => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}"); // Mengambil data user
//   const userId = user.id; // Mendapatkan userId dari data pengguna
//   const { data, isLoading, error } = useGetTransactionsByUser(user.id, 1, 10); // Mendapatkan data transaksi

//   if (isLoading) return <div>Loading transactions...</div>;
//   if (error) return <div>Error loading transactions: {error.message}</div>;

//   return (
//     <main className="mx-20">
//       {data && data.data.length > 0 ? (
//         data.data.map((transaction: Transaction) => (
//           <TransactionListCard key={transaction.id} transaction={transaction} />
//         ))
//       ) : (
//         <div>No transactions found.</div>
//       )}
//     </main>
//   );
// };

// export default TransactionListPage;
