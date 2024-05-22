"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { transactionType } from "@/types/transaction.type";
import Table from "../components/table";
import { useDebounce } from "@/app/hooks/useDebounce.hook";
import { buildQueryString } from "@/app/helpers/url-search-params.helper";

enum orderType {
  ASC = "asc",
  DESC = "desc",
}

export default function Reports() {
  const notify = (message: any) => toast(message);
  const [transactions, setTransactions] = useState<
    | {
        mostTransactions: transactionType[];
        leastTransactions: transactionType[];
      }
    | undefined
  >(undefined);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const debouncedFilters = useDebounce(filters, 1000);

  const fetchData = useCallback(() => {
    const sortString = buildQueryString(filters);

    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3000/transactions/reports?${sortString}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setTransactions(result);
    };

    fetchData().catch((error) => {
      notify(`An error occurred while fetching the data: ${error}`);
    });
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <section>
      <div className="mt-4 -my-4 flex items-center justify-between">
        <div className="sm:flex-col sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Reports
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A summary of all transactions.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">From</span>
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="date"
              name="startDate"
              id="startDate"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="100"
              onChange={onChange}
            />
          </div>
          <span className="text-sm">to</span>
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="date"
              name="endDate"
              id="endDate"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="100"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      {transactions && (
        <>
          <Table
            header="Most transactions"
            transactions={transactions?.mostTransactions}
          />
          <Table
            header="Least transactions"
            transactions={transactions?.leastTransactions}
          />
        </>
      )}
    </section>
  );
}
