import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { SalesData } from './models/SalesData';
import { Label } from '@fluentui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface IHelloWorldProps {
  name?: string;
  context?: ComponentFramework.Context<IInputs>;
}

interface IHelloWorldState {
  salesData: SalesData[];
}

export class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState> {
  constructor(props: IHelloWorldProps) {
    super(props);
    this.state = {
      salesData: []
    };
  }

  componentDidMount() {
    this.fetchSalesData();
  }

  fetchSalesData = async () => {
    const { context } = this.props;

    if (context) {
      try {
        const result = await context.webAPI.retrieveMultipleRecords("cr4c5_salesdata", "?$select=cr4c5_productname,cr4c5_quantity,cr4c5_price,cr4c5_date&$top=15");
        this.setState({ salesData: result.entities as SalesData[] });
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    }
  }

  render() {
    const labels = this.state.salesData.map(item => item.cr4c5_productname);
    const quantities = this.state.salesData.map(item => item.cr4c5_quantity);
    const prices = this.state.salesData.map(item => item.cr4c5_price);

    const quantityData = {
      labels,
      datasets: [{
        label: 'Quantity Sold',
        data: quantities,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }]
    };

    const priceData = {
      labels,
      datasets: [{
        label: 'Price (€)',
        data: prices,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    return (
      <div style={{
        width: '50%',
        margin: 'auto',
        padding: '20px'
      }}>
        <Label style={{
          fontSize: '24px',
          fontWeight: 'bold'
        }}>{this.props.name}</Label>
        <Bar data={quantityData} options={options} />
        <Line data={priceData} options={options} />
      </div>
    );
  }
}
