"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { itemType } from "@/types/item.type";
import { useDebounce } from "../hooks/useDebounce.hook";
import { buildQueryString } from "../helpers/url-search-params.helper";
import { formatDate } from "../helpers/format-date.helper";

enum orderType {
  ASC = "asc",
  DESC = "desc",
}

export default function Items() {
  const notify = (message: any) => toast(message);
  const router = useRouter();
  const [items, setItems] = useState<itemType[]>([]);
  const [filters, setFilters] = useState({
    itemName: "",
    startDate: "",
    endDate: "",
  });
  const [order, setOrder] = useState<{ sortBy: string; order: orderType }>({
    sortBy: "",
    order: orderType.DESC,
  });

  const debouncedFilters = useDebounce(filters, 1000);

  const fetchData = useCallback(() => {
    const queryString = buildQueryString(debouncedFilters);
    const filterString = buildQueryString(order);

    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:3000/items?${queryString}&${filterString}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setItems(result);
    };

    fetchData().catch((error) => {
      notify(`An error occurred while fetching the data: ${error}`);
    });
  }, [debouncedFilters, order]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDeleteItem = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.type}`);
      }

      notify("Successfully delete item");

      fetchData();
    } catch (error) {
      toast(`An error occurred while posting the data: ${error}`);
    }
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const onSortBy = (field: string) => {
    setOrder((prevOrder) => ({
      order: prevOrder.order === orderType.ASC ? orderType.DESC : orderType.ASC,
      sortBy: field,
    }));
  };

  return (
    <section>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-2 text-sm text-gray-700">
            A list of all the items in stocks.{" "}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push("/items/create")}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add item
          </button>
        </div>
      </div>
      <div className="mt-6 -my-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="itemName"
            className="block text-sm font-medium  text-gray-900"
          >
            Search
          </label>
          <div>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                name="itemName"
                id="itemName"
                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="filter by item name"
                onChange={onChange}
              />
            </div>
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
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <Link
                        onClick={() => onSortBy("name")}
                        href="#sortByName"
                        className="group inline-flex"
                      >
                        Name
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <Link
                        onClick={() => onSortBy("stock")}
                        href="#sortByStock"
                        className="group inline-flex"
                      >
                        Stock
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <Link
                        onClick={() => onSortBy("createdAt")}
                        href="#sortByDate"
                        className="group inline-flex"
                      >
                        Created at
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                            className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.length > 0 ? (
                    items.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {index + 1}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.stock}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="flex space-x-5  whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => router.push(`/items/${item.id}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                              <span className="sr-only">, {item.name}</span>
                            </button>

                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => onDeleteItem(item.id)}
                            >
                              Delete
                              <span className="sr-only">, {item.name}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="flex p-4 text-sm text-gray-500 font-bold">
                        <p>No data found, add some.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => onSortBy("sortByDate")}
        id="sortByDate"
        hidden
        aria-hidden="true"
      ></button>
      <button
        onClick={() => onSortBy("sortByName")}
        id="sortByName"
        hidden
        aria-hidden="true"
      ></button>
    </section>
  );
}
