'use client'
import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import Chart, { ChartConfiguration } from 'chart.js/auto'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface ChartWidgetProps {
  chartDetails: any
}

interface DataItem {
  _id: number
  value: number
}

const getFinancialYearLabels = (): string[] => {
  const labels: string[] = []
  const months: string[] = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  const currentYear: number = new Date().getFullYear()
  const nextYear: number = currentYear + 1

  for (let i = 0; i < 12; i++) {
    const month = months[i]
    const year = i < 9 ? currentYear : nextYear
    labels.push(`${month}, ${year.toString().slice(-2)}`)
  }

  return labels
}

const convertToFinancialYearArray = (data: DataItem[]): number[] => {
  const financialYearArray: number[] = new Array(12).fill(0)

  data.forEach((item) => {
    const monthIndex = (item._id - 4 + 12) % 12
    financialYearArray[monthIndex] = item.value
  })
  return financialYearArray
}

const LineChartWidget = ({ chartDetails }: ChartWidgetProps) => {
  const { navBarDesktopMini } = useAppSelector((state: RootState) => state.global)

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartDetails) {
      var ctx = canvasRef.current?.getContext('2d')
      if(ctx){
        if (chartRef.current) {
          chartRef.current.destroy();
        }
        const chartConfig: ChartConfiguration = {
          type: 'line',
          data: {
            labels: getFinancialYearLabels(),
            datasets: [
              {
                data: convertToFinancialYearArray(chartDetails[0]),
                label: 'Purchase',
                borderColor: '#3e95cd',
                backgroundColor: '#7bb6dd',
                fill: false,
              },
              {
                data: convertToFinancialYearArray(chartDetails[1]),
                label: 'Sales',
                borderColor: '#3cba9f',
                backgroundColor: '#71d1bd',
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Purchase vs Sales',
                align: 'start',
                padding: {
                  bottom: 20,
                },
                font: {
                  size: 20,
                  weight: 500,
                },
              },
              legend: {
                position: 'bottom',
              },
            },
            elements: {
              line: {
                tension: 0.4,
              },
            },
          },
        }
        chartRef.current = new Chart(ctx, chartConfig)
      }
    }
  }, [chartDetails, navBarDesktopMini])

  return (
    <Box className="col-span-1 md:col-span-2 bg-white border rounded p-4 shadow-lg">
      <canvas ref={canvasRef} id="purchaseVsSales"></canvas>
    </Box>
  )
}

export default LineChartWidget
