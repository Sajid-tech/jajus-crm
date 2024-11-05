import Layout from "../../layout/Layout";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

import { useContext, useEffect, useState } from "react";
import { ContextPanel } from "../../utils/ContextPanel";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { FaPrint } from "react-icons/fa";
const Participant = () => {
  const [participant, setParticipant] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (!isPanelUp) {
          naviagte("/maintenance");
          return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-idcard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Check if the response has the expected structure
        if (response.data && response.data.registeridcard) {
          setParticipant(response.data.registeridcard);
          // console.log("participantsdata", response.data.registeridcard);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };
    fetchParticipants();
    setLoading(false);
  }, []);

  // Filter participants based on search query
  const searchParticipants = participant.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.id_name_of_firm?.toLowerCase().includes(query) ||
      item.id_card_brand_name?.toLowerCase().includes(query) ||
      item.idcardsub_rep_name?.toLowerCase().includes(query) ||
      item.idcardsub_rep_mobile?.toLowerCase().includes(query)
    );
  });

  // Calculate total number of pages
  const totalPages = Math.ceil(searchParticipants.length / itemsPerPage);

  // Get current items
  const currentItems = searchParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" className=" bg-blue-100 mb-8 p-6">
            <Typography variant="h6" color="black">
              Participants List
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <div className="w-full p-2">
              <form>
                <div className="relative">
                  <AiOutlineSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-600" />
                  <input
                    type="search"
                    placeholder="Search by Firm Name, Brand Name, Person Name, Mobile No"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </form>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
                      SL. No
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Firm Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Person Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Mobile No
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.id_name_of_firm}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.id_card_brand_name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.idcardsub_rep_name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.idcardsub_rep_mobile}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-900">
                            <FaPrint />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between mt-4 p-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default Participant;
