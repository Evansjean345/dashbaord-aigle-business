import { Transaction } from "@/types/transaction.types";
import { create } from "zustand";

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  getTransaction: (transactionId: string) => Transaction | undefined;
  getTransactions: () => Transaction[];
}
export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [...state.transactions, transaction],
    }));
  },
  updateTransaction: (transaction) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === transaction.id ? transaction : t
      ),
    }));
  },
  getTransaction: (transactionId) => {
    return get().transactions.find((t) => t.id === transactionId);
  },
  getTransactions: () => {
    return get().transactions;
  },
}));

