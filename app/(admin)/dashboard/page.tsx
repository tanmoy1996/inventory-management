"use client";
import { useEffect } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { getDashboardData } from "@/store/slices/dashboard";
import { useAppSelector, useAppDispatch } from "@/hooks";
import { RootState } from "@/store";
import hand from "@/assets/image/wavingHand.svg";
import Image from "next/image";
import TextWidget from "@/components/dashboard/TextWidget";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import dayjs from "dayjs";
import LineChartWidget from "@/components/dashboard/LineChart";
import DoughnutChartWidget from "@/components/dashboard/DoughnutChart";
import BoxLoader from "@/components/shared/BoxLoader";

const getFinancialYearDates = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const startYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  const endYear = startYear + 1;

  const startDate = new Date(startYear, 3, 1); // April 1st
  const endDate = new Date(endYear, 2, 31, 23, 59, 59, 999); // March 31st

  return { startDate, endDate };
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { status, textWidgetData, chartWidgetData } = useAppSelector(
    (state: RootState) => state.dashboard
  );

  const { startDate, endDate } = getFinancialYearDates();

  useEffect(() => {
    dispatch(getDashboardData());
  }, []);

  return (
    <main className="h-full w-full">
      <Box className=" mb-4">
        <Box className="flex gap-1 items-center">
          <Typography variant="h6">Hi, John</Typography>
          <Image width={30} height={30} src={hand} alt="xlx logo" />
        </Box>
        <Typography variant="body1" sx={{ mb: 1, color: "#aaaaaa" }}>
          {`${dayjs(startDate).format("DD MMM YYYY")} - ${dayjs(endDate).format(
            "DD MMM YYYY"
          )}`}
        </Typography>
      </Box>
      {status === "succeeded" ? (
        <>
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <TextWidget
              icon={
                <CategoryOutlinedIcon
                  sx={{ fontSize: "24px", color: "#FFFFFF" }}
                />
              }
              iconBackground="#3CD293"
              label="Items"
              headerLabel="items"
              header={textWidgetData?.items?.totalItems}
              subHeaderLabel="items out of stock"
              link="/inventory"
              subheading={textWidgetData?.items?.zeroQuantityItems}
            />
            <TextWidget
              icon={
                <FmdGoodOutlinedIcon
                  sx={{ fontSize: "24px", color: "#FFFFFF" }}
                />
              }
              iconBackground="#F49B43"
              label="Projects"
              headerLabel="projects"
              header={textWidgetData?.project?.totalProjects}
              subHeaderLabel="ongoing projects"
              link="/projects"
              subheading={textWidgetData?.project?.incompleteProjects}
            />
            <TextWidget
              icon={
                <ShoppingCartOutlinedIcon
                  sx={{ fontSize: "24px", color: "#FFFFFF" }}
                />
              }
              iconBackground="#6083FA"
              label="Purchases"
              headerLabel="purchases"
              header={textWidgetData?.purchase?.grossAmount.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                  style: "currency",
                  currency: "INR",
                }
              )}
              subHeaderLabel="purchases"
              link="/purchases"
              subheading={textWidgetData?.purchase?.totalPurchases}
            />
            <TextWidget
              icon={
                <RequestQuoteOutlinedIcon
                  sx={{ fontSize: "24px", color: "#FFFFFF" }}
                />
              }
              iconBackground="#F83B3E"
              label="Sales"
              headerLabel="sales"
              header={textWidgetData?.sales?.grossAmount.toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                  style: "currency",
                  currency: "INR",
                }
              )}
              subHeaderLabel="bills"
              link="/bills"
              subheading={textWidgetData?.sales?.totalBills}
            />
          </Box>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LineChartWidget
              chartDetails={chartWidgetData?.purchaseVsSalesData}
            />
            <DoughnutChartWidget chartDetails={chartWidgetData?.billPieData} />
          </Box>
        </>
      ) : (
        <>
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <BoxLoader className="h-[170px] w-full rounded" />
            <BoxLoader className="h-[170px] w-full rounded" />
            <BoxLoader className="h-[170px] w-full rounded" />
            <BoxLoader className="h-[170px] w-full rounded" />
          </Box>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BoxLoader className="col-span-2 h-[400px] w-full rounded" />
            <BoxLoader className="h-[400px] w-full rounded" />
          </Box>
        </>
      )}
    </main>
  );
};

export default Dashboard;
