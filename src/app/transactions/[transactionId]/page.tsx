"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { formatDateForInput } from "@/app/helpers/format-date-input.helper";
import { itemType } from "@/types/item.type";
import { transactionType } from "@/types/transaction.type";

type formType = {
  item: number;
  amount: number;
  transactionDate: string;
};

export default function Edit({
  params,
}: {
  params: {
    transactionId: string;
  };
}) {
  const notify = (message: any) => toast(message);
  const router = useRouter();
  const [transaction, setTransaction] = useState<transactionType>();
  const [items, setItems] = useState<itemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<itemType | undefined>(
    undefined,
  );
  const [form, setForm] = useState<formType>({
    item: -1,
    amount: 0,
    transactionDate: "",
  });

  const fetchTransaction = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/transactions/${params.transactionId}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setTransaction(result);
    } catch (error) {
      notify(`An error occurred while fetching the data: ${error}`);
    }
  }, [params.transactionId]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/items");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setItems(result);
    } catch (error) {
      notify(`An error occurred while fetching the data: ${error}`);
    }
  }, []);
  useEffect(() => {
    fetchTransaction();
    fetchItems();
  }, [fetchItems, fetchTransaction]);

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`${response.type}`);
      }

      notify("Successfully created item");

      router.push("/");
    } catch (error) {
      toast(`An error occurred while posting the data: ${error}`);
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    if (name === "item") {
      setSelectedItem(items.find((item) => item.id === parseInt(value)));
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: name !== "transactionDate" ? parseInt(value) : value,
    }));
  };

  if (!transaction) return <h1>Loading...</h1>;

  return (
    transaction && (
      <section className="p-4 shadow-lg rounded-md">
        <form onSubmit={onSubmitForm}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Data
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information is about detail transaction that will be added
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="item"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Item Name
                  </label>
                  <div className="mt-2">
                    <select
                      id="item"
                      name="item"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                      onChange={onChange}
                      disabled
                      required
                    >
                      <option>-Select item-</option>;
                      {items.map((item) => {
                        return (
                          <option
                            key={item.id}
                            value={item.id}
                            selected={transaction?.item?.id === item.id}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Amount
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="number"
                        min={0}
                        max={selectedItem?.stock}
                        name="amount"
                        id="amount"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="100"
                        onChange={onChange}
                        defaultValue={transaction?.stockHistory}
                        disabled
                        required
                      />
                    </div>
                    {selectedItem && (
                      <span className="text-xs text-red-400">
                        Max order: {selectedItem?.stock}
                      </span>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="transactionDate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Transaction Date
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="datetime-local"
                        name="transactionDate"
                        id="transactionDate"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="100"
                        defaultValue={formatDateForInput(
                          transaction?.transactionDate,
                        )}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </section>
    )
  );
}
