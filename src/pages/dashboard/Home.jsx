import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import Layout from "../../layout/Layout";
import "react-calendar/dist/Calendar.css";
import styles from "./home.module.css";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";

const Home = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-daybook-date`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }

        );
        if (response.status === 200) {
          const apiDates = response.data.received_date.map(
            (item) => item.received_date
          );
          setHighlightedDates(apiDates);
        } else {
          console.error("Error fetching dates:", response.data);
        }
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };
    fetchDates();
  }, []);

  const isDateHighlighted = (date) => {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() + 1);
    const formattedDate = previousDay.toISOString().split("T")[0];
    return highlightedDates.includes(formattedDate);
  };

  // const handleDateChange = (selectedDate) => {
  //   const formattedDate = selectedDate.toISOString().split("T")[0];

  //   setDate(selectedDate);

  //   if (isDateHighlighted(selectedDate)) {
  //     navigate("/edit-daybook", { state: { selectedDate: formattedDate } });
  //   } else {
  //     navigate("/add-daybook", { state: { selectedDate: formattedDate } });
  //   }
  // };

  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate
    .toLocaleDateString("en-GB")
    .split("/")
    .reverse()
    .join("-");

    if (isDateHighlighted(selectedDate)) {
      const currentIndex = highlightedDates.indexOf(formattedDate);
      const nextDate = highlightedDates[currentIndex - 1];

      if (nextDate) {
        setDate(new Date(nextDate));
      }

      navigate("/edit-daybook", { state: { selectedDate: formattedDate } });
    } else {
      navigate("/add-daybook" ,  { state: { selectedDate: formattedDate } });
    }
  };

  return (
    <Layout>
      <div className={styles["calendar-container"]}>
        <Calendar
          className={styles["calendar"]}
          onChange={handleDateChange} 
          value={date} 
          tileClassName={({ date }) =>
            isDateHighlighted(date)
              ? styles["highlighted"]
              : styles["normalDate"]
          }
        />
      </div>
    </Layout>
  );
};

export default Home;
