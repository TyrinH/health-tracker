/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Head from "next/head";
// import { useSession } from "next-auth/react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { api } from "~/utils/api";
import dayjs from "dayjs";


const Stats: NextPage = () => {
  // const { data: sessionData } = useSession();
  const allEntries = api.entries.getAllEntries.useQuery();

const moodCounts = allEntries.data?.reduce((acc, entry) => {
  if (entry.mood === "Happy") {
    acc.happy++;
  } else if (entry.mood === "Meh") {
    acc.meh++;
  } else if (entry.mood === "Sad") {
    acc.sad++;
  }
  return acc;
}
, { happy: 0, meh: 0, sad: 0 });

const dateCounts = allEntries.data?.reduce((acc, entry) => {
  if (dayjs(entry.date).month() === 0) {
    acc.january++;
  }
  if (dayjs(entry.date).month() === 1) {
    acc.february++;
}
if (dayjs(entry.date).month() === 2) {
  acc.march++;
}
if (dayjs(entry.date).month() === 3) {
  acc.april++;
}
if (dayjs(entry.date).month() === 4) {
  acc.may++;
}
if (dayjs(entry.date).month() === 5) {
  acc.june++;
}
if (dayjs(entry.date).month() === 6) {
  acc.july++;
}
if (dayjs(entry.date).month() === 7) {
  acc.august++;
}
if (dayjs(entry.date).month() === 8) {
  acc.september++;
}
if (dayjs(entry.date).month() === 9) {
  acc.october++;
}
if (dayjs(entry.date).month() === 10) {
  acc.november++;
}
if (dayjs(entry.date).month() === 11) {
  acc.december++;
}
  return acc;
}
, { january: 0, february: 0, march: 0, april: 0, may: 0, june: 0, july: 0, august: 0, september: 0, october: 0, november: 0, december: 0 });
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
  );
  const doughnutData = {
    labels: ["Happy", "Meh", "Sad"],
    datasets: [
      {
        label: "# of Moods",
        data: [moodCounts?.happy, moodCounts?.meh, moodCounts?.sad],
        backgroundColor: [
          "rgba(28, 240, 0, 0.2)", //green
          "rgba(255, 228, 56, 0.2)", //yellow
          "rgba(255, 0, 0, 0.2)", //red
        ],
        borderColor: [
          "rgba(28, 240, 0, 1)", //green
          "rgba(255, 228, 56, 1)", //yellow
          "rgba(255, 0, 0, 1)", //red
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Mood counts by month',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Mood counts by month',
        data: [dateCounts?.january, dateCounts?.february, dateCounts?.march, dateCounts?.april, dateCounts?.may, dateCounts?.june, dateCounts?.july],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (
    <>
      <Head>
        <title>Stats</title>
        <meta name="description" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-center text-4xl font-bold text-white">Stats</h1>
          <p className="text-center text-white">Here are your stats</p>
          <p className="text-center text-white">
            You can see how many entries you have made and how many days you
            have been active
          </p>
          <div>
            <Doughnut data={doughnutData} />
          </div>
          <div>
          <Bar options={options} data={barChartData} />
          </div>
          <div className="flex flex-col items-center gap-2"></div>
        </div>
      </main>
    </>
  );
};

export default Stats;