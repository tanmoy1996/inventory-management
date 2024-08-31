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

const DoughnutChartWidget = ({ chartDetails }: ChartWidgetProps) => {

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
          type: 'doughnut',
          data: {
            labels: ['Payment Received', 'Payment Pending'],
            datasets: [
              {
                data: [chartDetails?.paidBills, chartDetails?.unpaidBills],
                borderColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
                backgroundColor: ['rgb(75, 192, 192 )', 'rgb(255, 99, 132)'],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Payment Status',
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
  }, [chartDetails])

  return (
    <Box className="col-span-1 bg-white border rounded p-4 shadow-lg">
      <canvas ref={canvasRef} id="billPaymentChart"></canvas>
    </Box>
  )
}

export default DoughnutChartWidget
