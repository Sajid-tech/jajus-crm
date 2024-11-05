import React from "react";

const DashboardCard = ({ title, value }) => (
  <div className="w-full md:w-1/3 p-4">
    <div className="flex flex-col p-5 bg-white border-t-4 border-t-blue-600 shadow-lg rounded-xl transition-transform transform hover:scale-105 duration-300 dark:bg-neutral-900 dark:border-neutral-700 dark:border-t-blue-500 dark:shadow-neutral-700/70">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

export default DashboardCard;
